define(
	"twyrPortal/components/change-password",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/change-password');

		var ChangePasswordComponent = window.Ember.Component.extend({
			'_initialize': function() {
				var self = this;
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.resetChangePasswordForm();

					window.Ember.$('div#div-box-body-component-change-password input.form-control').on('input', function(e) {
						var currentPassword = window.Ember.$('input#component-change-password-input-current-password').val().trim(),
							newPassword1 = window.Ember.$('input#component-change-password-input-new-password-1').val().trim(),
							newPassword2 = window.Ember.$('input#component-change-password-input-new-password-2').val().trim();
	
						if((currentPassword != '') && (newPassword1 != '') && (newPassword2 != '') && (newPassword1 == newPassword2)) {
							window.Ember.$('button#component-change-password-button-submit').addClass('btn-primary');
							window.Ember.$('button#component-change-password-button-submit').removeAttr('disabled', 'disabled');
						}
						else {
							window.Ember.$('button#component-change-password-button-submit').removeClass('btn-primary');
							window.Ember.$('button#component-change-password-button-submit').attr('disabled');
						}
					});
				});
			}.on('init'),

			'resetChangePasswordForm': function() {
				this.lockChangePasswordForm();

				window.Ember.$('input#component-change-password-input-current-password').val('');
				window.Ember.$('input#component-change-password-input-new-password-1').val('');
				window.Ember.$('input#component-change-password-input-new-password-2').val('');
			},

			'lockChangePasswordForm': function() {
				window.Ember.$('button#component-change-password-button-submit').removeClass('btn-primary');
				window.Ember.$('button#component-change-password-button-submit').attr('disabled', 'disabled');
			},

			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-profile-component-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#profile-component-alert-message').text('');

				window.Ember.$('div#div-profile-component-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#profile-component-progress-message').text('');

				window.Ember.$('div#div-profile-component-success-message').slideUp(timeout || 600);
				window.Ember.$('span#profile-component-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('span#profile-component-' + statusMessageType + '-message').html(messageText);
				window.Ember.$('div#div-profile-component-' + statusMessageType + '-message').slideDown(600);
			},

			'actions': {
				'changePassword': function() {
					var self = this;

					self.lockChangePasswordForm();
					self.showStatusMessage('progress', 'Changing your password...');

					window.Ember.$.ajax({
						'type': 'POST',
						'url': window.apiServer + 'profiles/changePassword',

						'dataType': 'json',
						'data': {
							'currentPassword': self.currentPassword,
							'newPassword1': self.newPassword1,
							'newPassword2': self.newPassword2
						},

						'success': function(data) {
							if(data.status) {
								self.showStatusMessage('success', data.responseText);
							}
							else {
								self.showStatusMessage('alert', data.responseText);
							}

							window.Ember.run.later(self, function() {
								self.resetChangePasswordForm();
								self.resetStatusMessages();
							}, 5000);
						},

						'error': function(err) {
							self.resetChangePasswordForm();
							self.showStatusMessage('alert', (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )));

							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						}
					});
				}
			}
		});

		exports['default'] = ChangePasswordComponent;
	}
);

define(
	"twyrPortal/components/manage-personal-details",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/manage-personal-details');

		var ManagePersonalDetailsComponent = window.Ember.Component.extend({
			'_initialize': function() {
				var self = this;
				self.resetManagePersonalDetailsForm();

				window.Ember.run.scheduleOnce('afterRender', function() {
					var genderSelectElem = window.Ember.$('select#component-manage-personal-details-select-gender');

					window.Ember.$('div#component-manage-personal-details-div-image-drop').on('dragover', function(e) {
						e.stopPropagation();
						e.preventDefault();
						return false;
					});
	
					window.Ember.$('div#component-manage-personal-details-div-image-drop').on('dragenter', function(e) {
						e.stopPropagation();
						e.preventDefault();
						return false;
					});
	
					window.Ember.$('div#component-manage-personal-details-div-image-drop').on('drop', function(e) {
						e.stopPropagation();
						e.preventDefault();
	
						var file = e.dataTransfer.files[0],
							reader = new FileReader();
	
						reader.addEventListener('loadend', function(e) {
							window.Ember.$('img#component-manage-personal-details-img-profile-image').attr('src', e.target.result);
							self.set('profileImage', {
								'fileName': file.name,
								'image': e.target.result
							});

							self.storeImage();
						});
	
						reader.readAsDataURL(file);
						return false;
					});

					window.Ember.$('div#div-box-body-component-manage-personal-details input.form-control').on('input', function(e) {
						var firstName = window.Ember.$('input#component-manage-personal-details-input-first-name').val().trim(),
							lastName = window.Ember.$('input#component-manage-personal-details-input-last-name').val().trim();
	
						if((firstName != '') && (lastName != '')) {
							window.Ember.$('button#component-manage-personal-details-button-submit').addClass('btn-primary');
							window.Ember.$('button#component-manage-personal-details-button-submit').removeAttr('disabled', 'disabled');
						}
						else {
							window.Ember.$('button#component-manage-personal-details-button-submit').removeClass('btn-primary');
							window.Ember.$('button#component-manage-personal-details-button-submit').attr('disabled');
						}
					});

					genderSelectElem.select2({
						'ajax': {
							'url': window.apiServer + 'masterdata/genders',
							'dataType': 'json',
		
							'processResults': function (data) {
								return  {
									'results': window.Ember.$.map(data, function(item) {
										return {
											'text': item,
											'slug': item,
											'id': item
										};
									})
								};
							},

							'cache': true
						},
			
						'minimumInputLength': 0,
						'minimumResultsForSearch': 10,

						'allowClear': true,
						'closeOnSelect': true,

						'placeholder': 'Gender'
					})
					.on('change', function() {
						self.get('model').set('sex', genderSelectElem.val());
					});

					window.Ember.$('input#component-manage-personal-details-input-dob').datepicker({
						'format': 'dd M yyyy',
						'startDate': '01 Jan 1900',
						'endDate': '0d',
						'clearBtn': true,
						'autoClose': true
					});

					window.Ember.$
					.ajax({
						'url': window.apiServer + 'masterdata/genders',
						'dataType': 'json',
						'cache': true
					})
					.done(function(data) {
						window.Ember.$.each(data, function(index, item) {
							var thisOption = new Option(item, item, false, false);
							genderSelectElem.append(thisOption);
						});

						genderSelectElem.val(self.get('model').get('sex')).trigger('change');
					})
					.fail(function() {
						console.error(window.apiServer + 'masterdata/genders error:\n', arguments);
					});
				});
			}.on('init'),

			'resetManagePersonalDetailsForm': function() {
				this.lockManagePersonalDetailsForm();

				window.Ember.$('img#component-manage-personal-details-img-profile-image').attr('src', 'profile/profileImage');
				this.get('model').rollbackAttributes();
			},

			'lockManagePersonalDetailsForm': function() {
				window.Ember.$('button#component-manage-personal-details-button-submit').removeClass('btn-primary');
				window.Ember.$('button#component-manage-personal-details-button-submit').attr('disabled', 'disabled');
			},

			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-profile-component-failure-message').slideUp(timeout || 600);

				window.Ember.$('div#div-profile-component-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#profile-component-alert-message').text('');

				window.Ember.$('div#div-profile-component-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#profile-component-progress-message').text('');

				window.Ember.$('div#div-profile-component-success-message').slideUp(timeout || 600);
				window.Ember.$('span#profile-component-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('div#div-profile-component-' + statusMessageType + '-message').slideDown(600);
				if(statusMessageType != 'failure') {
					window.Ember.$('span#profile-component-' + statusMessageType + '-message').html(messageText);
				}
			},

			'storeImage': function() {
				var self = this;
				if(!self.get('profileImage'))
					return;

				window.Ember.$.ajax({
					'type': 'PUT',
					'url': 'profile/profileImage',
		
					'dataType': 'json',
					'data': self.get('profileImage'),
		
					'success': function(data) {
						if(data.status) {
							self.showStatusMessage('success', data.responseText);
						}
						else {
							self.showStatusMessage('alert', data.responseText);
						}

						window.Ember.$('img#component-manage-personal-details-img-profile-image').attr('src', 'profile/profileImage');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					},
		
					'error': function(err) {
						self.showStatusMessage('alert', (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )));

						window.Ember.$('img#component-manage-personal-details-img-profile-image').attr('src', 'profile/profileImage');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					}
				});
			},

			'actions': {
				'cancelPersonalDetails': function() {
					this.resetManagePersonalDetailsForm();
				},

				'savePersonalDetails': function() {
					var self = this;
	
					self.lockManagePersonalDetailsForm();
					self.showStatusMessage('progress', 'Saving personal information...');
	
					self.get('model')
					.save()
					.then(function() {
						self.showStatusMessage('success', 'Your personal information has been updated');
						console.log('savePersonalDetails::success: ', arguments);
	
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					})
					.catch(function(reason) {
						console.error('savePersonalDetails::error: ', reason);
	
						self.showStatusMessage('failure');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();

							self.get('model').rollbackAttributes();
							self.get('model').transitionTo('loaded.saved');
						}, 5000);
					});
				}
			}
		});

		exports['default'] = ManagePersonalDetailsComponent;
	}
);
