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
						'url': window.apiServer + 'profiles/doLogout',
						'dataType': 'json',

						'success': function(data) {
							if(!data.status) {
								console.error('Logout Error: ', data);
							}

							window.location.href = '/';
						},

						'error': function(err) {
							console.error('Logout Error: ', err);
							window.location.href = '/';
						}
					});
				}
			}
		});

		exports['default'] = LogoutFormComponent;
	}
);
