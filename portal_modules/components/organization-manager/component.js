/*
 * Name			: portal_modules/components/organization-manager/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Organization Manager Component
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
	path = require('path'),
	uuid = require('node-uuid');

/**
 * Magic Numbers
 */
var requiredPermission = '00000000-0000-0000-0000-000000000000';

var organizationManagerComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);
		this._loadConfig(path.join(__dirname, 'config.js'));
	},

	'_getResources': function(request, renderFunc, callback) {
		if(!request.user) {
			callback(null, '');
			return;
		}

		var self = this;
		organizationManagerComponent.parent._getResources.call(self, request, renderFunc, function(err, componentResources) {
			if(err) {
				callback(err);
				return;
			}

			self._checkPermissionAsync(request, requiredPermission)
			.then(function(allowed) {
				if(!allowed) {
					throw({ 'code': 403, 'message': 'Unauthorized access!' });
					return;
				}

				callback(null, {
					'name': 'organization-manager',
					'path': '/organization',
	
					'subRoutes': componentResources
				});
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				callback(err);
			});
		});
	},

	'_getRoutes': function(request, renderFunc, callback) {
		if(!request.user) {
			callback(null, '');
			return;
		}

		var self = this;
		organizationManagerComponent.parent._getRoutes.call(self, request, renderFunc, function(err, componentRoutes) {
			if(err) {
				callback(err);
				return;
			}

			self._checkPermissionAsync(request, requiredPermission)
			.then(function(allowed) {
				if(!allowed) {
					throw({ 'code': 403, 'message': 'Unauthorized access!' });
					return;
				}

				var renderOptions = {};
				renderOptions.mountPath = path.join(self.$module.$config.componentMountPath, self.name);
				renderOptions.tenantIds = [];
	
				Object.keys(request.user.tenants).forEach(function(tenantId) {
					renderOptions.tenantIds.push(tenantId);
				});
	
				return renderFunc(path.join(__dirname, 'ember/router.ejs'), renderOptions);
			})
			.then(function(renderedRoute) {
				callback(null, renderedRoute + '\n' + componentRoutes);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				callback(null, '');
			});
		});
	},

	'_getMVC': function(request, renderFunc, callback) {
		if(!request.user) {
			callback(null, '');
			return;
		}

		var self = this;
		organizationManagerComponent.parent._getMVC.call(self, request, renderFunc, function(err, componentMVC) {
			if(err) {
				callback(err);
				return;
			}

			self._checkPermissionAsync(request, requiredPermission)
			.then(function(allowed) {
				if(!allowed) {
					throw({ 'code': 403, 'message': 'Unauthorized access!' });
					return;
				}
	
				var promiseResolutions = [];
	
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-model.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-view.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-controller.js')));
	
				return promises.all(promiseResolutions);
			})
			.then(function(mvcFiles) {
				mvcFiles.push(componentMVC);
				callback(null, mvcFiles.join('\n'));
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				callback(null, '');
			});
		});
	},

	'_getTemplates': function(request, renderFunc, callback) {
		if(!request.user) {
			callback(null, '');
			return;
		}

		var self = this;
		organizationManagerComponent.parent._getTemplates.call(self, request, renderFunc, function(err, componentTemplates) {
			if(err) {
				callback(err);
				return;
			}

			self._checkPermissionAsync(request, requiredPermission)
			.then(function(allowed) {
				if(!allowed) {
					throw({ 'code': 403, 'message': 'Unauthorized access!' });
					return;
				}
	
				var renderOptions = { 'components': [] };
				for(var idx in self.$components) {
					renderOptions.components.push({
						'name': self.$components[idx].name,
						'displayName': self.$components[idx].displayName
					});
				}
	
				return renderFunc(path.join(__dirname, 'ember/organization-manager-template.ejs'), renderOptions);
			})		
			.then(function(tmplFile) {
				callback(null, tmplFile + '\n' + componentTemplates);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				callback(null, '');
			});
		});
	},

	'name': 'organization-manager',
	'dependencies': ['logger', 'databaseService']
});

exports.component = organizationManagerComponent;
