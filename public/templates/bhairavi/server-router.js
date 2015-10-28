/// <reference path="../../../typings/node/node.d.ts"/>
/*
 * Name			: public/templates/bhairavi/server-router.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal "Bhairavi"" Template Router
 *
 */

"use strict";

/**
 * Module dependencies.
 */
var path = require('path'),
	promises = require('bluebird'),
	filesystem = promises.promisifyAll(require('fs'));

var publicRootPathRenderer = function(request, response, next) {
	var cacheSrvc = this.$services.cacheService.getInterface(),
		databaseSrvc = this.$services.databaseService.getInterface(),
		loggerSrvc = this.$services.logger.getInterface(),
		self = this;

	// Step 1: Check to see if the user is already in the cache
	cacheSrvc.getAsync('twyr!portal!user!public')
	.then(function(cachedData) {
		// If the user is in the cache already, simply return it
		cachedData = JSON.parse(cachedData);
		if(cachedData) {
			loggerSrvc.debug('Template Router Render Options (from Cache): ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nOptions: ', cachedData);

			response.render(path.join(self.$config.templates.path, self.$config.currentTemplate.name, self.$config.currentTemplate.client_index_file), cachedData, function(err, html) {
				if(err) {
					loggerSrvc.error('Template Router Render Error: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err, '\nHTML: ', html);
					response.status(err.code || err.number || 404).redirect('/error');
					return;
				}
		
				loggerSrvc.silly('Template Router Render Result: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nHTML: ', html);
				response.status(200).send(html);
			});

			return;
		}

		// Step 2: Setup basic stuff...
		var deserializedUser = {
			'title': self.$config.title,
			'baseYear': self.$config.baseYear,
			'currentYear': (new Date()).getFullYear().toString(),

			'template': path.relative(self.$config.publicDir, path.join(self.$config.templates.path, self.$config.currentTemplate.name)),
			'clientLoader': path.relative(self.$config.publicDir, path.join(self.$config.templates.path, self.$config.currentTemplate.name, self.$config.currentTemplate.client_loader)),

			'developmentMode': ((process.env.NODE_ENV || 'development') == 'development'),
			'apiServer': self.$config.apiServer,

			'components': [],
			'widgets': null
		};

		var mountPath = self.$config ? (self.$config.componentMountPath || '') : '';
		for(var idx in self.$components) {
			deserializedUser.components.push({ 'name': path.join(mountPath, idx) });
		}

		var promiseResolutions = [];

		promiseResolutions.push(databaseSrvc.knex.raw('SELECT * FROM fn_get_component_menus(\'ffffffff-ffff-ffff-ffff-ffffffffffff\', 10);'));
		promiseResolutions.push(databaseSrvc.knex.raw('SELECT * FROM fn_get_component_widgets(\'ffffffff-ffff-ffff-ffff-ffffffffffff\');'));

		// Step 3: Fetch, and process, public widgets
		promises.all(promiseResolutions)
		.then(function(results) {
			var componentMenus = results[0],
				componentWidgets = results[1],
				reorgedMenus = [],
				reorgedWidgets = {};

			// Re-organize widgets according to display position, and order of display within that position
			componentWidgets.rows.forEach(function(thisWidget) {
				if(!reorgedWidgets[thisWidget.position_name])
					reorgedWidgets[thisWidget.position_name] = [];

				if((reorgedWidgets[thisWidget.position_name]).length) {
					var existingWidget = (reorgedWidgets[thisWidget.position_name]).filter(function(item) {
						return item.id == thisWidget.id;
					});
	
					if(existingWidget.length)
						return;
				}

				(reorgedWidgets[thisWidget.position_name]).push(thisWidget);
			});

			Object.keys(reorgedWidgets).forEach(function(position) {
				var widgetsInThisPosition = reorgedWidgets[position];
				
				widgetsInThisPosition.sort(function(left, right) {
					var retVal = left.display_order - right.display_order;
					
					delete left.position_name;
					delete left.display_order;

					delete right.position_name;
					delete right.display_order;

					return retVal;
				});
			});

			// Re-organize menus according to parent-child replationships...
			componentMenus.rows.forEach(function(thisMenu) {
				if(!reorgedMenus.length) {
					if(!thisMenu.parent_id) {
						reorgedMenus.push({
							'id': thisMenu.id,
							'icon_class': thisMenu.icon_class,
							'display_name': thisMenu.display_name,
							'ember_route': thisMenu.ember_route,
							'subRoutes': []
						});
					}
					else {
						var parentMenu = {
							'id': thisMenu.parent_id,
							'subRoutes': []
						};

						parentMenu.subRoutes.push({
							'id': thisMenu.id,
							'icon_class': thisMenu.icon_class,
							'display_name': thisMenu.display_name,
							'ember_route': thisMenu.ember_route
						});

						reorgedMenus.push(parentMenu);
					}
				}
				else {
					if(!thisMenu.parent_id) {
						var existingMenus = reorgedMenus.filter(function(item) {
							if(item.id == thisMenu.id) {
								return true;
							}

							return false;
						});

						if(!existingMenus.length) {
							reorgedMenus.push({
								'id': thisMenu.id,
								'icon_class': thisMenu.icon_class,
								'display_name': thisMenu.display_name,
								'ember_route': thisMenu.ember_route,
								'subRoutes': []
							});
						}
						else {
							existingMenus[0].display_name = thisMenu.display_name;
							existingMenus[0].ember_route = thisMenu.ember_route;
						}
					}
					else {
						var parentMenus = reorgedMenus.filter(function(item) {
							if(item.id == thisMenu.parent_id) {
								return true;
							}

							return false;
						});

						var parentMenu = null;
						if(!parentMenus.length) {
							parentMenu = {
								'id': thisMenu.parent_id,
								'subRoutes': []
							};

							reorgedMenus.push(parentMenu);
						}
						else {
							parentMenu = parentMenus[0];
						}

						if(parentMenu.subRoutes.length) {
							var existingSubMenus = parentMenu.subRoutes.filter(function(item) {
								if(item.id == thisMenu.id) {
									return true;
								}

								return false;
							});

							if(!existingSubMenus.length) {
								parentMenu.subRoutes.push({
									'id': thisMenu.id,
									'icon_class': thisMenu.icon_class,
									'display_name': thisMenu.display_name,
									'ember_route': thisMenu.ember_route
								});
							}
						}
					}
				}
			});

			var numModulePositions = 0,
				numFooterPositions = 1,
				mainComponentWidth = 12;

			if(reorgedWidgets.module1 && reorgedWidgets.module1.length)
				numModulePositions++;

			if(reorgedWidgets.module2 && reorgedWidgets.module2.length)
				numModulePositions++;

			if(reorgedWidgets.module3 && reorgedWidgets.module3.length)
				numModulePositions++;

			if(reorgedWidgets.footer1 && reorgedWidgets.footer1.length)
				numFooterPositions++;

			if(reorgedWidgets.footer2 && reorgedWidgets.footer2.length)
				numFooterPositions++;

			if(reorgedWidgets.leftsidebar && reorgedWidgets.leftsidebar.length)
				mainComponentWidth = mainComponentWidth - 2;

			if(reorgedWidgets.rightsidebar && reorgedWidgets.rightsidebar.length)
				mainComponentWidth = mainComponentWidth - 2;

			reorgedWidgets.moduleBar1ColWidth = (numModulePositions > 0 ) ? 12/numModulePositions : 12;
			reorgedWidgets.moduleFooterColWidth = 12/numFooterPositions;
			reorgedWidgets.mainComponentColWidth = mainComponentWidth;

			deserializedUser.widgets = reorgedWidgets;
			deserializedUser.menus = reorgedMenus;
		})
		// Step 4: Store User data in the cache for quick retrieval next time
		.then(function() {
			return cacheSrvc.setAsync('twyr!portal!user!public', JSON.stringify(deserializedUser));
		})
		// Finally, send it back up...
		.then(function() {
			loggerSrvc.debug('Template Router Render Options (from Database): ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nOptions: ', deserializedUser);

			response.render(path.join(self.$config.templates.path, self.$config.currentTemplate.name, self.$config.currentTemplate.client_index_file), deserializedUser, function(err, html) {
				if(err) {
					loggerSrvc.error('Template Router Render Error: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err, '\nHTML: ', html);
					response.status(err.code || err.number || 404).redirect('/error');
					return;
				}
		
				loggerSrvc.silly('Template Router Render Result: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nHTML: ', html);
				response.status(200).send(html);
			});
		})
		.catch(function(err) {
			loggerSrvc.error('Template Router Render Error: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
			response.status(err.code || err.number || 404).redirect('/error');
		});
	})
	.catch(function(err) {
		loggerSrvc.error('Template Router Render Error: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
		response.status(err.code || err.number || 404).redirect('/error');
	});
};

var registeredRootPathRenderer = function(request, response, next) {
	var cacheSrvc = this.$services.cacheService.getInterface(),
		loggerSrvc = this.$services.logger.getInterface(),
		renderAsync = promises.promisify(response.render.bind(response)),
		self = this;

	var renderOptions = {
		'title': self.$config.title,
		'baseYear': self.$config.baseYear,
		'currentYear': (new Date()).getFullYear().toString(),

		'template': path.relative(self.$config.publicDir, path.join(self.$config.templates.path, self.$config.currentTemplate.name)),
		'clientLoader': path.relative(self.$config.publicDir, path.join(self.$config.templates.path, self.$config.currentTemplate.name, self.$config.currentTemplate.client_loader)),

		'developmentMode': ((process.env.NODE_ENV || 'development') == 'development'),
		'apiServer': self.$config.apiServer,

		'components': [],
		'widgets': null
	};

	var mountPath = self.$config ? (self.$config.componentMountPath || '') : '';
	for(var idx in self.$components) {
		renderOptions.components.push({ 'name': path.join(mountPath, idx) });
	}

	cacheSrvc.getAsync('twyr!portal!user!' + request.user.id)
	.then(function(cachedData) {
		// If the user is in the cache already, simply return it
		cachedData = JSON.parse(cachedData);
		if(!cachedData) {
			throw({ 'code': 404, 'message': 'User not found' });
			return;
		}

		var widgets = {},
			unique_ember_components = {},
			menus = [],
			unique_ember_routes = [];

		Object.keys(cachedData.tenants).forEach(function(key) {
			var userTenant = cachedData.tenants[key];

			Object.keys(userTenant.widgets).forEach(function(position) {
				var thisPositionWidgets = userTenant.widgets[position];

				for(var idx in thisPositionWidgets) {
					var thisWidget = thisPositionWidgets[idx];

					if(!widgets[position])
						widgets[position] = [];

					if(!unique_ember_components[position])
						unique_ember_components[position] = [];

					if(unique_ember_components[position].indexOf(thisWidget.ember_component) >= 0)
						continue;

					unique_ember_components[position].push(thisWidget.ember_component);
					widgets[position].push(thisWidget);
				}
			});
		});

		Object.keys(widgets).forEach(function(position) {
			var widgetsInThisPosition = widgets[position];
			widgetsInThisPosition.sort(function(left, right) {
				var retVal = left.display_order - right.display_order;
				
				delete left.position_name;
				delete left.display_order;

				delete right.position_name;
				delete right.display_order;

				return retVal;
			});
		});

		renderOptions.widgets = widgets;

		var numModulePositions = 0,
			numFooterPositions = 1,
			mainComponentWidth = 12;

		if(widgets.module1 && widgets.module1.length)
			numModulePositions++;

		if(widgets.module2 && widgets.module2.length)
			numModulePositions++;

		if(widgets.module3 && widgets.module3.length)
			numModulePositions++;

		if(widgets.footer1 && widgets.footer1.length)
			numFooterPositions++;

		if(widgets.footer2 && widgets.footer2.length)
			numFooterPositions++;

		if(widgets.leftsidebar && widgets.leftsidebar.length)
			mainComponentWidth = mainComponentWidth - 2;

		if(widgets.rightsidebar && widgets.rightsidebar.length)
			mainComponentWidth = mainComponentWidth - 2;

		widgets.moduleBar1ColWidth = (numModulePositions > 0) ? 12/numModulePositions : 12;
		widgets.moduleFooterColWidth = 12/numFooterPositions;
		widgets.mainComponentColWidth = mainComponentWidth;

		cachedData.menus = menus;
		cachedData.widgets = renderOptions.widgets;

		return cacheSrvc.setAsync('twyr!portal!user!' + request.user.id, JSON.stringify(cachedData));
	})
	.then(function() {
		return renderAsync(path.join(self.$config.templates.path, self.$config.currentTemplate.name, self.$config.currentTemplate.client_index_file), renderOptions);
	})
	.then(function(html) {	
		loggerSrvc.silly('Template Router Render Result: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nHTML: ', html);
		response.status(200).send(html);
	})
	.catch(function(err) {
		loggerSrvc.error('Template Router Render Error: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
		response.status(err.code || err.number || 404).redirect('/error');
	});
};

var serverRouter = (function() {
	// Step 1: Instantiate the Router itself...
	var router = require('express').Router(),
		logger = require('morgan'),
		loggerSrvc = this.$services.logger.getInterface(),
		self = this;

	// Step 2: Setup the logger for the router...
	var loggerStream = {
		'write': function(message, encoding) {
			loggerSrvc.silly(message);
		}
	};

	router.use(logger('combined', {
		'stream': loggerStream
	}));

	// Step 3: Process the template & route paths for the Portal
	router.get('/route', function(request, response, next) {
		loggerSrvc.silly('Template Router Rendering: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
		response.type('application/javascript');

		filesystem.readFileAsync(path.join(__dirname, 'ember/router.js'))
		.then(function(router) {
			response.status(200).send(router);
		})
		.catch(function(err) {
			response.status(500).send(err);
		});
	});

	router.get('/mvc', function(request, response, next) {
		loggerSrvc.silly('Template Router Rendering: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
		response.type('application/javascript');

		filesystem.readFileAsync(path.join(__dirname, 'ember/controller.js'))
		.then(function(controller) {
			response.status(200).send(controller);
		})
		.catch(function(err) {
			response.status(500).send(err);
		});
	});

	router.get('/template', function(request, response, next) {
		loggerSrvc.silly('Template Router Rendering: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
		response.type('application/javascript');

		filesystem.readFileAsync(path.join(__dirname, 'ember/template.js'))
		.then(function(template) {
			response.status(200).send(template);
		})
		.catch(function(err) {
			response.status(500).send(err);
		});
	});

	// Step 4: Process all unhandled ('/*') paths by returning the application template
	router.all('/*', function(request, response, next) {
		loggerSrvc.silly('Template Router Rendering: ', request.path, ' with:\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		if(request.user) {
			(registeredRootPathRenderer.bind(self))(request, response, next);
		}
		else {
			(publicRootPathRenderer.bind(self))(request, response, next);
		}
	});

	return router;
});

exports.router = serverRouter;
