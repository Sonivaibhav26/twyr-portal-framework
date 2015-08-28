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

		setInterval(function() {
			var leftSidebar = window.Ember.$('div#div-bhairavi-left-sidebar'),
				rightSidebar = window.Ember.$('div#div-bhairavi-right-sidebar'),
				outlet = window.Ember.$('div#div-bhairavi-outlet');

			if(leftSidebar) leftSidebar.css('height', 'auto');
			if(rightSidebar) rightSidebar.css('height', 'auto');
			if(outlet) outlet.css('height', 'auto');

			if(window.Ember.$(':animated').length)
				return;

			var maxHeight = Math.max((leftSidebar ? leftSidebar.outerHeight() : 0), (rightSidebar ? rightSidebar.outerHeight() : 0), (outlet ? outlet.outerHeight(): 0));

			if(leftSidebar && (leftSidebar.outerHeight() < maxHeight)) leftSidebar.height(maxHeight);
			if(rightSidebar && (rightSidebar.outerHeight() < maxHeight)) rightSidebar.height(maxHeight);
			if(outlet && (outlet.outerHeight() < maxHeight)) outlet.height(maxHeight);
		}, 50)

		exports['default'] = ApplicationRoute;
	}
);
