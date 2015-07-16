/*
 * Name			: portal_modules/components/login/ember/controller-public.ejs
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Login Component Public Ember Controller
 *
 */

<script type="text/javascript">
Portal.LoginFormComponent = Ember.Component.extend({
	'actions': {
		'doLogin': function() {
			$('span#alert-message').text('');
			$('div#div-alert-message').css('display', 'none');

			$('div#div-input-username').removeClass('has-error');
			$('div#div-input-password').removeClass('has-error');

			$('input#input-username').attr('disabled', 'disabled');
			$('input#input-password').attr('disabled', 'disabled');
			$('button#button-login').attr('disabled', 'disabled');

			$.ajax({
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
						$('span#success-message').text(data.responseText);
						$('div#div-success-message').css('display', 'block');

						$('div#div-input-username').addClass('has-success');
						$('div#div-input-password').addClass('has-success');

						setTimeout(function() {
							window.location.href = '/';
						}, 500);
					}
					else {
						$('span#alert-message').text(data.responseText);
						$('div#div-alert-message').css('display', 'block');

						$('div#div-input-username').addClass('has-error');
						$('div#div-input-password').addClass('has-error');

						$('input#input-username').removeAttr('disabled');
						$('input#input-password').removeAttr('disabled');
						$('button#button-login').removeAttr('disabled');

						$('input#input-username').focus();
					}
				},

				'error': function(err) {
					console.error('doLogin returned: ', err);

					$('span#alert-message').text(err.responseText);
					$('div#div-alert-message').css('display', 'block');

					$('div#div-input-username').addClass('has-error');
					$('div#div-input-password').addClass('has-error');

					$('input#input-username').removeAttr('disabled');
					$('input#input-password').removeAttr('disabled');
					$('button#button-login').removeAttr('disabled');

					$('input#input-username').focus();
				}
			});
		},

		'doSocialLogin': function(socialNetwork) {
			console.log('doSocialLogin called for: ' + socialNetwork);
			var currentLocation = window.location.href;
			window.location.href = window.apiServer + 'login/' + socialNetwork + '?currentLocation=' + currentLocation;
		}
	}
});
</script>

