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
		if(!this._checkPermission(request, requiredPermission)) {
			response.status(200).send('');
			return;
		}

		var renderOptions = {};
		renderOptions.mountPath = path.join(this.$module.$config.componentMountPath, this.name);
		renderOptions.tenantId = request.user.currentTenant.id;

		response.render(path.join(__dirname, 'ember/router.ejs'), renderOptions);
	},

	'_getClientMVC': function(request, response, next) {
		response.type('application/javascript');
		response.status(200).send('');
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');
		if(!this._checkPermission(request, requiredPermission)) {
			response.status(200).send('');
			return;
		}

		var organizationStructureTmpl = path.join(__dirname, 'ember/organization-manager-organization-structure-template-index.js'),
			organizationStructureTreeTmpl = path.join(__dirname, 'ember/organization-manager-organization-structure-template-tree.js'),
			organizationStructureAboutTmpl = path.join(__dirname, 'ember/organization-manager-organization-structure-template-about.js'),
			organizationStructureSubsidiaryTmpl = path.join(__dirname, 'ember/organization-manager-organization-structure-template-subsidiaries.js'),
			organizationStructureDepartmentTmpl = path.join(__dirname, 'ember/organization-manager-organization-structure-template-departments.js'),
			organizationStructurePartnerTmpl = path.join(__dirname, 'ember/organization-manager-organization-structure-template-partners.js');

		var groupManagementTmpl = path.join(__dirname, 'ember/organization-manager-group-management-template-index.js');

		var promiseResolutions = [];

		promiseResolutions.push(filesystem.readFileAsync(organizationStructureTmpl));
		promiseResolutions.push(filesystem.readFileAsync(organizationStructureAboutTmpl));
		promiseResolutions.push(filesystem.readFileAsync(organizationStructureTreeTmpl));
		promiseResolutions.push(filesystem.readFileAsync(organizationStructureSubsidiaryTmpl));
		promiseResolutions.push(filesystem.readFileAsync(organizationStructureDepartmentTmpl));
		promiseResolutions.push(filesystem.readFileAsync(organizationStructurePartnerTmpl));

		promiseResolutions.push(filesystem.readFileAsync(groupManagementTmpl));

		promises.all(promiseResolutions)
		.then(function(tmplFiles) {
			response.status(200).send(tmplFiles.join('\n'));
		})
		.catch(function(err) {
			response.status(err.code || err.number || 500).json(err);
		});
	},

	'_addRoutes': function() {
		var self = this;

		this.$router.get('/mvc/organization-manager-organization-structure', function(request, response, next) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
			response.type('application/javascript');
			if(!self._checkPermission(request, requiredPermission)) {
				response.status(200).send('');
				return;
			}

			var promiseResolutions = [];

			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-model.js')));
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-view.js')));
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-organization-structure-controller.js')));

			promises.all(promiseResolutions)
			.then(function(mvcFiles) {
				response.status(200).send(mvcFiles.join('\n'));
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				response.status(err.code || err.number || 500).json(err);
			});
		});

		this.$router.get('/mvc/organization-manager-group-management', function(request, response, next) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
			response.type('application/javascript');
			if(!self._checkPermission(request, requiredPermission)) {
				response.status(200).send('');
				return;
			}

			var promiseResolutions = [];

			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-group-management-model.js')));

			promises.all(promiseResolutions)
			.then(function(mvcFiles) {
				response.status(200).send(mvcFiles.join('\n'));
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				response.status(err.code || err.number || 500).json(err);
			});
		});
	},

	'name': 'organization-manager',
	'dependencies': ['logger']
});

exports.component = organizationManagerComponent;
