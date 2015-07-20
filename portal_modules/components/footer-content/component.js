/*
 * Name			: portal_modules/components/footer-content/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Footer Content Component
 *
 */

"use strict";

/**
 * Module dependencies.
 */
var base = require('./../component-base').baseComponent,
	path = require('path'),
	prime = require('prime'),
	promises = require('bluebird'),
	uuid = require('node-uuid'),
	filesystem = promises.promisifyAll(require('fs'));

var footerComponent = prime({
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

	'name': 'footer-content',
	'dependencies': ['logger']
});

exports.component = footerComponent;
