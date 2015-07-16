var Router = require('twyrPortal/router')['default'];
Router.map(function() {
	this.route('home', { 'path': '/' });
	this.route('error', { 'path': '*path' });
});

define(
	"twyrPortal/application/route",
	["exports"],
	function(exports) {
		console.log('DEFINE: twyrPortal/application/route');

		var ApplicationRoute = window.Ember.Route.extend({
			'beforeModel': function() {
				return window.Ember.$.getScript('/mvc');
			}
		});

		exports['default'] = ApplicationRoute;
	}
);
