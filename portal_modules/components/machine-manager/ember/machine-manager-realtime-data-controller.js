define(
	"twyrPortal/controllers/machine-manager-realtime-data",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/machine-manager-realtime-data');

		var MachineManagerRealtimeDataController = window.Ember.Controller.extend({
			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-machine-manager-realtime-data-failure-message').slideUp(timeout || 600);

				window.Ember.$('div#div-machine-manager-realtime-data-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#machine-manager-realtime-data-alert-message').text('');

				window.Ember.$('div#div-machine-manager-realtime-data-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#machine-manager-realtime-data-progress-message').text('');

				window.Ember.$('div#div-machine-manager-realtime-data-success-message').slideUp(timeout || 600);
				window.Ember.$('span#machine-manager-realtime-data-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('div#div-machine-manager-realtime-data-' + statusMessageType + '-message').slideDown(600);
				if(statusMessageType != 'failure') {
					window.Ember.$('span#machine-manager-realtime-data-' + statusMessageType + '-message').html(messageText);
				}
			},

			'watchedCount': window.Ember.computed('model.@each.isWatched', {
				'get': function() {
					var watched = this.get('model').filterBy('isWatched', true);
					return !!watched.length;
				}
			}),

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						console.log('TODO: Handle ' + action + ' action with data: ', data);
				}
			}
		});

		exports['default'] = MachineManagerRealtimeDataController;
	}
);
