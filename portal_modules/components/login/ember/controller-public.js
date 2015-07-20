define(
	"twyrPortal/components/login-form",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/login-form');
		var LoginFormComponent = window.Ember.Component.extend({
			'_initialize': function() {
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					window.Ember.$('button#button-login').removeClass('btn-primary');
					window.Ember.$('button#button-login').attr('disabled', 'disabled');

					window.Ember.$('input#input-username').on('input', function(e) {
						var username = window.Ember.$('input#input-username').val().trim();
						if(username != '') {
							window.Ember.$('button#button-login').addClass('btn-primary');
							window.Ember.$('button#button-login').removeAttr('disabled', 'disabled');
						}
						else {
							window.Ember.$('button#button-login').removeClass('btn-primary');
							window.Ember.$('button#button-login').attr('disabled');
						}
					});
				});
			}.on('init'),
			
			'actions': {
				'doLogin': function() {
					window.Ember.$('span#alert-message').text('');
					window.Ember.$('div#div-alert-message').css('display', 'none');
				
					window.Ember.$('div#div-input-username').removeClass('has-error');
					window.Ember.$('div#div-input-password').removeClass('has-error');
				
					window.Ember.$('input#input-username').attr('disabled', 'disabled');
					window.Ember.$('input#input-password').attr('disabled', 'disabled');
					window.Ember.$('button#button-login').attr('disabled', 'disabled');

					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'login/doLogin',
				
						'dataType': 'json',
						'data': {
							'username': this.get('username'),
							'password': this.get('password')
						},
				
						'success': function(data) {
							console.log('doLogin returned: ', data);
				
							if(data.status) {
								window.Ember.$('span#success-message').text(data.responseText);
								window.Ember.$('div#div-success-message').css('display', 'block');
				
								window.Ember.$('div#div-input-username').addClass('has-success');
								window.Ember.$('div#div-input-password').addClass('has-success');
				
								setTimeout(function() {
									window.location.href = '/';
								}, 500);
							}
							else {
								window.Ember.$('span#alert-message').text(data.responseText);
								window.Ember.$('div#div-alert-message').css('display', 'block');
				
								window.Ember.$('div#div-input-username').addClass('has-error');
								window.Ember.$('div#div-input-password').addClass('has-error');
				
								window.Ember.$('input#input-username').removeAttr('disabled');
								window.Ember.$('input#input-password').removeAttr('disabled');
								window.Ember.$('button#button-login').removeAttr('disabled');
				
								window.Ember.$('input#input-username').focus();
							}
						},
				
						'error': function(err) {
							console.error('doLogin returned: ', err);
				
							window.Ember.$('span#alert-message').text(err.responseText);
							window.Ember.$('div#div-alert-message').css('display', 'block');
				
							window.Ember.$('div#div-input-username').addClass('has-error');
							window.Ember.$('div#div-input-password').addClass('has-error');
				
							window.Ember.$('input#input-username').removeAttr('disabled');
							window.Ember.$('input#input-password').removeAttr('disabled');
							window.Ember.$('button#button-login').removeAttr('disabled');
				
							window.Ember.$('input#input-username').focus();
						}
					});
				},

				'doSocialLogin': function(socialNetwork) {
					var currentLocation = window.location.href;
					window.location.href = window.apiServer + 'login/' + socialNetwork + '?currentLocation=' + currentLocation;
				}
			}
		});

		exports['default'] = LoginFormComponent;
	}
);
