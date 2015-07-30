define(
	"twyrPortal/components/login-form",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/login-form');
		var LoginFormComponent = window.Ember.Component.extend({
			'_initialize': function() {
				var self = this;
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.resetAllForms();

					window.Ember.$('input#login-input-username').on('input', function(e) {
						var username = window.Ember.$('input#login-input-username').val().trim();
						if(username != '') {
							window.Ember.$('button#login-button-submit').addClass('btn-primary');
							window.Ember.$('button#login-button-submit').removeAttr('disabled', 'disabled');
						}
						else {
							window.Ember.$('button#login-button-submit').removeClass('btn-primary');
							window.Ember.$('button#login-button-submit').attr('disabled');
						}
					});

					window.Ember.$('input#reset-password-input-username').on('input', function(e) {
						var username = window.Ember.$('input#reset-password-input-username').val().trim();
						if(username != '') {
							window.Ember.$('button#reset-password-button-submit').addClass('btn-primary');
							window.Ember.$('button#reset-password-button-submit').removeAttr('disabled', 'disabled');
						}
						else {
							window.Ember.$('button#reset-password-button-submit').removeClass('btn-primary');
							window.Ember.$('button#reset-password-button-submit').attr('disabled');
						}
					});

					window.Ember.$('div#div-box-body-register-account input.form-control').on('input', function(e) {
						var username = window.Ember.$('input#register-account-input-username').val().trim(),
							firstname = window.Ember.$('input#register-account-input-firstname').val().trim(),
							lastname = window.Ember.$('input#register-account-input-lastname').val().trim();

						if((username != '') && (firstname != '') && (lastname != '')) {
							window.Ember.$('button#register-account-button-submit').addClass('btn-primary');
							window.Ember.$('button#register-account-button-submit').removeAttr('disabled', 'disabled');
						}
						else {
							window.Ember.$('button#register-account-button-submit').removeClass('btn-primary');
							window.Ember.$('button#register-account-button-submit').attr('disabled');
						}
					});
				});
			}.on('init'),

			'resetAllForms': function() {
				this.resetLoginForm();
				this.resetForgotPasswordForm();
				this.resetRegisterAccountForm();
				this.resetStatusMessages();
			},

			'lockAllForms': function() {
				this.lockLoginForm();
				this.lockForgotPasswordForm();
				this.lockRegisterAccountForm();
			},

			'resetLoginForm': function() {
				this.resetStatusMessages();
				this.lockLoginForm();

				window.Ember.$('input#login-input-username').val('');
				window.Ember.$('input#login-input-password').val('');
			},

			'lockLoginForm': function() {
				window.Ember.$('button#login-button-submit').removeClass('btn-primary');
				window.Ember.$('button#login-button-submit').attr('disabled', 'disabled');
			},

			'resetForgotPasswordForm': function() {
				this.resetStatusMessages();
				this.lockForgotPasswordForm();

				window.Ember.$('input#reset-password-input-username').val('');
			},

			'lockForgotPasswordForm': function() {
				window.Ember.$('button#reset-password-button-submit').removeClass('btn-primary');
				window.Ember.$('button#reset-password-button-submit').attr('disabled', 'disabled');
			},

			'resetRegisterAccountForm': function() {
				this.resetStatusMessages();
				this.lockRegisterAccountForm();

				window.Ember.$('input#register-account-input-username').val('');
				window.Ember.$('input#register-account-input-firstname').val('');
				window.Ember.$('input#register-account-input-lastname').val('');
			},

			'lockRegisterAccountForm': function() {
				window.Ember.$('button#register-account-button-submit').removeClass('btn-primary');
				window.Ember.$('button#register-account-button-submit').attr('disabled', 'disabled');
			},

			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-login-component-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#login-component-alert-message').text('');

				window.Ember.$('div#div-login-component-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#login-component-progress-message').text('');

				window.Ember.$('div#div-login-component-success-message').slideUp(timeout || 600);
				window.Ember.$('span#login-component-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('span#login-component-' + statusMessageType + '-message').html(messageText);
				window.Ember.$('div#div-login-component-' + statusMessageType + '-message').slideDown(600);
			},

			'actions': {
				'showLoginForm': function() {
					window.Ember.$('div#div-box-body-register-account').slideUp(600);
					window.Ember.$('div#div-box-body-reset-password').slideUp(600);

					this.resetLoginForm();
					window.Ember.$('div#div-box-body-login').slideDown(600);
				},

				'showResetPasswordForm': function() {
					window.Ember.$('div#div-box-body-login').slideUp(600);
					window.Ember.$('div#div-box-body-register-account').slideUp(600);

					this.resetForgotPasswordForm();
					window.Ember.$('div#div-box-body-reset-password').slideDown(600);
				},

				'showNewAccountForm': function() {
					window.Ember.$('div#div-box-body-login').slideUp(600);
					window.Ember.$('div#div-box-body-reset-password').slideUp(600);

					this.resetRegisterAccountForm();
					window.Ember.$('div#div-box-body-register-account').slideDown(600);
				},

				'doLogin': function() {
					var self = this;

					self.lockLoginForm();
					self.showStatusMessage('progress', 'Logging you in...');

					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/doLogin',
				
						'dataType': 'json',
						'data': {
							'username': this.get('username'),
							'password': this.get('password')
						},
				
						'success': function(data) {
							if(data.status) {
								self.showStatusMessage('success', data.responseText);

								window.Ember.run.later(self, function() {
									self.resetLoginForm();
									window.location.href = '/';
								}, 1000);
							}
							else {
								self.resetLoginForm();
								self.showStatusMessage('alert', data.responseText);

								window.Ember.run.later(self, function() {
									self.resetStatusMessages();
								}, 5000);
							}
						},
				
						'error': function(err) {
							self.resetLoginForm();
							self.showStatusMessage('alert', (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )));

							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						}
					});
				},

				'doSocialLogin': function(socialNetwork) {
					var currentLocation = window.location.href;
					window.location.href = window.apiServer + 'profiles/' + socialNetwork + '?currentLocation=' + currentLocation;
				},

				'resetPassword': function() {
					var self = this;

					self.lockForgotPasswordForm();
					self.showStatusMessage('progress', 'Resetting your password...');

					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/resetPassword',
			
						'dataType': 'json',
						'data': {
							'username': this.get('resetUsername')
						},
		
						'success': function(data) {
							if(data.status) {
								self.showStatusMessage('success', data.responseText);

								window.Ember.run.later(self, function() {
									self.resetForgotPasswordForm();
									self.resetStatusMessages();
								}, 5000);
							}
							else {
								self.resetForgotPasswordForm();
								self.showStatusMessage('alert', data.responseText);

								window.Ember.run.later(self, function() {
									self.resetStatusMessages();
								}, 5000);
							}
						},
				
						'error': function(err) {
							console.error(err);

							self.resetForgotPasswordForm();
							self.showStatusMessage('alert', (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )));

							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						}
					});
				},

				'registerAccount': function() {
					var self = this;

					self.lockRegisterAccountForm();
					self.showStatusMessage('progress', 'Creating your account...');

					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/registerAccount',
			
						'dataType': 'json',
						'data': {
							'username': self.get('registerUsername'),
							'firstname': self.get('registerFirstname'),
							'lastname': self.get('registerLastname')
						},
		
						'success': function(data) {
							if(data.status) {
								self.showStatusMessage('success', data.responseText);

								window.Ember.run.later(self, function() {
									self.resetRegisterAccountForm();
									self.resetStatusMessages();
								}, 5000);
							}
							else {
								self.resetRegisterAccountForm();
								self.showStatusMessage('alert', data.responseText);

								window.Ember.run.later(self, function() {
									self.resetStatusMessages();
								}, 5000);
							}
						},
				
						'error': function(err) {
							self.resetRegisterAccountForm();
							self.showStatusMessage('alert', (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )));

							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						}
					});
				}
			}
		});

		exports['default'] = LoginFormComponent;
	}
);
