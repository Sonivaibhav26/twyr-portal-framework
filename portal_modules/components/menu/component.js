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
 * Module dependencies, required for ALL Twy'r modules
 */
var base = require('./../component-base').baseComponent,
	prime = require('prime'),
	promises = require('bluebird');

/**
 * Module dependencies, required for this module
 */
var filesystem = promises.promisifyAll(require('fs')),
	path = require('path');

var menuComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);

		// Promisify what we need...
		this._renderMenuTemplatesAsync = promises.promisify(this._renderMenuTemplates);
	},

	'_getClientRouter': function(request, response, next) {
		response.type('application/javascript');
		response.status(200).send('');
	},

	'_getClientMVC': function(request, response, next) {
		response.type('application/javascript');
		response.status(200).send('');
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');

		var cacheSrvc = this.$dependencies.cacheService,
			databaseSrvc = this.$dependencies.databaseService,
			self = this;

		var userId = ((request.user && request.user.id) ? request.user.id : 'public'),
			currentTenantData = null;

		cacheSrvc.getAsync('twyr!portal!user!' + userId)
		.then(function(userData) {
			userData = JSON.parse(userData);
			if(!userData) {
				throw({ 'code': 404, 'message': 'User not found' })
				return;
			}

			// Step 1: Get the data we are supposed to use for constructing menus
			currentTenantData = ((request.user && request.user.id) ? userData.currentTenant : userData);

			// Step 2: If the data has already been processed, render it and be done...
			if(currentTenantData.sessionData && currentTenantData.sessionData[self.name]) {
				self._renderMenuTemplatesAsync(currentTenantData.sessionData[self.name], response)
				.then(function(tmpl) {
					response.status(200).send(tmpl);
				})
				.catch(function(err) {
					self.$dependencies.logger.error('Error fetching menu items from database for user: ' + userId + '\n', err);
					response.status(500).json(err);
				});

				return;
			}

			// Step 3: Get all the widgets displayed to this User
			var widgetList = currentTenantData.widgets,
				menuList = currentTenantData.menus,
				promiseResolutions = [];

			Object.keys(widgetList).forEach(function(widgetPosition) {
				if(!Array.isArray(widgetList[widgetPosition]))
					return;

				for(var idx in widgetList[widgetPosition]) {
					var thisWidget = widgetList[widgetPosition][idx];

					promiseResolutions.push(databaseSrvc.knex.raw("SELECT D.ember_component_name AS widget, C.ember_route, A.menu_template FROM system_menus A INNER JOIN system_menu_component_menu_mapping B ON (B.system_menu_id = A.id) INNER JOIN component_menus C ON (C.id = B.component_menu_id) INNER JOIN component_widgets D ON (D.id = A.component_widget_id) WHERE A.component_widget_id = '" + thisWidget.id + "' AND C.parent_id IS NULL ORDER BY B.display_order;"));
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
							if(menuList[mlIdx].ember_route == thisMenuItems[tmIdx].ember_route) {
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
				if(!currentTenantData.sessionData) currentTenantData.sessionData = {};
				currentTenantData.sessionData[self.name] = sessionMenus;

				return cacheSrvc.setAsync('twyr!portal!user!' + userId, JSON.stringify(userData));
			})
			// Step 5: Render the newly retrieved menu items...
			.then(function() {
				return self._renderMenuTemplatesAsync(currentTenantData.sessionData[self.name], response);
			})
			// Step 6: Send the rendered templates back...
			.then(function(tmpl) {
				response.status(200).send(tmpl);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error fetching menu items from database for user: ' + userId + '\n', err);
				response.status(500).json(err);
			});
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error fetching menu items from database for user: ' + userId + '\n', err);
			response.status(500).json(err);
		});
	},

	'_renderMenuTemplates': function(menuData, response, callback) {
		var renderAsync = promises.promisify(response.render.bind(response)),
			promiseResolutions = [];

		Object.keys(menuData).forEach(function(componentName) {
			var templatePath = path.join(__dirname, 'ember/' + menuData[componentName].template + '.ejs'),
				renderOptions = {
					'componentName': componentName,
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

	'name': 'menu',
	'dependencies': ['logger', 'cacheService', 'databaseService']
});

exports.component = menuComponent;
