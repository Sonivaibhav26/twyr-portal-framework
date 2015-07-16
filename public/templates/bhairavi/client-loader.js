/*
 * Name			: public/templates/bhairavi/client-loader.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal client application "Bhairavi" template loader / initializer
 *
 */

"use strict";

if(window.developmentMode) console.log('Loading Ember Templates: ', window.templates);
window.curl(window.templates)
.then(function() {
	if(window.developmentMode) console.log('Injecting Ember Templates...');
	for(var idx = 0; idx < arguments.length; idx++) {
		if(!arguments[idx])
			continue;

		if(arguments[idx] == '')
			continue;

		window.$('head').append(arguments[idx]);
	}

	var loadedEmberResolverScripts = [];

	if(window.developmentMode) console.log('Loading Ember Resolvers: ', window.emberResolverScripts);
	window.curl(window.emberResolverScripts)
	.then(function() {
		for(var idx = 0; idx < arguments.length; idx++) {
			if(!arguments[idx])
				continue;

			if(arguments[idx] == '')
				continue;

			loadedEmberResolverScripts.push('<script type="application/javascript">' + arguments[idx] + '</script>');
		}
	
		if(window.developmentMode) console.log('Loading Ember Routes: ', window.routes);
		window.curl(window.routes)
		.then(function() {
			if(window.developmentMode) console.log('Injecting Ember Resolvers...');
			for(var idx = 0; idx < loadedEmberResolverScripts.length; idx++) {
				window.$('head').append(loadedEmberResolverScripts[idx]);
			}
		
			if(window.developmentMode) console.log('Defining Ember App, Router, etc...');
			define(
				"twyrPortal/router",
				["exports"],
				function(exports) {
					console.log('DEFINE: twyrPortal/router');
					var Router = window.Ember.Router.extend();

					Router.reopen({
						location: 'history'
					});

					exports['default'] = Router;
				}
			);

			define(
				"twyrPortal/app",
				["ember/resolver","exports"],
				function(emberResolver, exports) {
					console.log('DEFINE: twyrPortal/app');
					var Resolver = emberResolver['default'];

					var TwyrApplication = window.Ember.Application.extend({
						'modulePrefix': 'twyrPortal',
						'Resolver': Resolver['default']
					});

					var App = TwyrApplication.create({
						LOG_RESOLVER: window.developmentMode,
						LOG_ACTIVE_GENERATION: window.developmentMode, 
						LOG_TRANSITIONS: window.developmentMode, 
						LOG_TRANSITIONS_INTERNAL: window.developmentMode,
						LOG_VIEW_LOOKUPS: window.developmentMode
					});

					App.ApplicationAdapter = window.DS.RESTAdapter.extend({
						'namespace': '',
						'host': window.apiServer.substring(0, window.apiServer.length - 1),

						'ajaxError': function(jqXHR) {
							if (jqXHR && jqXHR.status == 422) {
								var jsonErrors = window.Ember.$.parseJSON(jqXHR.responseText)["errors"];
								return new window.DS.InvalidError(jsonErrors);
							}
							else {
								var error = this._super(jqXHR);
								return error;
							}
						}
					});

					exports['default'] = App;
				}
			);

			if(window.developmentMode) console.log('Injecting Ember Routes...');
			for(var idx = 0; idx < arguments.length; idx++) {
				if(!arguments[idx])
					continue;

				if(arguments[idx] == '')
					continue;

				window.$('head').append('<script type="application/javascript">' + arguments[idx] + '</script>');
			}

			// Start off the Application...
			if(window.developmentMode) console.log('Starting the Twyr Portal Browser App');
			window.TwyrPortal = require('twyrPortal/app')['default'];
		}, function(err) {
			console.error('Error loading Ember Routes: ', err);
		});
	}, function(err) {
		console.error('Error loading Ember Resolver Scripts: ', err);
	});
}, function(err) {
	console.error('Could not load Ember Templates: ', err);
});
