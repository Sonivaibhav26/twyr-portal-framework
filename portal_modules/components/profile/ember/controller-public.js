/*
 * Name			: portal_modules/components/profile/ember/controller-public.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Profile Manager Component Public Ember Controller
 *
 */

<script type="text/javascript">

Portal.ResetPasswordRoute = Ember.Route.extend({
	'model': function() {
		return { 'resetUsername': '' };
	}
});

Portal.ResetPasswordController = Ember.ObjectController.extend({
	'actions': {
		'resetPassword': function() {
			console.log('Resetting password for: ' + this.get('resetUsername'));

			$('span#reset-password-alert-message').text('');
			$('div#div-reset-password-alert-message').css('display', 'none');

			$('span#reset-password-success-message').text('');
			$('div#div-reset-password-success-message').css('display', 'none');

			$('div#div-reset-password-username').removeClass('has-error');
			$('input#input-reset-password-username').attr('disabled', 'disabled');

			$('button#button-reset-password').attr('disabled', 'disabled');

			$.ajax({
				'type': 'POST',
				'url': window.apiServer + 'profiles/resetPassword',
	
				'dataType': 'json',
				'data': {
					'username': this.get('resetUsername')
				},

				'success': function(data) {
					console.log('resetPassword returned: ', data);

					if(data.status) {
						$('span#reset-password-success-message').text(data.responseText);
						$('div#div-reset-password-success-message').css('display', 'block');

						$('div#div-reset-password-username').addClass('has-success');
						$('input#input-reset-password-username').removeAttr('disabled');

						$('button#button-reset-password').removeAttr('disabled');
					}
					else {
						$('span#reset-password-alert-message').text(data.responseText);
						$('div#div-reset-password-alert-message').css('display', 'block');

						$('div#div-reset-password-username').addClass('has-error');
						$('input#input-reset-password-username').removeAttr('disabled');

						$('button#button-reset-password').removeAttr('disabled');
						$('input#input-reset-password-username').focus();
					}
				},

				'error': function(err) {
					console.error('resetPassword returned: ', err);

					$('span#reset-password-alert-message').text(err.responseText);
					$('div#div-reset-password-alert-message').css('display', 'block');

						$('div#div-reset-password-username').addClass('has-error');
						$('input#input-reset-password-username').removeAttr('disabled');

						$('button#button-reset-password').removeAttr('disabled');
						$('input#input-reset-password-username').focus();
				}
			});
		}
	}
});

Portal.RegisterAccountRoute = Ember.Route.extend({
	'model': function() {
		return {
			'username': '',

			'salutation': '',
			'firstname': '',
			'middlenames': '',
			'lastname': '',
			'suffix': ''
		};
	}
});
Portal.RegisterAccountController = Ember.ObjectController.extend({
	'resetForm': function() {
		$('span#register-account-alert-message').text('');
		$('div#div-register-account-alert-message').css('display', 'none');

		$('span#register-account-success-message').text('');
		$('div#div-register-account-success-message').css('display', 'none');

		$('div#div-register-account-username').removeClass('has-error');
		$('div#div-register-account-username').removeClass('has-success');
		$('input#input-register-account-username').removeAttr('disabled');

		$('div#div-register-account-salutation').removeClass('has-error');
		$('div#div-register-account-salutation').removeClass('has-success');
		$('input#input-register-account-salutation').removeAttr('disabled');

		$('div#div-register-account-firstname').removeClass('has-error');
		$('div#div-register-account-firstname').removeClass('has-success');
		$('input#input-register-account-firstname').removeAttr('disabled');

		$('div#div-register-account-middlenames').removeClass('has-error');
		$('div#div-register-account-firstname').removeClass('has-success');
		$('input#input-register-account-middlenames').removeAttr('disabled');

		$('div#div-register-account-lastname').removeClass('has-error');
		$('div#div-register-account-firstname').removeClass('has-success');
		$('input#input-register-account-lastname').removeAttr('disabled');

		$('div#div-register-account-suffix').removeClass('has-error');
		$('div#div-register-account-firstname').removeClass('has-success');
		$('input#input-register-account-suffix').removeAttr('disabled');

		$('button#button-register-account').removeAttr('disabled');
		$('input#input-register-account-username').focus();
	},

	'lockForm': function() {
		this.resetForm();

		$('input#input-register-account-username').attr('disabled', 'disabled');
		$('input#input-register-account-salutation').attr('disabled', 'disabled');
		$('input#input-register-account-firstname').attr('disabled', 'disabled');
		$('input#input-register-account-middlenames').attr('disabled', 'disabled');
		$('input#input-register-account-lastname').attr('disabled', 'disabled');
		$('input#input-register-account-suffix').attr('disabled', 'disabled');
		$('button#button-register-account').attr('disabled', 'disabled');
	},

	'showSuccess': function(message) {
		$('span#register-account-success-message').text(message);
		$('div#div-register-account-success-message').css('display', 'block');
	},

	'showError': function(message, element) {
		$('span#register-account-alert-message').text(message);
		$('div#div-register-account-alert-message').css('display', 'block');

		if(element) {
			$(element).removeClass('has-success');
			$(element).addClass('has-error');
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
			$.ajax({
				'type': 'POST',
				'url': window.apiServer + 'profiles/registerAccount',
	
				'dataType': 'json',
				'data': formData,

				'success': function(data) {
					if(data.status)
						self.showSuccess(data.responseText);
					else
						self.showError(data.responseText);

					Ember.run.later(self, self.resetForm, 7500);
				},

				'error': function(err) {
					self.showError(err.responseJSON.responseText);
					Ember.run.later(self, self.resetForm, 7500);
				}
			});
		}
	}
});
</script>

