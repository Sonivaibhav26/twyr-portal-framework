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
 * Module dependencies.
 */
var base = require('./../component-base').baseComponent,
	path = require('path'),
	prime = require('prime'),
	promises = require('bluebird'),
	uuid = require('node-uuid'),
	filesystem = promises.promisifyAll(require('fs'));

var loginComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);

		this['publicRouter'] = path.join(__dirname, 'ember/router-public.js');

		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.ejs');
		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.ejs');

		this['publicCtrl'] = path.join(__dirname, 'ember/controller-public.js');
		this['registeredCtrl'] = path.join(__dirname, 'ember/controller-registered.js');
	},

	'_getClientRouter': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		var self = this;
		if(!request.user) {
			filesystem.readFileAsync(this['publicRouter'])
			.then(function(router) {
				response.status(200).send(router);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);

				response.type('application/javascript');
				response.status(500).json(err);
			});
		}
		else {
			response.status(200).send('');
		}
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
			response.status(200).send(controller);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
			response.status(500).json(err);
		});
	},

	'_getClientTemplate': function(request, response, next) {
		response.type('application/javascript');

		if(!request.user) {
			response.render(this['publicTmpl']);
		}
		else {
			var renderOptions = {
				'userId': request.user.id,
				'userName': request.user.first_name + ' ' + request.user.last_name
			};

			response.render(this['registeredTmpl'], renderOptions);
		}
	},

	'name': 'login',
	'dependencies': ['logger']
});

exports.component = loginComponent;
