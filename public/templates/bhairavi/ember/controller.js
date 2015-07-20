define(
	"twyrPortal/application/controller",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/application/controller');
		var ApplicationController = window.Ember.Controller.extend({
			'widgetFilter': function() {
				var currPath = this.get('currentPath'),
					sepIdx = currPath.indexOf('.');

				if(sepIdx >= 0) {
					currPath = currPath.substring(0, sepIdx);
				}

				return currPath;
			}.property('currentPath')
		});

		exports['default'] = ApplicationController;
	}
);
