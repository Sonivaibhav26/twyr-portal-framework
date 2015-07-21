define(
	"twyrPortal/reset-password/controller",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/reset-password/controller');

		var ResetPasswordController = window.Ember.Controller.extend({
			'actions': {
				'resetPassword': function() {
					window.Ember.$('span#reset-password-alert-message').text('');
					window.Ember.$('div#div-reset-password-alert-message').hide(600);
		
					window.Ember.$('span#reset-password-success-message').text('');
					window.Ember.$('div#div-reset-password-success-message').hide(600);
		
					window.Ember.$('div#div-reset-password-username').removeClass('has-error');
					window.Ember.$('input#input-reset-password-username').attr('disabled', 'disabled');
		
					window.Ember.$('button#button-reset-password').attr('disabled', 'disabled');
		
					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/resetPassword',
			
						'dataType': 'json',
						'data': {
							'username': this.get('resetUsername')
						},
		
						'success': function(data) {
							if(data.status) {
								window.Ember.$('span#reset-password-success-message').text(data.responseText);
								window.Ember.$('div#div-reset-password-success-message').show(600);
		
								window.Ember.$('div#div-reset-password-username').addClass('has-success');
								window.Ember.$('input#input-reset-password-username').removeAttr('disabled');
		
								window.Ember.$('button#button-reset-password').removeAttr('disabled');
							}
							else {
								window.Ember.$('span#reset-password-alert-message').text(data.responseText);
								window.Ember.$('div#div-reset-password-alert-message').show(600);
		
								window.Ember.$('div#div-reset-password-username').addClass('has-error');
								window.Ember.$('input#input-reset-password-username').removeAttr('disabled');
		
								window.Ember.$('button#button-reset-password').removeAttr('disabled');
								window.Ember.$('input#input-reset-password-username').focus();
							}
						},
		
						'error': function(err) {
							window.Ember.$('span#reset-password-alert-message').text(err.responseText);
							window.Ember.$('div#div-reset-password-alert-message').show(600);

							window.Ember.$('div#div-reset-password-username').addClass('has-error');
							window.Ember.$('input#input-reset-password-username').removeAttr('disabled');

							window.Ember.$('button#button-reset-password').removeAttr('disabled');
							window.Ember.$('input#input-reset-password-username').focus();
						}
					});
				}
			}
		});

		exports['default'] = ResetPasswordController;
	}
);
