define(
	"twyrPortal/register-account/controller",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/register-account/controller');

		var RegisterAccountController = window.Ember.Controller.extend({
			'resetForm': function() {
				window.Ember.$('span#register-account-alert-message').text('');
				window.Ember.$('div#div-register-account-alert-message').hide(600);
		
				window.Ember.$('span#register-account-success-message').text('');
				window.Ember.$('div#div-register-account-success-message').hide(600);
		
				window.Ember.$('div#div-register-account-username').removeClass('has-error');
				window.Ember.$('div#div-register-account-username').removeClass('has-success');
				window.Ember.$('input#input-register-account-username').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-firstname').removeClass('has-error');
				window.Ember.$('div#div-register-account-firstname').removeClass('has-success');
				window.Ember.$('input#input-register-account-firstname').removeAttr('disabled');
		
				window.Ember.$('div#div-register-account-lastname').removeClass('has-error');
				window.Ember.$('div#div-register-account-firstname').removeClass('has-success');
				window.Ember.$('input#input-register-account-lastname').removeAttr('disabled');
		
				window.Ember.$('button#button-register-account').removeAttr('disabled');
				window.Ember.$('input#input-register-account-username').focus();
			},
		
			'lockForm': function() {
				this.resetForm();
		
				window.Ember.$('input#input-register-account-username').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-firstname').attr('disabled', 'disabled');
				window.Ember.$('input#input-register-account-lastname').attr('disabled', 'disabled');
				window.Ember.$('button#button-register-account').attr('disabled', 'disabled');
			},
		
			'showSuccess': function(message) {
				window.Ember.$('span#register-account-success-message').text(message);
				window.Ember.$('div#div-register-account-success-message').show(600);
			},
		
			'showError': function(message, element) {
				var displayMessages = '';
				Object.keys(message).forEach(function(key) {
					if(!(message[key]).length)
						return;

					for(var idx = 0; idx < message[key].length; idx++) {
						displayMessages += ('<i class="fa fa-ban" style="margin-right:5px;"></i>' + message[key][idx] + '<br />');
					}
				});

				window.Ember.$('span#register-account-alert-message').html(displayMessages);
				window.Ember.$('div#div-register-account-alert-message').show(600);
		
				if(element) {
					window.Ember.$(element).removeClass('has-success');
					window.Ember.$(element).addClass('has-error');
				}
			},
		
			'actions': {
				'registerAccount': function() {
					var self = this,
						formData = {
							'username': self.get('username'),
							'firstname': self.get('firstname'),
							'lastname': self.get('lastname')
						},
						rules = {
							'username': 'required|email',
							'firstname': 'required',
							'lastname': 'required'
						};

					// Client-side Input Data Validations
					var dataInputError = window.Validator.make(formData, rules);
					if(dataInputError.fails()) {
						self.showError(dataInputError.errors.all(), 'div#div-register-account-username');
						window.Ember.run.later(self, self.resetForm, 2500);
						return;
					}
		
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
								self.showError({ 'username': [data.responseText] });
		
							window.Ember.run.later(self, self.resetForm, 7500);
						},
		
						'error': function(err) {
							self.showError({ 'username': [err.responseJSON.responseText] });
							window.Ember.run.later(self, self.resetForm, 7500);
						}
					});
				}
			}
		});

		exports['default'] = RegisterAccountController;
	}
);