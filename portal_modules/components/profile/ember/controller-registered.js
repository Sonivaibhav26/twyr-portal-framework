/*
 * Name			: portal_modules/components/profile/ember/controller-registered.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Profile Manager Component Registered Ember Controller
 *
 */

<script type="text/javascript">

Portal.ManageProfileRoute = Ember.Route.extend({
	'model': function() {
		return this.store.find('profile', window.userId);
	},

	'setupController': function(controller, model) {
		controller.set('model', model);
	}
});

Portal.ManageProfileController = Ember.Controller.extend({
	'actions': {
		'saveChanges': function() {
			$('#div-manage-profile-alert-message').hide(600);
			$('#div-manage-profile-success-message').hide(600);
			$('#div-manage-profile-failed-message').hide(600);

			$('#div-portal-main-area input').attr('disabled', 'disabled')
			$('#div-portal-main-area button').attr('disabled', 'disabled')

			var self = this;
			this.model.save()
			.then(function() {
				$('#manage-profile-success-message').text('Saved Profile Successfully');
				$('#div-manage-profile-success-message').show(600);

				$('#div-portal-main-area input').removeAttr('disabled')
				$('#div-portal-main-area button').removeAttr('disabled')

				Ember.run.later(self, function() {
					$('#div-manage-profile-success-message').hide(600);
				}, 10000);

			}, function(response) {
				$('#div-manage-profile-failed-message').show(600);

				$('#div-portal-main-area input').removeAttr('disabled')
				$('#div-portal-main-area button').removeAttr('disabled')

				Ember.run.later(self, function() {
					$('#div-manage-profile-failed-message').hide(600);
				}, 10000);
			});
		},

		'cancelChanges': function() {
			this.model.rollback();
		},

		'link': function(socialNetwork) {
			var currentLocation = window.location.href;
			window.location.href = window.apiServer + 'login/' + socialNetwork + '?currentLocation=' + currentLocation;
		},

		'unlink': function(socialNetwork) {
			$('#div-manage-profile-alert-message').hide(600);
			$('#div-manage-profile-success-message').hide(600);
			$('#div-manage-profile-failed-message').hide(600);

			$.ajax({
				'type': 'POST',
				'url': window.apiServer + 'profiles/unlink/' + socialNetwork,

				'success': function(data) {
					if(data.status) {
						$('#manage-social-success-message').text(data.responseText);
						$('#div-manage-social-success-message').show(600);

						Ember.run.later(self, function() {
							$('#div-manage-social-success-message').hide(600);
							window.location.reload();
						}, 3000);
					}
					else {
						$('span#manage-social-alert-message').text(data.responseText);
						$('#div-manage-social-alert-message').show(600);

						Ember.run.later(self, function() {
							$('#div-manage-social-alert-message').hide(600);
						}, 10000);
					}
				},

				'error': function(err) {
					console.error('unlink returned: ', err);

					$('span#manage-social-alert-message').text(err.responseText);
					$('#div-manage-social-alert-message').show(600);

					Ember.run.later(self, function() {
						$('#div-manage-social-alert-message').hide(600);
					}, 10000);
				}
			});
		}
	}
});	

</script>
