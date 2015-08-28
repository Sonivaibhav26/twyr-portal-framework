define(
	"twyrPortal/components/logout-form",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/logout-form');

		var LogoutFormComponent = window.Ember.Component.extend({
			'doLogout': function() {
				window.Ember.$.ajax({
					'type': 'GET',
					'url': window.apiServer + 'profiles/doLogout',
					'dataType': 'json',

					'success': function(data) {
						if(!data.status) {
							alert(data);
						}

						window.location.href = '/';
					},

					'error': function(err) {
						alert(err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' ));
						window.location.href = '/';
					}
				});
			},

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = LogoutFormComponent;
	}
);

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

			'changePassword': function() {
				var self = this;

				self.lockChangePasswordForm();
				self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Changing your password...' });

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
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': data.responseText });
						}
						else {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'danger', 'message': data.responseText });
						}
					},

					'error': function(err) {
						self.resetChangePasswordForm();
						self.sendAction('controller-action', 'display-status-message', { 'type': 'danger', 'message': (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )) });
					}
				});
			},

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
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
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': data.responseText });
						}
						else {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'danger', 'message': data.responseText });
						}

						window.Ember.$('img#component-manage-personal-details-img-profile-image').attr('src', 'profile/profileImage');
					},
		
					'error': function(err) {
						self.sendAction('controller-action', 'display-status-message', { 'type': 'danger', 'message': (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )) });
					}
				});
			},

			'cancelPersonalDetails': function() {
				this.resetManagePersonalDetailsForm();
			},

			'savePersonalDetails': function() {
				var self = this;
				self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Saving personal information...' });
				self.lockManagePersonalDetailsForm();

				self.get('model')
				.save()
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': 'Your personal information has been updated' });
				})
				.catch(function(reason) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': self.get('model') });
					self.get('model').rollbackAttributes();
				});
			},

			'deleteAccount': function() {
				var self = this;

				window.Ember.$.confirm({
					'text': 'Are you sure that you want to delete your account?',
					'title': 'Delete Account',

					'confirm': function() {
						self.get('model')
						.destroyRecord()
						.then(function() {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': 'Your personal information has been deleted' });
							window.Ember.run.later(self, function() {
								window.location.href = '/';
							}, 2500);
						})
						.catch(function(reason) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': self.get('model') });
							self.get('model').rollbackAttributes();
						});
					},

					'cancel': function() {
						// Nothing to do...
					}
				});
			},

			'actions': {
				'controller-action': function(action, data) {
					if(this[action]) {
						this[action](data);
					}
					else {
						this.sendAction('controller-action', action, data);
					}
				}
			}
		});

		exports['default'] = ManagePersonalDetailsComponent;
	}
);
