/// <reference path="../typings/node/node.d.ts"/>
/*
 * Name			: portal-server.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal "Application Class"
 *
 */

"use strict";

/**
 * Module dependencies, required for ALL Twy'r modules
 */
var prime = require('prime'),
	promises = require('bluebird');

/**
 * Module dependencies, required for this module
 */
var domain = require('domain'),
	filesystem = require('fs'),
	path = require('path'),
	uuid = require('node-uuid');

var app = prime({
	'constructor': function() {
		this['$uuid'] = uuid.v4().toString().replace(/-/g, '');
		this._loadConfig(path.join(__dirname, 'portal-config.js'));
	},

	'load': function(module, loader, callback) {
		this['$module'] = module;
		this['$loader'] = loader;

		this.$loader.loadAsync()
		.then(function(status) {
			if(!status) throw status;
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			if(callback) callback(err);
		});
	},

	'start': function(dependencies, callback) {
		var self = this;
		this.$loader.startAsync()
		.then(function(status) {
			if(!status) throw status;

			var promiseResolutions = [],
				databaseService = self.$services.databaseService.getInterface();

			promiseResolutions.push(status);
			promiseResolutions.push(databaseService.knex.raw('SELECT * FROM system_templates WHERE is_default = TRUE'));

			return promises.all(promiseResolutions);
		})
		.then(function(results) {
			// Get the template to use for this instance...
			var status = results[0],
				defaultTemplate = (results[1]).rows[0],
				templatePath = (self.$config.templates.path[0] == '/') ? self.$config.templates.path : path.join(__dirname, self.$config.templates.path);

			self.$config.currentTemplate = defaultTemplate;
			self.$config.templates.path = templatePath;

			// Step 1: Initialize the Web/API Server
			var express = require('express'),
				engines = require('consolidate'),
				acceptOverride = require('connect-acceptoverride'),
				bodyParser = require('body-parser'),
				cookieParser = require('cookie-parser'),
				compress = require('compression'),
				debounce = require('connect-debounce'),
				favicon = require('serve-favicon'),
				flash = require('connect-flash'),
				logger = require('morgan'),
				methodOverride = require('method-override'),
				poweredBy = require('connect-powered-by'),
				serveStatic = require('serve-static'),
				session = require('express-session'),
				sessStore = require('connect-' + self.$config.session.store.media)(session),
				timeout = require('connect-timeout'),
				loggerSrvc = self.$services.logger.getInterface();
			
			// Step 2: Setup Winston for Express Logging
			var loggerStream = {
				'write': function(message, encoding) {
					loggerSrvc.silly(message);
				}
			};
			
			// Step 3: Setup Express
			var portalServer = express();
			portalServer.set('view engine', self.$config.templates.templateEngine);
			portalServer.set('views', path.join(templatePath, defaultTemplate.name));
			portalServer.engine(self.$config.templates.templateEngine, engines[self.$config.templates.templateEngine]);
			if(self.$config.cookieParser.secure) portalServer.set('trust proxy', 1);

			// Step 3.1: Setup the Session Store
			var sessionStore = new sessStore({
				'client': self.$services.cacheService.getInterface(),
				'prefix': self.$config.session.store.prefix,
				'ttl': self.$config.session.ttl
			});

			self['$cookieParser'] = cookieParser(self.$config.session.secret, self.$config.cookieParser);
			self['$session'] = session({
				'cookie': self.$config.cookieParser,
				'key': self.$config.session.key,
				'secret': self.$config.session.secret,
				'store': sessionStore,
				'saveUninitialized': true,
				'resave': false
			});
			
			// Step 3.2: Setup the standard stuff...
			portalServer
				.use(logger('combined', {
					'stream': loggerStream
				}))
				.use(debounce())
				.use(acceptOverride())
				.use(methodOverride())
				.use(compress())
				.use(favicon(path.join(__dirname, self.$config.favicon)))
				.use(poweredBy(self.$config.poweredBy))
				.use(timeout(self.$config.requestTimeout * 1000))
				.use(flash())
				.use(self.$cookieParser)
				.use(self.$session)
				.use(bodyParser.json({
					'limit': self.$config.maxRequestSize
				}))
				.use(bodyParser.json({
					'type': 'application/vnd.api+json',
					'limit': self.$config.maxRequestSize
				}))
				.use(bodyParser.raw({
					'limit': self.$config.maxRequestSize
				}))
				.use(bodyParser.text({
					'limit': self.$config.maxRequestSize
				}))
				.use(bodyParser.urlencoded({
					'extended': true,
					'limit': self.$config.maxRequestSize
				}))
				.use(self.$services.authService.getInterface().initialize())
				.use(self.$services.authService.getInterface().session())
				.use(function(request, response, next) {
					var requestDomain = domain.create();
					requestDomain.add(request);
					requestDomain.add(response);

					requestDomain.on('error', function(error) {
						loggerSrvc.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', error);
						response.status(500).redirect('/error');
					});

					next();
				});
			
			// Step 3.3: Setup the static server
			self.$config.publicDir = path.join(__dirname, self.$config.publicDir);
			portalServer
				.use(serveStatic(self.$config.publicDir, {
					'index': 'index.html',
					'maxAge': self.$config.browser.cacheTime
				}));

			// Step 3.4: Hook-in the component routers...
			for(var idx in self.$components) {
				var thisComponent = self.$components[idx],
					router = thisComponent.getRouter();

				console.log('Loading ' + thisComponent.name + ' @ ' + path.join((self.$config.componentMountPath || '/'), thisComponent.name));
				portalServer.use(path.join((self.$config.componentMountPath || '/'), thisComponent.name), router);
			}

			// Step 3.5: Add in the framework router...
			var frameworkRouter = require(path.join(templatePath, defaultTemplate.name, defaultTemplate.server_router)).router.bind(self);
			portalServer.use(frameworkRouter());

			// Step 3.6: Finally, The error handlers...
			portalServer
				.use(function(err, request, response, next) {
					if(err) {
						loggerSrvc.error('Portal Server Error: ', err);
						response.status(err.code || err.number || 500).redirect('/error');
					}
					else {
						loggerSrvc.error('Portal Server Error: Unhandled Route');
						response.status(err.code || err.number || 404).redirect('/error');
					}
				});

			// Step 4: Persist for future use
			var protocol = require(self.$config.protocol || 'http');
			if((self.$config.protocol || 'http') == 'http') {
				self['$portalServer'] = protocol.createServer(portalServer);
			}
			else {
				self.$config.ssl.key = filesystem.readFileSync(path.join(__dirname, self.$config.ssl.key));
				self.$config.ssl.cert = filesystem.readFileSync(path.join(__dirname, self.$config.ssl.cert));
				self['$portalServer'] = protocol.createServer(self.$config.ssl, portalServer);
			}

			// Step 5: Cleanup stuff...
			self.$portalServer.on('connection', self._portalServerConnection.bind(self));
			self.$portalServer.on('error', self._portalServerError.bind(self));

			// Finally, start listening & emit...
			self.$portalServer.listen(self.$config.port || 8000);
			(self.$services.eventService.getInterface()).emit('twyrstart', self);

			if(callback) callback(null, status);
		})
		.catch(function(err) {
			if(callback) callback(err);
		});
	},

	'stop': function(callback) {
		this.$portalServer.on('close', this._portalServerClose.bind(this, callback));
		this.$portalServer.close();
	},

	'unload': function(callback) {
		var self = this;

		this.$loader.unloadAsync()
		.then(function(status) {
			if(!status) throw status;
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			if(callback) callback(err);
		})
		.finally(function() {
			delete self['$loader'];
			delete self['$module'];
		});
	},

	'_loadConfig': function(configFilePath) {
		// Load / Store the configuration...
		var env = (process.env.NODE_ENV || 'development').toLowerCase(),
			config = require(configFilePath || './config.js')[env];

		this['$config'] = config;
	},

	'_portalServerConnection': function(socket) {
		socket.setTimeout(this.$config.connectionTimeout * 1000);
	},

	'_portalServerError': function(error) {
		this.$services.logger.getInterface().error('Portal Server Error: ', JSON.stringify(error));
	},

	'_portalServerClose': function(callback) {
		var self = this;

		this.$loader.stopAsync()
		.then(function(status) {
			if(!status) throw status;
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			if(callback) callback(err);
		})
		.finally(function() {
			delete self['$portalServer'];
			delete self['$session'];
			delete self['$cookieParser'];
		});
	},

	'name': 'Twyr Portal',
	'dependencies': []
});

exports.twyrPortal = app;

