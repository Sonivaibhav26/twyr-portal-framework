define(
	"twyrPortal/controllers/machine-manager-realtime-data",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/machine-manager-realtime-data');

		var MachineManagerRealtimeDataController = window.Ember.Controller.extend({
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
						this.send('portal-action', action, data);
				}
			}
		});

		exports['default'] = MachineManagerRealtimeDataController;
	}
);
