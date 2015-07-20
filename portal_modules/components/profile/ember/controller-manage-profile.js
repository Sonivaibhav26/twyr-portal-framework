define(
	"twyrPortal/profile/model",
	["exports"],
	function(exports) {
		var ProfileModel = window.DS.Model.extend({
			'salutation': window.DS.attr('string'),
			'firstname': window.DS.attr('string'),
			'middlenames': window.DS.attr('string'),
			'lastname': window.DS.attr('string'),
			'suffix': window.DS.attr('string'),
			'username': window.DS.attr('string'),
			'password1': window.DS.attr('string'),
			'password2': window.DS.attr('string'),
			'createdon': window.DS.attr('date')
		});

		exports['default'] = ProfileModel;
	}
);

define(
	"twyrPortal/profile/controller",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/profile/controller');

		var ProfileController = window.Ember.Controller.extend({
			'actions': {
				'saveChanges': function() {
					window.Ember.$('#div-manage-profile-alert-message').hide(600);
					window.Ember.$('#div-manage-profile-success-message').hide(600);
					window.Ember.$('#div-manage-profile-failed-message').hide(600);
		
					window.Ember.$('#div-portal-main-area input').attr('disabled', 'disabled')
					window.Ember.$('#div-portal-main-area button').attr('disabled', 'disabled')
		
					var self = this;
					this.model.save()
					.then(function() {
						window.Ember.$('#manage-profile-success-message').text('Saved Profile Successfully');
						window.Ember.$('#div-manage-profile-success-message').show(600);
		
						window.Ember.$('#div-portal-main-area input').removeAttr('disabled')
						window.Ember.$('#div-portal-main-area button').removeAttr('disabled')
		
						window.Ember.run.later(self, function() {
							window.Ember.$('#div-manage-profile-success-message').hide(600);
						}, 10000);
		
					}, function(response) {
						window.Ember.$('#div-manage-profile-failed-message').show(600);
		
						window.Ember.$('#div-portal-main-area input').removeAttr('disabled')
						window.Ember.$('#div-portal-main-area button').removeAttr('disabled')
		
						window.Ember.run.later(self, function() {
							window.Ember.$('#div-manage-profile-failed-message').hide(600);
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
					window.Ember.$('#div-manage-profile-alert-message').hide(600);
					window.Ember.$('#div-manage-profile-success-message').hide(600);
					window.Ember.$('#div-manage-profile-failed-message').hide(600);
		
					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/unlink/' + socialNetwork,
		
						'success': function(data) {
							if(data.status) {
								window.Ember.$('#manage-social-success-message').text(data.responseText);
								window.Ember.$('#div-manage-social-success-message').show(600);
		
								window.Ember.run.later(self, function() {
									window.Ember.$('#div-manage-social-success-message').hide(600);
									window.location.reload();
								}, 3000);
							}
							else {
								window.Ember.$('span#manage-social-alert-message').text(data.responseText);
								window.Ember.$('#div-manage-social-alert-message').show(600);
		
								window.Ember.run.later(self, function() {
									window.Ember.$('#div-manage-social-alert-message').hide(600);
								}, 10000);
							}
						},
		
						'error': function(err) {
							console.error('unlink returned: ', err);
		
							window.Ember.$('span#manage-social-alert-message').text(err.responseText);
							window.Ember.$('#div-manage-social-alert-message').show(600);
		
							window.Ember.run.later(self, function() {
								window.Ember.$('#div-manage-social-alert-message').hide(600);
							}, 10000);
						}
					});
				}
			}
		});

		exports['default'] = ProfileController;
	}
);