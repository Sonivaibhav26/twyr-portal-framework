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
		this['publicTmpl'] = path.join(__dirname, 'ember/template-public.ejs');
		this['publicCtrl'] = path.join(__dirname, 'ember/controller-public.js');

		this['registeredTmpl'] = path.join(__dirname, 'ember/template-registered.ejs');
		this['registeredRouter'] = path.join(__dirname, 'ember/router-registered.ejs');
		this['registeredModel'] = path.join(__dirname, 'ember/model-registered.js');
		this['registeredView'] = path.join(__dirname, 'ember/view-registered.js');
		this['registeredCtrl'] = path.join(__dirname, 'ember/controller-registered.js');

		if(this.$config.profileImagePath[0] != '/') {
			this.$config.profileImagePath = path.join(__dirname, this.$config.profileImagePath);
		}

		// Promisify what we need...
		this._existsAsync = promises.promisify(this._exists);
	},

	'_getResources': function(request, renderFunc, callback) {
		var self = this;
		profileComponent.parent._getResources.call(self, request, renderFunc, function(err, componentResources) {
			if(err) {
				callback(err);
				return;
			}

			if(!request.user) {
				callback(null, {});
				return;
			}

			callback(null, {
				'name': 'profile',
				'path': '/profile'
			});
		});
	},

	'_getRoutes': function(request, renderFunc, callback) {
		var self = this;
		profileComponent.parent._getRoutes.call(self, request, renderFunc, function(err, componentRoutes) {
			if(err) {
				callback(err);
				return;
			}

			var routerFile = '',
				renderOptions = {};
	
			renderOptions.mountPath = path.join(self.$module.$config.componentMountPath, self.name);
			if(!request.user) {
				routerFile = self['publicRouter'];
			}
			else {
				routerFile = self['registeredRouter'];
				renderOptions.userId = request.user.id;
			}
	
			renderFunc(routerFile, renderOptions)
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
		profileComponent.parent._getMVC.call(self, request, renderFunc, function(err, componentMVC) {
			if(err) {
				callback(err);
				return;
			}

			var controllerFile = '',
				modelFile = null,
				viewFile = '';
	
			if(!request.user) {
				controllerFile = self['publicCtrl'];
			}
			else {
				modelFile =  self['registeredModel'];
				viewFile = self['registeredView'];
				controllerFile = self['registeredCtrl'];
			}
	
			var promiseResolutions = [];
			promiseResolutions.push(filesystem.readFileAsync(controllerFile));
			if(modelFile) promiseResolutions.push(filesystem.readFileAsync(modelFile));
			if(viewFile) promiseResolutions.push(filesystem.readFileAsync(viewFile));

			promises.all(promiseResolutions)
			.then(function(files) {
				files.push(componentMVC);
				callback(null, files.join('\n'));
			})
			.catch(function(err) {
				callback(err);
			});
		});
	},

	'_getTemplates': function(request, renderFunc, callback) {
		var self = this;
		profileComponent.parent._getTemplates.call(self, request, renderFunc, function(err, componentTemplates) {
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

	'_addRoutes': function() {
		var self = this,
			anonImg = path.join(self.$config.profileImagePath, 'anonymous.png');

		this.$router.get('/logoutComponent', function(request, response, next) {
			response.type('application/javascript');

			filesystem.readFileAsync(path.join(__dirname, 'ember/logoutcomponent.js'))
			.then(function(logoutcomponent) {
				response.status(200).send(logoutcomponent);
			})
			.catch(function(err) {
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
