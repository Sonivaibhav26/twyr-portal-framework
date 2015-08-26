/*
 * Name			: portal_modules/components/machine-manager/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Machine Manager Component
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

var machineManagerComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);
	},


	'start': function(dependencies, callback) {
		var self = this;

		machineManagerComponent.parent.start.call(self, dependencies, function(err, status) {
			if(err) {
				callback(err);
				return;
			}

			var database = self.$dependencies.databaseService;

			Object.defineProperty(self, '$TenantMachineModel', {
				'__proto__': null,
				'value': database.Model.extend({
					'tableName': 'tenant_machines',
					'idAttribute': 'id',

					'userTenantMachines': function() {
						return this.hasMany(self.$UserTenantMachineModel, 'tenant_machine_id');
					}
				})
			});

			Object.defineProperty(self, '$UserTenantMachineModel', {
				'__proto__': null,
				'value': database.Model.extend({
					'tableName': 'user_tenant_machines',
					'idAttribute': 'id',

					'tenantMachine': function() {
						return this.belongsTo(self.$TenantMachineModel, 'tenant_machine_id');
					}
				})
			});

			callback(null, status);
		});
	},

	'_getClientRouter': function(request, response, next) {
		response.type('application/javascript');
		if(!request.user) {
			response.status(200).send('');
			return;
		}

		var self = this;

		var renderOptions = {};
		renderOptions.mountPath = path.join(self.$module.$config.componentMountPath, self.name);
		renderOptions.userId = request.user.id;

		response.render(path.join(__dirname, 'ember/router.ejs'), renderOptions);
	},

	'_getClientMVC': function(request, response, next) {
		response.type('application/javascript');
		if(!request.user) {
			response.status(200).send('');
			return;
		}

		var self = this;

		new self.$UserTenantMachineModel()
		.query('where', 'user_id', '=', request.user.id)
		.fetchAll({ 'withRelated': ['tenantMachine'] })
		.then(function(userTenantMachines) {
			userTenantMachines = self._camelize(userTenantMachines.toJSON());

			var emberComponents = [];
			for(var idx in userTenantMachines) {
				var thisUserTenantMachine = userTenantMachines[idx],
					thisEmberComponent = thisUserTenantMachine.tenantMachine.emberComponent;

				if(thisEmberComponent == 'machine-manager-realtime-data-default-display')
					continue;

				if(thisEmberComponent == 'machine-manager-realtime-data-non-default-display')
					continue;

				if(emberComponents.indexOf(thisEmberComponent) >= 0)
					continue;

				emberComponents.push(thisEmberComponent);
			}

			var promiseResolutions = [];

			for(var idx in emberComponents) {
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'display-components', (emberComponents[idx] + '.js'))));
			}

			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/machine-manager-realtime-data-model.js')));
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/machine-manager-realtime-data-view.js')));
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/machine-manager-realtime-data-controller.js')));
	
			return promises.all(promiseResolutions);
		})
		.then(function(mvcFiles) {
			response.status(200).send(mvcFiles.join('\n'));
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error sending realtime-machine-data templates: ', err);
			response.status(err.code || err.number || 500).json(err);
		});
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');
		if(!request.user) {
			response.status(200).send('');
			return;
		}

		var self = this;
		new self.$UserTenantMachineModel()
		.query('where', 'user_id', '=', request.user.id)
		.fetchAll({ 'withRelated': ['tenantMachine'] })
		.then(function(userTenantMachines) {
			userTenantMachines = self._camelize(userTenantMachines.toJSON());

			var emberTemplates = [];
			for(var idx in userTenantMachines) {
				var thisUserTenantMachine = userTenantMachines[idx],
					thisEmberTemplate = thisUserTenantMachine.emberTemplate || thisUserTenantMachine.tenantMachine.emberTemplate;

				if(emberTemplates.indexOf(thisEmberTemplate) < 0) {
					emberTemplates.push(thisEmberTemplate);
				}
			}

			var promiseResolutions = [];

			for(var idx in emberTemplates) {
				promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'display-templates', (emberTemplates[idx] + '.js'))));
			}

			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/machine-manager-realtime-data-template.js')));
			return promises.all(promiseResolutions);
		})
		.then(function(tmplFiles) {
			response.status(200).send(tmplFiles.join('\n'));
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error sending realtime-machine-data templates: ', err);
			response.status(err.code || err.number || 500).json(err);
		});
	},

	'name': 'machine-manager',
	'dependencies': ['logger', 'databaseService']
});

exports.component = machineManagerComponent;
