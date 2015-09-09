define(
	"twyrPortal/components/logout-form",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/logout-form');

		var LogoutFormComponent = window.Ember.Component.extend({
			'doLogout': function() {
				window.Ember.$.ajax({
					'type': 'GET',
					'url': window.apiServer + 'profiles/doLogout',
					'dataType': 'json',

					'success': function(data) {
						if(!data.status) {
							alert(data);
						}

						window.location.href = '/';
					},

					'error': function(err) {
						alert(err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' ));
						window.location.href = '/';
					}
				});
			},

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = LogoutFormComponent;
	}
);

