/*
 * Name			: portal_modules/components/login/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Login Component
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

		this['publicRouter'] = path.join(__dirname, 'ember/router-public.ejs');
		this['registeredRouter'] = path.join(__dirname, 'ember/router-registered.ejs');

		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.hbs');
		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.hbs');

		this['publicCtrl'] = path.join(__dirname, 'ember/controller-public.js');
		this['registeredCtrl'] = path.join(__dirname, 'ember/controller-registered.js');
	},

	'_getClientRouter': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		var routerFile = '',
			renderOptions = {};

		renderOptions.mountPath = path.join(this.$module.$config.componentMountPath, this.name);
		if(!request.user) {
			routerFile = this['publicRouter'];
		}
		else {
			routerFile = this['registeredRouter'];
		}

		response.type('application/javascript');
		response.render(routerFile, renderOptions);
	},

	'_getClientMVC': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		var controllerFile = '',
			self = this;

		if(!request.user) {
			controllerFile = this['publicCtrl'];
		}
		else {
			controllerFile = this['registeredCtrl'];
		}

		response.type('application/javascript');

		filesystem.readFileAsync(controllerFile)
		.then(function(controller) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nResponse: ', controller);
			response.status(200).send(controller);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
			response.status(500).json(err);
		});
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');

		var tmplFile = '';
		if(!request.user) {
			tmplFile = this['publicTmpl'];
		}
		else {
			tmplFile = this['registeredTmpl'];
		}

		filesystem.readFileAsync(tmplFile)
		.then(function(tmpl) {
			response.status(200).send(tmpl);
		})
		.catch(function(err) {
			response.status(500).json(err);
		});
	},

	'name': 'login',
	'dependencies': ['logger']
});

exports.component = loginComponent;
