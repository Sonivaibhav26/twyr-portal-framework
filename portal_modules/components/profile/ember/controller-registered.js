define(
	"twyrPortal/controllers/profile",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/profile');

		var ProfileController = window.Ember.Controller.extend({
			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.send('portal-action', action, data);
				}
			}
		});

		exports['default'] = ProfileController;
	}
);
