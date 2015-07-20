define(
	"twyrPortal/register-account/controller",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/register-account/controller');

		var RegisterAccountController = window.Ember.Controller.extend({
			'resetForm': function() {
				window.Ember.$('span#register-account-alert-message').text('');
				window.Ember.$('div#div-register-account-alert-message').css('display', 'none');
		
				window.Ember.$('span#register-account-success-message').text('');
				window.Ember.$('div#div-register-account-success-message').css('display', 'none');
		
				window.Ember.$('div#div-register-account-username').removeClass('has-error');
				window.Ember.$('div#div-register-account-username').removeClass('has-success');
				window.Ember.$('input#input-register-account-username').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-salutation').removeClass('has-error');
				window.Ember.$('div#div-register-account-salutation').removeClass('has-success');
				window.Ember.$('input#input-register-account-salutation').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-firstname').removeClass('has-error');
				window.Ember.$('div#div-register-account-firstname').removeClass('has-success');
				window.Ember.$('input#input-register-account-firstname').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-middlenames').removeClass('has-error');
				window.Ember.$('div#div-register-account-firstname').removeClass('has-success');
				window.Ember.$('input#input-register-account-middlenames').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-lastname').removeClass('has-error');
				window.Ember.$('div#div-register-account-firstname').removeClass('has-success');
				window.Ember.$('input#input-register-account-lastname').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-suffix').removeClass('has-error');
				window.Ember.$('div#div-register-account-firstname').removeClass('has-success');
				window.Ember.$('input#input-register-account-suffix').removeAttr('disabled');
		
				window.Ember.$('button#button-register-account').removeAttr('disabled');
				window.Ember.$('input#input-register-account-username').focus();
			},
		
			'lockForm': function() {
				this.resetForm();
		
				window.Ember.$('input#input-register-account-username').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-salutation').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-firstname').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-middlenames').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-lastname').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-suffix').attr('disabled', 'disabled');
				window.Ember.$('button#button-register-account').attr('disabled', 'disabled');
			},
		
			'showSuccess': function(message) {
				window.Ember.$('span#register-account-success-message').text(message);
				window.Ember.$('div#div-register-account-success-message').css('display', 'block');
			},
		
			'showError': function(message, element) {
				window.Ember.$('span#register-account-alert-message').text(message);
				window.Ember.$('div#div-register-account-alert-message').css('display', 'block');
		
				if(element) {
					window.Ember.$(element).removeClass('has-success');
					window.Ember.$(element).addClass('has-error');
				}
			},
		
			'actions': {
				'registerAccount': function() {
					var self = this;
					var formData = {
						'username': self.get('username'),
		
						'salutation': self.get('salutation'),
						'firstname': self.get('firstname'),
						'middlenames': self.get('middlenames'),
						'lastname': self.get('lastname'),
						'suffix': self.get('suffix')
					};
		
					// Client-side Input Data Validations
					var dataInputError = false;
					if(formData.username.trim() == '') {
						self.showError('Please fill in the required fields before submitting', 'div#div-register-account-username');
						dataInputError = true;
					}
		
					if(formData.firstname.trim() == '') {
						self.showError('Please fill in the required fields before submitting', 'div#div-register-account-firstname');
						dataInputError = true;
					}
		
					if(formData.lastname.trim() == '') {
						self.showError('Please fill in the required fields before submitting', 'div#div-register-account-lastname');
						dataInputError = true;
					}
		
					if(dataInputError)
						return;
		
					self.lockForm();
					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/registerAccount',
			
						'dataType': 'json',
						'data': formData,
		
						'success': function(data) {
							if(data.status)
								self.showSuccess(data.responseText);
							else
								self.showError(data.responseText);
		
							window.Ember.run.later(self, self.resetForm, 7500);
						},
		
						'error': function(err) {
							self.showError(err.responseJSON.responseText);
							window.Ember.run.later(self, self.resetForm, 7500);
						}
					});
				}
			}
		});

		exports['default'] = RegisterAccountController;
	}
);