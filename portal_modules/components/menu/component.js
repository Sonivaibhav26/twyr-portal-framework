/*
 * Name			: portal_modules/components/menu/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Menu Component
 *
 */

"use strict";

/**
 * Module dependencies, required for ALL Twyr modules
 */
var base = require('./../component-base').baseComponent,
	prime = require('prime'),
	promises = require('bluebird');

/**
 * Module dependencies, required for this module
 */
var filesystem = promises.promisifyAll(require('fs')),
	inflection = require('inflection'),
	path = require('path');

var menuComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);

		// Promisify what we need...
		this._setupMenuCacheAsync = promises.promisify(this._setupMenuCache);
		this._renderMenuTemplatesAsync = promises.promisify(this._renderMenuTemplates);
		this._renderMenuComponentsAsync = promises.promisify(this._renderMenuComponents);
	},

	'_getRoutes': function(request, renderFunc, callback) {
		var cacheSrvc = this.$dependencies.cacheService,
			self = this;

		menuComponent.parent._getRoutes.call(self, request, renderFunc, function(err, componentRoutes) {
			if(err) {
				callback(err);
				return;
			}

			var userId = ((request.user && request.user.id) ? request.user.id : 'public'),
				userData = null;

			cacheSrvc.getAsync('twyr!portal!user!' + userId)
			.then(function(cachedData) {
				userData = JSON.parse(cachedData);
				if(!userData) {
					throw({ 'code': 404, 'message': 'User not found' })
					return;
				}

				if(userData.sessionData && userData.sessionData[self.name])
					return;

				return self._setupMenuCacheAsync(userId, userData);
			})
			.then(function() {
				return self._renderMenuComponentsAsync(userData.sessionData[self.name], renderFunc);
			})
			.then(function(menuComponents) {
				callback(null, menuComponents + '\n' + componentRoutes);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				callback(err);
			});
		});
	},

	'_getTemplates': function(request, renderFunc, callback) {
		var cacheSrvc = this.$dependencies.cacheService,
			self = this;

		menuComponent.parent._getTemplates.call(self, request, renderFunc, function(err, componentTemplates) {
			if(err) {
				callback(err);
				return;
			}

			var userId = ((request.user && request.user.id) ? request.user.id : 'public'),
				userData = null;

			cacheSrvc.getAsync('twyr!portal!user!' + userId)
			.then(function(cachedData) {
				userData = JSON.parse(cachedData);
				if(!userData) {
					throw({ 'code': 404, 'message': 'User not found' })
					return;
				}

				if(userData.sessionData && userData.sessionData[self.name])
					return;

				return self._setupMenuCacheAsync(userId, userData);
			})
			.then(function() {
				return self._renderMenuTemplatesAsync(userData.sessionData[self.name], renderFunc);
			})
			.then(function(tmpl) {
				callback(null, tmpl + '\n' + componentTemplates);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error fetching menu items from database for user: ' + userId + '\n', err);
				callback(err);
			});
		});
	},

	'_renderMenuTemplates': function(menuData, renderAsync, callback) {
		var promiseResolutions = [];

		Object.keys(menuData).forEach(function(componentName) {
			var emberComponentName = inflection.camelize(componentName.replace(/-/g, '_')) + 'Component',
				templatePath = path.join(__dirname, 'ember/' + menuData[componentName].template + '.ejs'),
				renderOptions = {
					'componentName': componentName,
					'emberComponentName': emberComponentName,
					'menuItems': menuData[componentName].menuItems
				};


			promiseResolutions.push(renderAsync(templatePath, renderOptions));
		});

		promises.all(promiseResolutions)
		.then(function(renderedMenus) {
			callback(null, renderedMenus.join('\n'));
		})
		.catch(function(err) {
			callback(err);
		});
	},

	'_renderMenuComponents': function(menuData, renderAsync, callback) {
		var promiseResolutions = [];

		Object.keys(menuData).forEach(function(componentName) {
			if(menuData[componentName].template != 'vertical')
				return;

			var emberComponentName = inflection.camelize(componentName.replace(/-/g, '_')) + 'Component',
				templatePath = path.join(__dirname, 'ember/' + menuData[componentName].template + '_menu_component.ejs'),
				renderOptions = {
					'componentName': componentName,
					'emberComponentName': emberComponentName,
					'menuItems': menuData[componentName].menuItems
				};

			promiseResolutions.push(renderAsync(templatePath, renderOptions));
		});

		promises.all(promiseResolutions)
		.then(function(renderedMenus) {
			callback(null, renderedMenus.join('\n'));
		})
		.catch(function(err) {
			callback(err);
		});
	},

	'_setupMenuCache': function(userId, userData, callback) {
		var cacheSrvc = this.$dependencies.cacheService,
			databaseSrvc = this.$dependencies.databaseService,
			unique_ember_routes = [],
			self = this;

		if(userData.tenants) {
			userData.menus = [];
			Object.keys(userData.tenants).forEach(function(key) {
				var userTenant = userData.tenants[key];

				for(var idx in userTenant.menus) {
					var thisMenu = userTenant.menus[idx];
					if(unique_ember_routes.indexOf(thisMenu.id) >= 0)
						continue;

					unique_ember_routes.push(thisMenu.id);
					userData.menus.push(thisMenu);
				};
			});
		}

		var widgetList = userData.widgets,
			menuList = userData.menus,
			promiseResolutions = [];

		Object.keys(widgetList).forEach(function(widgetPosition) {
			if(!Array.isArray(widgetList[widgetPosition]))
				return;

			for(var idx in widgetList[widgetPosition]) {
				var thisWidget = widgetList[widgetPosition][idx];

				promiseResolutions.push(databaseSrvc.knex.raw("SELECT D.ember_component_name AS widget, C.display_name, C.tooltip, C.ember_route, A.menu_template FROM system_menus A INNER JOIN system_menu_component_menu_mapping B ON (B.system_menu_id = A.id) INNER JOIN component_menus C ON (C.id = B.component_menu_id) INNER JOIN component_widgets D ON (D.id = A.component_widget_id) WHERE A.component_widget_id = '" + thisWidget.id + "' AND C.parent_id IS NULL ORDER BY B.display_order;"));
			}
		});

		// Step 4: Process the menu items associated with the widgets
		promises.all(promiseResolutions)
		.then(function(menuItems) {
			var sessionMenus = {},
				menuListUsedUp = [];

			for(var idx in menuItems) {
				// If this widget is not a menu widget, move on...
				if(!menuItems[idx])
					continue;

				if(!menuItems[idx].rows.length)
					continue;

				// Re-organize the menu items associated with this widget...
				var thisMenuItems = menuItems[idx].rows,
					widget = thisMenuItems[0].widget,
					menuTemplate = thisMenuItems[0].menu_template;

				if(!sessionMenus[widget]) {
					sessionMenus[widget] = {};
					sessionMenus[widget].template = menuTemplate;
					sessionMenus[widget].menuItems = [];
				}

				// For each of the menu items associated with this widget,
				// pull the complete display data of the menu item from the cache
				for(var tmIdx in thisMenuItems) {
					for(var mlIdx in menuList) {
						if((menuList[mlIdx].ember_route == thisMenuItems[tmIdx].ember_route) && (menuList[mlIdx].display_name == thisMenuItems[tmIdx].display_name)) {
							sessionMenus[widget].menuItems.push(menuList[mlIdx]);
							menuListUsedUp.push(mlIdx);

						}
					}
				}
			}

			// Remove the menu items that have been sorted, etc.
			menuListUsedUp.sort(function(left, right) {
				return left - right;
			});

			menuListUsedUp.reverse();
			for(var idx in menuListUsedUp) {
				menuList.splice(menuListUsedUp[idx], 1);
			}

			// Store the re-organized menu items back into the cache...
			if(!userData.sessionData) userData.sessionData = {};
			userData.sessionData[self.name] = sessionMenus;

			return cacheSrvc.setAsync('twyr!portal!user!' + userId, JSON.stringify(userData));
		})
		.then(function() {
			callback(null);
		})
		.catch(function(err) {
			callback(err);
		})
	},

	'name': 'menu',
	'dependencies': ['logger', 'cacheService', 'databaseService']
});

exports.component = menuComponent;
