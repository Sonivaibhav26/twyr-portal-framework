var Router = require('twyrPortal/router')['default'];
Router.map(function() {
	this.route('home', { 'path': '/' });
	this.route('error', { 'path': '*path' });
});

define(
	"twyrPortal/application/route",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/application/route');
		var ApplicationRoute = window.Ember.Route.extend({
			'beforeModel': function() {
				return window.Ember.$.getScript('/mvc');
			},

			'actions': {
				'portal-action': function(action, data) {
					this.get('controller').send('portal-action', action, data);
				}
			}
		});

		exports['default'] = ApplicationRoute;
	}
);
