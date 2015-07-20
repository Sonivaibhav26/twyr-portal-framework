define(
	"twyrPortal/components/logout-form",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/logout-form');

		var LogoutFormComponent = window.Ember.Component.extend({
			'actions': {
				'doLogout': function() {
					window.Ember.$.ajax({
						'type': 'GET',
						'url': window.apiServer + 'login/doLogout',

						'success': function(data) {
							if(data.status) {
								window.location.href = '/';
							}
						}
					});
				}
			}
		});

		exports['default'] = LogoutFormComponent;
	}
);