define(
	"twyrPortal/application/controller",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/application/controller');
		var ApplicationController = window.Ember.Controller.extend({
			'realtimeData': window.Ember.inject.service('realtime-data'),

			'init': function() {
				this._super.apply(this, arguments);

				var self = this;
				this.get('realtimeData').on('websocket-data::display-status-message', function(data) {
					self['display-status-message']({ 'type': 'info', 'message': data});
				});
			},

			'widgetFilter': window.Ember.computed('currentPath', {
				'get': function(key) {
					var currPath = this.get('currentPath'),
						sepIdx = currPath.indexOf('.');

					if(sepIdx >= 0) {
						currPath = currPath.substring(0, sepIdx);
					}

					return currPath;
				}
			}),

			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#bhairavi-status-message').slideUp(timeout || 600);
				window.Ember.$('div#bhairavi-status-message span').text('');

				window.Ember.$('div#bhairavi-error-message').slideUp(timeout || 600);
				this.set('errorModel', null);
			},

			'display-status-message': function(data) {
				this.resetStatusMessages(2);

				if(data.type != 'error') {
					window.Ember.$('div#bhairavi-status-message').addClass('callout-' + data.type);
					window.Ember.$('div#bhairavi-status-message span').html(data.message);

					window.Ember.$('div#bhairavi-status-message').slideDown(600);
				}
				else {
					this.set('errorModel', data.errorModel);
					window.Ember.$('div#bhairavi-error-message').slideDown(600);
				}

				var self = this;
				window.Ember.run.later(self, function() {
					window.Ember.$('div#bhairavi-status-message').removeClass('callout-' + data.type);
					self.resetStatusMessages(600);
				}, 10000);
			},

			'actions': {
				'portal-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						console.log('TODO: Handle ' + action + ' action with data: ', data);
				}
			}
		});

		exports['default'] = ApplicationController;
	}
);
