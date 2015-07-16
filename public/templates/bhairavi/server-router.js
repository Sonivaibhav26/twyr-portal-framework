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

var serverRouter = (function() {
	// Step 1: Instantiate the Router itself...
	var router = require('express').Router(),
		logger = require('morgan'),
		cacheSrvc = this.$services.cacheService.getInterface(),
		databaseSrvc = this.$services.databaseService.getInterface(),
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

			databaseSrvc.knex.raw('SELECT * FROM fn_get_component_widgets(\'ffffffff-ffff-ffff-ffff-ffffffffffff\');')
			// Step 3: Fetch, and process, public widgets
			.then(function(componentWidgets) {
				// Re-organize widgets according to display position, and order of display within that position
				var reorgedWidgets = {};

				componentWidgets.rows.forEach(function(thisWidget) {
					if(!reorgedWidgets[thisWidget.position_name])
						reorgedWidgets[thisWidget.position_name] = [];

					var existingWidget = (reorgedWidgets[thisWidget.position_name]).find(function(item) {
						return item.id == thisWidget.id;
					});

					if(existingWidget)
						return;

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

				deserializedUser.widgets = reorgedWidgets;
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
	});

	return router;
});

exports.router = serverRouter;
