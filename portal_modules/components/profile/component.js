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

var profileComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);

		this['publicRouter'] = path.join(__dirname, 'ember/router-public.ejs');
		this['registeredRouter'] = path.join(__dirname, 'ember/router-registered.ejs');

		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.ejs');
		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.ejs');

		this['resetPasswordCtrl'] = path.join(__dirname, 'ember/controller-reset-password.js');
		this['registerAccountCtrl'] = path.join(__dirname, 'ember/controller-register-account.js');
		this['manageProfileCtrl'] = path.join(__dirname, 'ember/controller-manage-profile.js');
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
			renderOptions.userId = request.user.id;
		}

		response.type('application/javascript');
		response.render(routerFile, renderOptions);
	},

	'_getClientMVC': function(request, response, next) {
		response.type('application/javascript');
		response.status(200).send('');
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

	'_addRoutes': function() {
		var self = this;

		this.$router.get('/mvc/resetPassword', function(request, response, next) {
			response.type('application/javascript');

			filesystem.readFileAsync(self['resetPasswordCtrl'])
			.then(function(controllerFile) {
				response.status(200).send(controllerFile);
			}).
			catch(function(err) {
				response.status(500).json(err);
			});
		});

		this.$router.get('/mvc/registerAccount', function(request, response, next) {
			response.type('application/javascript');

			filesystem.readFileAsync(self['registerAccountCtrl'])
			.then(function(controllerFile) {
				response.status(200).send(controllerFile);
			}).
			catch(function(err) {
				response.status(500).json(err);
			});
		});

		this.$router.get('/mvc/manageProfile', function(request, response, next) {
			response.type('application/javascript');

			if(request.user) {
				filesystem.readFileAsync(self['manageProfileCtrl'])
				.then(function(controllerFile) {
					response.status(200).send(controllerFile);
				}).
				catch(function(err) {
					response.status(500).json(err);
				});
			}
			else {
				next();
			}
		});
	},

	'name': 'profile',
	'dependencies': ['logger']
});

exports.component = profileComponent;
