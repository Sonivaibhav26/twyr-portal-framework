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
	},

	'_getClientRouter': function(request, response, next) {
		response.type('application/javascript');
		if(!request.user) {
			response.status(200).send('');
			return;
		}

		var self = this;
		self._checkPermissionAsync(request, requiredPermission)
		.then(function(allowed) {
			if(!allowed) {
				response.status(200).send('');
				return;
			}

			var renderOptions = {};
			renderOptions.mountPath = path.join(self.$module.$config.componentMountPath, self.name);
			renderOptions.tenantId = request.user.currentTenant.id;

			response.render(path.join(__dirname, 'ember/router.ejs'), renderOptions);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
			response.status(200).send('');
		});
	},

	'_getClientMVC': function(request, response, next) {
		response.type('application/javascript');
		response.status(200).send('');
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');

		if(!request.user) {
			response.status(200).send('');
			return;
		}

		var self = this;
		self._checkPermissionAsync(request, requiredPermission)
		.then(function(allowed) {
			if(!allowed) {
				return [];
			}

			var promiseResolutions = [];
	
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-template.js')));
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-tenant-machine-template.js')));
	
			return promises.all(promiseResolutions);
		})		
		.then(function(tmplFile) {
			response.status(200).send(tmplFile.join('\n'));
		})
		.catch(function(err) {
			response.status(err.code || err.number || 500).json(err);
		});
	},

	'_addRoutes': function() {
		var self = this;

		this.$router.get('/mvc/OrganizationManagerOrganizationStructure', function(request, response, next) {
			response.type('application/javascript');
			if(!request.user) {
				response.status(200).send('');
				return;
			}

			self._checkPermissionAsync(request, requiredPermission)
			.then(function(allowed) {
				if(!allowed) {
					return [];
				}

				var promiseResolutions = [];

				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-model.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-tenant-machine-model.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-view.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-controller.js')));

				return promises.all(promiseResolutions);
			})
			.then(function(mvcFiles) {
				response.status(200).send(mvcFiles.join('\n'));
			})
			.catch(function(err) {
				response.status(err.code || err.number || 500).json(err);
			});
		});

		this.$router.get('/mvc/OrganizationManagerTenantMachineManagement', function(request, response, next) {
			response.type('application/javascript');
			if(!request.user) {
				response.status(200).send('');
				return;
			}

			self._checkPermissionAsync(request, requiredPermission)
			.then(function(allowed) {
				if(!allowed) {
					return [];
				}

				var promiseResolutions = [];

				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-model.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-tenant-machine-model.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-tenant-machine-view.js')));
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-tenant-machine-controller.js')));

				return promises.all(promiseResolutions);
			})
			.then(function(mvcFiles) {
				response.status(200).send(mvcFiles.join('\n'));
			})
			.catch(function(err) {
				response.status(err.code || err.number || 500).json(err);
			});
		});
	},

	'name': 'organization-manager',
	'dependencies': ['logger']
});

exports.component = organizationManagerComponent;
