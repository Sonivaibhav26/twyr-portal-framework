/*
 * Name			: portal_modules/components/profile/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Profile Manager Component
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

var profileComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);

		this['publicRouter'] = path.join(__dirname, 'ember/router-public.js');
		this['registeredRouter'] = path.join(__dirname, 'ember/router-registered.js');

		this['publicModel'] = path.join(__dirname, 'ember/model-public.js');
		this['registeredModel'] = path.join(__dirname, 'ember/model-registered.js');

		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.ejs');
		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.ejs');

		this['publicCtrl'] = path.join(__dirname, 'ember/controller-public.js');
		this['registeredCtrl'] = path.join(__dirname, 'ember/controller-registered.js');
	},

	'_getClientRouter': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		var routerFile = '',
			self = this;

		if(!request.user)
			routerFile = this['publicRouter'];
		else
			routerFile = this['registeredRouter'];

		filesystem.readFileAsync(routerFile)
		.then(function(router) {
			response.status(200).send(router);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);

			response.type('application/javascript');
			response.status(500).json(err);
		});
	},

	'_getClientMVC': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		var model = '',
			controller = '',
			self = this;

		if(!request.user) {
			model = this['publicModel'];
			controller = this['publicCtrl'];
		}
		else {
			model = this['registeredModel'];
			controller = this['registeredCtrl'];
		}

		var promiseResolutions = [];
		promiseResolutions.push(filesystem.readFileAsync(model));
		promiseResolutions.push(filesystem.readFileAsync(controller));

		promises.all(promiseResolutions)
		.then(function(mvc) {
			response.status(200).send(mvc[0] + '\n' + mvc[1]);
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);

			response.type('application/javascript');
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
				'userName': request.user.first_name + ' ' + request.user.last_name,
				'social': request.user.social || {}
			};

			response.render(this['registeredTmpl'], renderOptions);
		}
	},

	'name': 'profile',
	'dependencies': ['logger']
});

exports.component = profileComponent;
