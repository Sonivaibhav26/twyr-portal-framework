/*
 * Name			: portal_modules/components/login/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Login/logout Component
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

var loginComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);

		this['router'] = path.join(__dirname, 'ember/router.ejs');

		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.ejs');
		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.ejs');

		this['publicView'] = path.join(__dirname, 'ember/view-public.js');
		this['registeredView'] = path.join(__dirname, 'ember/view-registered.js');

		// Promisify what we need...
		this._existsAsync = promises.promisify(this._exists);
	},

	'_getResources': function(request, renderFunc, callback) {
		var self = this;
		loginComponent.parent._getResources.call(self, request, renderFunc, function(err, componentResources) {
			if(err) {
				callback(err);
				return;
			}

			callback(null, {});
		});
	},

	'_getRoutes': function(request, renderFunc, callback) {
		var self = this;
		loginComponent.parent._getRoutes.call(self, request, renderFunc, function(err, componentRoutes) {
			if(err) {
				callback(err);
				return;
			}

			var renderOptions = {};
			renderOptions.mountPath = path.join(self.$module.$config.componentMountPath, self.name);

			renderFunc(self['router'], renderOptions)
			.then(function(renderedRoute) {
				callback(null, renderedRoute + '\n' + componentRoutes);
			})
			.catch(function(err) {
				callback(err);
			});
		});
	},

	'_getMVC': function(request, renderFunc, callback) {
		var self = this;
		loginComponent.parent._getMVC.call(self, request, renderFunc, function(err, componentMVC) {
			if(err) {
				callback(err);
				return;
			}

			var viewFile = '';
	
			if(!request.user) {
				viewFile = self['publicView'];
			}
			else {
				viewFile = self['registeredView'];
			}

			filesystem.readFileAsync(viewFile)	
			.then(function(file) {
				callback(null, file + '\n' + componentMVC);
			})
			.catch(function(err) {
				callback(err);
			});
		});
	},

	'_getTemplates': function(request, renderFunc, callback) {
		var self = this;
		loginComponent.parent._getTemplates.call(self, request, renderFunc, function(err, componentTemplates) {
			if(err) {
				callback(err);
				return;
			}

			var tmplFile = '',
				renderOptions = {};
	
			if(!request.user) {
				tmplFile = self['publicTmpl'];
			}
			else {
				tmplFile = self['registeredTmpl'];
				renderOptions.mountPath = path.join(self.$module.$config.componentMountPath, self.name);
			}
	
			renderFunc(tmplFile, renderOptions)
			.then(function(renderedTemplate) {
				callback(null, renderedTemplate + '\n' + componentTemplates);
			})
			.catch(function(err) {
				callback(err);
			});
		});
	},

	'_exists': function(path, callback) {
		filesystem.exists(path, function(exists) {
			callback(null, exists);
		});
	},

	'name': 'login',
	'dependencies': ['logger']
});

exports.component = loginComponent;
