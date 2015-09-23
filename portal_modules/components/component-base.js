/// <reference path="../../typings/node/node.d.ts"/>
/*
 * Name			: portal_modules/components/component-base.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: Base Component for the Twy'r Portal Framework
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
var inflection = require('inflection'),
	path = require('path');

var simpleComponent = prime({
	'constructor': function() {
		console.log('Constructor of the ' + this.name + ' Component');

		// Promisify what we need...
		this._checkPermissionAsync = promises.promisify(this._checkPermission);

		this._getResourcesAsync = promises.promisify(this._getResources);
		this._getRoutesAsync = promises.promisify(this._getRoutes);
		this._getTemplatesAsync = promises.promisify(this._getTemplates);
		this._getMVCAsync = promises.promisify(this._getMVC);

		this._constructRouteMapAsync = promises.promisify(this._constructRouteMap);
	},

	'load': function(module, loader, callback) {
		console.log('Loading the ' + this.name + ' Component');
		var self = this;

		self['$module'] = module;
		self['$loader'] = loader;

		self.$loader.loadAsync()
		.then(function(status) {
			if(!status) throw status;
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			console.error(self.name + ' Component Load Error: ', err);
			if(callback) callback(err);
		});
	},

	'initialize': function(callback) {
		console.log('Initializing the ' + this.name + ' Component');

		if(callback) {
			callback(null, true);
		}
	},
	
	'start': function(dependencies, callback) {
		console.log('Starting the ' + this.name + ' Component');
		var self = this;

		self['$dependencies'] = dependencies;

		self._setupRouter();
		self._addStandardRoutes();
		self._addRoutes();

		self.$loader.startAsync()
		.then(function(status) {
			if(!status) throw status;

			for(var idx in self.$components) {
				var thisComponent = self.$components[idx],
					router = thisComponent.getRouter(),
					mountPath = self.$config ? (self.$config.componentMountPath || '/') : '/';

				self.$router.use(path.join(mountPath, thisComponent.name), router);
			}

			return status;
		})
		.then(function(status) {
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			console.error(self.name + ' Component Start Error: ', err);
			if(callback) callback(err);
		});
	},

	'getRouter': function() {
		console.log('Returning the ' + this.name + ' Component Router');
		return this.$router;
	},

	'stop': function(callback) {
		console.log('Stopping the ' + this.name + ' Component');
		var self = this;

		self.$loader.stopAsync()
		.then(function(status) {
			if(!status) throw status;
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			console.error(self.name + ' Component Stop Error: ', err);
			if(callback) callback(err);
		})
		.finally(function() {
			delete self['$dependencies'];
			delete self['$router'];
		});
	},

	'uninitialize': function(callback) {
		console.log('Uninitializing the ' + this.name + ' Component');

		if(callback) {
			callback(null, true);
		}
	},

	'unload': function(callback) {
		console.log('Unloading the ' + this.name + ' Component');
		var self = this;

		self.$loader.unloadAsync()
		.then(function(status) {
			if(!status) throw status;
			if(callback) callback(null, status);
		})
		.catch(function(err) {
			console.error(self.name + ' Service Unload Error: ', err);
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

	'_setupRouter': function() {
		var router = require('express').Router(),
			logger = require('morgan'),
			loggerSrvc = this.$dependencies['logger'];
	
		var loggerStream = {
			'write': function(message, encoding) {
				loggerSrvc.silly(message);
			}
		};
	
		router.use(logger('combined', {
			'stream': loggerStream
		}));
		
		this['$router'] = router;
	},

	'_addStandardRoutes': function() {
		this.$router.get('/route', this._getClientRouter.bind(this));
		this.$router.get('/mvc', this._getClientMVC.bind(this));
		this.$router.get('/template', this._getClientTemplate.bind(this));
	},

	'_addRoutes': function() {
		return;
	},

	'_getClientRouter': function(request, response, next) {
		var promiseResolutions = [],
			renderFunc = promises.promisify(response.render.bind(response)),
			self = this;

		response.type('application/javascript');

		promiseResolutions.push(self._getResourcesAsync(request, renderFunc));
		promiseResolutions.push(self._getRoutesAsync(request, renderFunc));

		promises.all(promiseResolutions)
		.then(function(resourceRoutes) {
			var resources = resourceRoutes[0],
				routes = resourceRoutes[1];

			if(!Array.isArray(resources))
				resources = [resources];

			var routeMapResolutions = [];
			for(var idx in resources) {
				routeMapResolutions.push(self._constructRouteMapAsync(resources[idx]));
			}

			routeMapResolutions.push(routes);
			return promises.all(routeMapResolutions);
		})
		.then(function(result) {
			var routeMaps = result,
				routes = result.pop();

			var routeContent = [];
			for(var idx in routeMaps) {
				var routeMap = routeMaps[idx];
				if(routeMap.trim() == '') continue;
				routeContent.push('\t' + routeMap + '\n');
			}

			routeContent = routeContent.join('').trim();
			if(routeContent != '') {
				var returnedRoutes = 'var Router = require(\'twyrPortal/router\')[\'default\'];\n';
				returnedRoutes += 'Router.map(function() {\n';
				returnedRoutes += '\t' + routeContent;
				returnedRoutes += '\n});\n';
	
				response.status(200).send(returnedRoutes + '\n' + routes);
			}
			else {
				response.status(200).send(routes);
			}
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error getting component resources for ' + self.name + ':\n', err);
			response.status(500).send(err.message);
		});
	},

	'_getClientMVC': function(request, response, next) {
		var renderFunc = promises.promisify(response.render.bind(response)),
			self = this;

		response.type('application/javascript');
		self._getMVCAsync(request, renderFunc)
		.then(function(componentMVCs) {
			response.status(200).send(componentMVCs);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error sending MVCs: ', err);
			response.status(500).send(err.message);
		});
	},

	'_getClientTemplate': function(request, response, next) {
		var renderFunc = promises.promisify(response.render.bind(response)),
			self = this;

		response.type('application/javascript');
		self._getTemplatesAsync(request, renderFunc)
		.then(function(componentTemplates) {
			response.status(200).send(componentTemplates);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error sending templates: ', err);
			response.status(500).send(err.message);
		});
	},

	'_getResources': function(request, renderFunc, callback) {
		var promiseResolutions = [],
			self = this;

		for(var idx in self.$components) {
			var thisComponent = self.$components[idx];
			promiseResolutions.push(thisComponent._getResourcesAsync(request, renderFunc));
		}

		promises.all(promiseResolutions)
		.then(function(componentResources) {
			callback(null, componentResources);
		})
		.catch(function(err) {
			callback(err);
		});
	},

	'_getRoutes': function(request, renderFunc, callback) {
		var promiseResolutions = [],
			self = this;

		for(var idx in self.$components) {
			var thisComponent = self.$components[idx];
			promiseResolutions.push(thisComponent._getRoutesAsync(request, renderFunc));
		}

		promises.all(promiseResolutions)
		.then(function(componentRoutes) {
			callback(null, componentRoutes.join('\n'));
		})
		.catch(function(err) {
			callback(err);
		});
	},

	'_getTemplates': function(request, renderFunc, callback) {
		var promiseResolutions = [],
			self = this;

		for(var idx in self.$components) {
			var thisComponent = self.$components[idx];
			promiseResolutions.push(thisComponent._getTemplatesAsync(request, renderFunc));
		}

		promises.all(promiseResolutions)
		.then(function(componentTemplates) {
			callback(null, componentTemplates.join('\n'));
		})
		.catch(function(err) {
			callback(err);
		});
	},

	'_getMVC': function(request, renderFunc, callback) {
		var promiseResolutions = [],
			self = this;

		for(var idx in self.$components) {
			var thisComponent = self.$components[idx];
			promiseResolutions.push(thisComponent._getMVCAsync(request, renderFunc));
		}

		promises.all(promiseResolutions)
		.then(function(componentMVCs) {
			callback(null, componentMVCs.join('\n'));
		})
		.catch(function(err) {
			callback(err);
		});
	},

	'_constructRouteMap': function(resources, callback) {
		var routeMap = '',
			self = this;

		if(resources.subRoutes && resources.subRoutes.length) {
			var promiseResolutions = [];
			for(var idx in resources.subRoutes) {
				promiseResolutions.push(this._constructRouteMapAsync(resources.subRoutes[idx]));
			}

			promises.all(promiseResolutions)
			.then(function(subRouteMaps) {
				var subRoutes = subRouteMaps.join('\n').trim();

				if(subRoutes != '') {
					routeMap = 'this.route(\'' + resources.name + '\', { \'path\': \'' + resources.path + '\'}, function() {\n';
					routeMap = routeMap + '\t' + subRoutes + '\n});\n';

					callback(null, routeMap);
					return;
				}

				if(resources.name && resources.path) {
					routeMap = 'this.route(\'' + resources.name + '\', { \'path\': \'' + resources.path + '\'});';
					callback(null, routeMap);
					return;
				}

				callback(null, '');
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error constructing route map: ', err);
				callback(err);
			});

			return;
		}

		if(resources.name && resources.path) {
			routeMap = 'this.route(\'' + resources.name + '\', { \'path\': \'' + resources.path + '\'});';
			callback(null, routeMap);
			return;
		}

		callback(null, '');
	},

	'_checkPermission': function(request, permission, tenantId, callback) {
		this.$dependencies.logger.silly('_checkPermission:\nUser: ', request.user.id, '\nPermission: ', permission, '\nTenant: ', tenantId, '\nCallback: ', !!callback);

		if(tenantId && !callback) {
			callback = tenantId;
			tenantId = null;
		}

		if(!request.user) {
			callback(null, false);
			return;
		}

		var self = this;
		if(!tenantId) {
			var allowed = false;

			Object.keys(request.user.tenants)
			.forEach(function(thisTenantId) {
				allowed = allowed || (request.user.tenants[thisTenantId].permissions.indexOf(permission) >= 0);
			});

			self.$dependencies.logger.silly('_checkPermission:\nUser: ', request.user.id, '\nPermission: ', permission, '\nTenant: ', tenantId, '\nAllowed: ', allowed);
			callback(null, allowed);

			return;
		}

		if(Object.keys(request.user.tenants).indexOf(tenantId) >= 0) {
			var allowed = (request.user.tenants[tenantId].permissions.indexOf(permission) >= 0);

			self.$dependencies.logger.silly('_checkPermission:\nUser: ', request.user.id, '\nPermission: ', permission, '\nTenant: ', tenantId, '\nAllowed: ', allowed);
			callback(null, allowed);

			return;
		}

		var database = this.$dependencies.databaseService;
		database.knex.raw('SELECT id FROM fn_get_tenant_parents(\'' + tenantId + '\') ORDER BY level ASC;')
		.then(function(tenantParents) {
			var allowed = false;

			for(var idx in tenantParents.rows) {
				var thisTenantParentId = tenantParents.rows[idx].id;
				if(!request.user.tenants[thisTenantParentId])
					continue;

				allowed = (request.user.tenants[thisTenantParentId].permissions.indexOf(permission) >= 0);
				break;
			}

			self.$dependencies.logger.silly('_checkPermission:\nUser: ', request.user.id, '\nPermission: ', permission, '\nTenant: ', tenantId, '\nAllowed: ', allowed);
			callback(null, allowed);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('_checkPermission Error: ', err);
			callback(err);
		});
	},

	'_camelize': function(inputObject) {
		var camelizedObject = {},
			self = this;

		if(!inputObject) return inputObject;
		
		Object.keys(inputObject)
		.forEach(function(key) {
			if(!inputObject[key]) {
				camelizedObject[inflection.camelize(key, true)] = inputObject[key];
				return;
			}

			if(typeof inputObject[key] == 'object') {
				if(!Object.keys(inputObject[key]).length) {
					camelizedObject[inflection.camelize(key, true)] = inputObject[key];
					return;
				}

				var subObject = self._camelize(inputObject[key]);
				if(!Object.keys(subObject).length) {
					camelizedObject[inflection.camelize(key, true)] = inputObject[key];
				}
				else {
					camelizedObject[inflection.camelize(key, true)] = subObject;
				}

				return;
			}

			camelizedObject[inflection.camelize(key, true)] = inputObject[key];
		});

		return camelizedObject;
	},

	'name': 'simpleComponent',
	'dependencies': ['logger', 'databaseService']
});

exports.baseComponent = simpleComponent;

