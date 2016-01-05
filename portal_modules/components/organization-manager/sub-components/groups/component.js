/*
 * Name			: portal_modules/components/organization-manager/sub-components/groups/component.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Organization Manager Groups Sub-component
 *
 */

"use strict";

/**
 * Module dependencies, required for ALL Twy'r modules
 */
var base = require('./../../../component-base').baseComponent,
	prime = require('prime'),
	promises = require('bluebird');

/**
 * Module dependencies, required for this module
 */
var filesystem = promises.promisifyAll(require('fs')),
	path = require('path'),
	uuid = require('node-uuid');

/**
 * Magic Numbers
 */
var requiredPermission = '00000000-0000-0000-0000-000000000000';

var organizationManagerGroupsComponent = prime({
	'inherits': base,

	'constructor': function() {
		base.call(this);
	},

	'_getMVC': function(request, renderFunc, callback) {
		if(!request.user) {
			callback(null, '');
			return;
		}

		var self = this;
		self._checkPermissionAsync(request, requiredPermission)
		.then(function(allowed) {
			if(!allowed) {
				return [];
			}

			var promiseResolutions = [];

			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-groups-model.js')));
			promiseResolutions.push(filesystem.readFileAsync(path.join(__dirname, 'ember/organization-manager-groups-view.js')));

			return promises.all(promiseResolutions);
		})
		.then(function(mvcFiles) {
			callback(null, mvcFiles.join('\n'));
			return null;
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
			callback(null, '');
		});
	},

	'_getTemplates': function(request, renderFunc, callback) {
		if(!request.user) {
			callback(null, '');
			return;
		}

		var self = this;
		self._checkPermissionAsync(request, requiredPermission)
		.then(function(allowed) {
			if(!allowed) {
				return '';
			}

			return renderFunc(path.join(__dirname, 'ember/organization-manager-groups-template.ejs'));
		})
		.then(function(tmplFile) {
			callback(null, tmplFile);
			return null;
		})
		.catch(function(err) {
			self.$dependencies.logger.error('Error servicing request "' + request.path + '":\nQuery: ', request.query, '\nBody: ', request.body, '\nParams: ', request.params, '\nError: ', err);
			callback(err);
		});
	},

	'name': 'organization-manager-groups',
	'displayName': 'Groups',
	'dependencies': ['logger', 'databaseService']
});

exports.component = organizationManagerGroupsComponent;
