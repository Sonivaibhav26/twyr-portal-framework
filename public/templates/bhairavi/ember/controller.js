define(
	"twyrPortal/application/controller",
	["exports"],
	function(exports) {
		console.log('DEFINE: twyrPortal/application/controller');
		var ApplicationController = window.Ember.Controller.extend({
			'componentChanger': function() {
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
