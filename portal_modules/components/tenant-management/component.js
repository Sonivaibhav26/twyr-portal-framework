/*
 * Name			: portal_modules/components/tenant-management/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Tenant Management Component
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

var tenantManagementComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);
	},

	'_getClientRouter': function(request, response, next) {
		response.type('application/javascript');

		filesystem.readFileAsync(path.join(__dirname, 'ember/router.js'))
		.then(function(router) {
			response.status(200).send(router);
		})
		.catch(function(err) {
			response.status(500).json(err);
		});
	},

	'_getClientMVC': function(request, response, next) {
		response.type('application/javascript');
		response.status(200).send('');
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');

		filesystem.readFileAsync(path.join(__dirname, 'ember/templates.js'))
		.then(function(tmpl) {
			response.status(200).send(tmpl);
		})
		.catch(function(err) {
			response.status(500).json(err);
		});
	},

	'name': 'tenant-management',
	'dependencies': ['logger']
});

exports.component = tenantManagementComponent;
