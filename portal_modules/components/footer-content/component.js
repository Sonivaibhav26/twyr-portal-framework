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

var footerComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);
	},

	'_getTemplates': function(request, renderFunc, callback) {
		var self = this;
		footerComponent.parent._getTemplates.call(self, request, renderFunc, function(err, componentTemplates) {
			if(err) {
				callback(err);
				return;
			}

			filesystem.readFileAsync(path.join(__dirname, 'ember/templates.js'))
			.then(function(tmpl) {
				callback(null, tmpl + '\n' + componentTemplates);
			})
			.catch(function(err) {
				callback(err);
			});
		});
	},

	'_getResources': function(request, renderFunc, callback) {
		var self = this;
		footerComponent.parent._getResources.call(self, request, renderFunc, function(err, componentResources) {
			if(err) {
				callback(err);
				return;
			}

			callback(null, [{
				'name': 'about',
				'path': '/about'
			}, {
				'name': 'terms',
				'path': '/terms'
			}, {
				'name': 'privacy',
				'path': '/privacy'
			}, {
				'name': 'contact',
				'path': '/contact'
			}]);
		});
	},

	'name': 'footer-content',
	'dependencies': ['logger']
});

exports.component = footerComponent;
