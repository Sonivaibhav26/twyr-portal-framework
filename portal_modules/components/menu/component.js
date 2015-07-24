/*
 * Name			: portal_modules/components/menu/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Menu Component
 *
 */

"use strict";

/**
 * Module dependencies, required for ALL Twy'r modules
 */
var base = require('./../component-base').baseComponent,
	prime = require('prime'),
	promises = require('bluebird');

var menuComponent = prime({
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

	'name': 'menu',
	'dependencies': ['logger']
});

exports.component = menuComponent;
