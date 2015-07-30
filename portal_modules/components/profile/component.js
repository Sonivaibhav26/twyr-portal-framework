/*
 * Name			: portal_modules/components/profile/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Profile Component
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
		this._loadConfig(path.join(__dirname, 'config.js'));

		this['publicRouter'] = path.join(__dirname, 'ember/router-public.ejs');
		this['registeredRouter'] = path.join(__dirname, 'ember/router-registered.ejs');

		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.ejs');
		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.ejs');

		this['registeredModel'] = path.join(__dirname, 'ember/model-registered.js');

		this['publicCtrl'] = path.join(__dirname, 'ember/controller-public.js');
		this['registeredCtrl'] = path.join(__dirname, 'ember/controller-registered.js');
		this['profileCtrl'] = path.join(__dirname, 'ember/controller-manage-profile.js');

		if(this.$config.profileImagePath[0] != '/') {
			this.$config.profileImagePath = path.join(__dirname, this.$config.profileImagePath);
		}

		// Promisify what we need...
		this._existsAsync = promises.promisify(this._exists);
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

		response.render(routerFile, renderOptions);
	},

	'_getClientMVC': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);

		var controllerFile = '',
			modelFile = null,
			self = this;

		if(!request.user) {
			controllerFile = this['publicCtrl'];
		}
		else {
			modelFile =  this['registeredModel'];
			controllerFile = this['registeredCtrl'];
		}

		var promiseResolutions = [];
		promiseResolutions.push(filesystem.readFileAsync(controllerFile));
		if(modelFile) promiseResolutions.push(filesystem.readFileAsync(modelFile));

		promises.all(promiseResolutions)
		.then(function(files) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nResponse: ', files.join('\n'));
			response.status(200).send(files.join('\n'));
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);

			response.type('application/javascript');
			response.status(500).json(err);
		});
	},

	'_getClientTemplate': function(request, response, next) {
		this.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
		response.type('application/javascript');

		var tmplFile = '',
			renderOptions = {};

		if(!request.user) {
			tmplFile = this['publicTmpl'];
		}
		else {
			tmplFile = this['registeredTmpl'];
			renderOptions.mountPath = path.join(this.$module.$config.componentMountPath, this.name);
		}

		response.render(tmplFile, renderOptions);
	},

	'_addRoutes': function() {
		var self = this,
			anonImg = path.join(self.$config.profileImagePath, 'anonymous.png');

		this.$router.get('/mvc/manageProfile', function(request, response, next) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
	
			filesystem.readFileAsync(self['profileCtrl'])
			.then(function(controller) {
				self.$dependencies.logger.silly('Request response"' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nResponse: ', controller);
				response.status(200).send(controller);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);

				response.type('application/javascript');
				response.status(500).json(err);
			});
		});

		this.$router.get('/profileImage', function(request, response, next) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
			response.type('application/javascript');

			var profileImagePath = path.join(self.$config.profileImagePath, request.user.id) + '.jpg';
			self._existsAsync(profileImagePath)
			.then(function(exists) {
				if(exists)
					return filesystem.readFileAsync(profileImagePath);
				else
					return filesystem.readFileAsync(anonImg);
			})
			.then(function(image) {
				response.status(200).send(image);
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Get Profile Image:\nQuery: ' , request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				response.status(200).send(null);
			});
		});

		this.$router.put('/profileImage', function(request, response, next) {
			self.$dependencies.logger.silly('Servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params);
			response.type('application/javascript');

			var profileImagePath = path.join(self.$config.profileImagePath, request.user.id) + path.extname(request.body.fileName);

			filesystem.writeFileAsync(profileImagePath, new Buffer(request.body.image.substring(1 + request.body.image.indexOf(',')), 'base64'))
			.then(function() {
				response.status(200).json({ 'status': true, 'responseText': 'Saved image successfully' });
			})
			.catch(function(err) {
				self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
				response.status(422).json({ 'status': false, 'responseText': err.message });
			});
		});
	},

	'_exists': function(path, callback) {
		filesystem.exists(path, function(exists) {
			callback(null, exists);
		});
	},

	'name': 'profile',
	'dependencies': ['logger']
});

exports.component = profileComponent;
