/*
 * Name			: portal_modules/components/mobile/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Mobile Component
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

var mobileComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);
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
		response.status(200).send('');
	},

	'_addRoutes': function() {
		var self = this,
			cacheService = this.$dependencies.cacheService,
			logger = this.$dependencies.logger;

		self.$router.get('/machine/:machineId', function(request, response, next) {
			if(!request.isAuthenticated()) {
				response.type('application/javascript');
				response.status(403).send('');
				return;
			}
		});
	},

	'name': 'mobile',
	'dependencies': ['logger', 'cacheService', 'databaseService']
});

exports.component = mobileComponent;
