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

// Define the Application and the Router
if(window.developmentMode) console.log('Defining Ember App, Router, etc...');
define(
	"twyrPortal/application",
	["exports", "ember/resolver"],
	function(exports, emberResolver) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/application');
		var Resolver = emberResolver['default'];

		var TwyrApplication = window.Ember.Application.extend({
			'modulePrefix': 'twyrPortal',
			'Resolver': Resolver['default']
		});

		exports['default'] = TwyrApplication;
	}
);

define(
	"twyrPortal/router",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/router');
		var Router = window.Ember.Router.extend();

		Router.reopen({
			location: 'history'
		});

		exports['default'] = Router;
	}
);

define(
	"twyrPortal/app",
	["exports", "twyrPortal/application"],
	function(exports, application) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/app');

		var App = application.default.create({
			LOG_RESOLVER: window.developmentMode,
			LOG_ACTIVE_GENERATION: window.developmentMode, 
			LOG_TRANSITIONS: window.developmentMode, 
			LOG_TRANSITIONS_INTERNAL: window.developmentMode,
			LOG_VIEW_LOOKUPS: window.developmentMode
		});

		App.ApplicationAdapter = window.DS.JSONAPIAdapter.extend({
			'namespace': '',
			'host': window.apiServer.substring(0, window.apiServer.length - 1)
		});

		App.generateUUID = function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		};

		exports['default'] = App;
	}
);

// Define the services...
define(
	"twyrPortal/services/realtime-data",
	["exports", "twyrPortal/application"],
	function(exports, application) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/services/realtime-data');

		var RealtimeService = window.Ember.Service.extend(window.Ember.Evented, {
			'init': function() {
				if(window.developmentMode) console.log('twyrPortal/services/websockets::init: ', arguments);

				var self = this,
					dataProcessor = self._websocketDataProcessor.bind(self),
					streamer = window.Primus.connect(window.apiServer, {
						'strategy': 'online, disconnect',
						'ping': 3000,
						'pong': 6000
					});

				streamer.on('open', function() {
					if(window.developmentMode && arguments.length) console.log('twyrPortal/services/websockets::streamer::on::open: ', arguments);

					self.set('streamer', streamer);
					self.get('streamer').on('data', dataProcessor);

					self.trigger('websocket-connection');
				});

				streamer.on('close', function() {
					if(window.developmentMode && arguments.length) console.log('twyrPortal/services/websockets::streamer::on::close: ', arguments);
					self.trigger('websocket-disconnection');

					self.get('streamer').off('data', dataProcessor);
					self.set('streamer', null);
				});

				streamer.on('error', function() {
					if(window.developmentMode && arguments.length) console.error('twyrPortal/services/websockets::streamer::on::error: ', arguments);
				});

				this._super.apply(this, arguments);
			},

			'_websocketDataProcessor': function(websocketData) {
				if(window.developmentMode && arguments.length) console.log('twyrPortal/services/websockets::streamer::on::data: ', websocketData);
				this.trigger('websocket-data::' + websocketData.channel, websocketData.data);
			}
		});

		exports['default'] = RealtimeService;
	}
);

// Start off the Application...
if(window.developmentMode) console.log('Starting the Twyr Portal Browser App');
window.TwyrPortal = require('twyrPortal/app')['default'];
