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
				'willTransition': function() {
					var leftSidebar = window.Ember.$('div#div-bhairavi-left-sidebar'),
						rightSidebar = window.Ember.$('div#div-bhairavi-right-sidebar'),
						outlet = window.Ember.$('div#div-bhairavi-outlet');

					if(leftSidebar) leftSidebar.css('height', 'auto');
					if(rightSidebar) rightSidebar.css('height', 'auto');
					if(outlet) outlet.css('height', 'auto');

					return true;
				},

				'didTransition': function() {
					window.Ember.run.scheduleOnce('afterRender', this, function() {
						var leftSidebar = window.Ember.$('div#div-bhairavi-left-sidebar'),
							rightSidebar = window.Ember.$('div#div-bhairavi-right-sidebar'),
							outlet = window.Ember.$('div#div-bhairavi-outlet'),
							sidebarHeight = Math.max((leftSidebar ? leftSidebar.outerHeight() : 0), (rightSidebar ? rightSidebar.outerHeight() : 0), (outlet ? outlet.outerHeight() : 0));

						if(leftSidebar) leftSidebar.css('height', sidebarHeight + 'px');
						if(rightSidebar) rightSidebar.css('height', sidebarHeight + 'px');
						if(outlet) outlet.css('height', sidebarHeight + 'px');
					});

					return true;
				}
			}
		});

		exports['default'] = ApplicationRoute;
	}
);
