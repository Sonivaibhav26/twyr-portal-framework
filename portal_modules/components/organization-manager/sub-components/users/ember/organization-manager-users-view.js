define(
	"twyrPortal/components/organization-manager-users",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-users');

		var OrganizationManagerUsersComponent = window.Ember.Component.extend({
			'isCreating': false,
			'canDeleteUsers': false,

			'didInsertElement': function() {
				var self = this;
				self._super();

				if(!self.get('model'))
					return true;

				self.get('model').store.query('organization-manager-tenant-user', { 'tenant': self.get('model').get('id') })
				.then(function(tenantUsers) {
					self.set('tenantUsers', tenantUsers);

					window.Ember.run.later(self, function() {
						self.get('tenantUsers').forEach(function(tenantUser) {
							if(!tenantUser.get('isNew')) {
								return;
							}
	
							self._initNewTenantUserSelect(tenantUser.get('id'));
						});
					}, 500);
				})
				.catch(function(err) {
					console.error('Error fetching users for ' + self.get('model').get('name') + '\n', err);
				});

				return true;
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				if(!this.get('model')) {
					this.set('tenantUsers', null);
					return;
				}

				var self = this;
				self.get('model').store.query('organization-manager-tenant-user', { 'tenant': self.get('model').get('id') })
				.then(function(tenantUsers) {
					self.set('tenantUsers', tenantUsers);

					window.Ember.run.later(self, function() {
						self.get('tenantUsers').forEach(function(tenantUser) {
							if(!tenantUser.get('isNew')) {
								return;
							}
	
							self._initNewTenantUserSelect(tenantUser.get('id'));
						});
					}, 500);
				})
				.catch(function(err) {
					console.error('Error fetching users for ' + self.get('model').get('name') + '\n', err);
				});
			}),

			'_numUsersChangeReactor': window.Ember.observer('tenantUsers.length', function() {
				var oldUsers = this.get('tenantUsers').filterBy('isNew', false);
				this.set('canDeleteUsers', (oldUsers.get('length') > 1));
			}),

			'_initNewTenantUserSelect': function(tenantUserId) {
				var self = this,
					selectElem = self.$('select#organization-manager-users-tab-select-' + tenantUserId);

				selectElem.select2({
					'ajax': {
						'delay': 250,
						'dataType': 'json',

						'url': window.apiServer + 'masterdata/emails',

						'data': function (params) {
							var queryParameters = {
								'filter': params.term
							}

							return queryParameters;
						},

						'processResults': function (data) {
							var processedResult =  {
								'results': window.Ember.$.map(data, function(item) {
									return {
										'text': item.email,
										'slug': item.email + ' (' + item.name + ')',
										'id': item.id
									};
								})
							};

							return processedResult;
						},

						'cache': true
					},

					'minimumInputLength': 2,
					'minimumResultsForSearch': 10,

					'allowClear': true,
					'closeOnSelect': true,

					'placeholder': 'root@twyrportal.com'
				})
				.on('change', function() {
					var tenantUserId = selectElem.attr('id').replace('organization-manager-users-tab-select-', '');

					self['save-tenant-user']({
						'userId': selectElem.val(),
						'tenantUserId': tenantUserId
					});
				});
			},

			'show-create-user': function() {
				var self = this;

				self.$('div#organization-manager-users-create-user').slideDown(600, function() {
					self.set('isCreating', true);
				});
			},

			'hide-create-user': function() {
				var self = this;

				self.$('div#organization-manager-users-create-user').slideUp(600, function() {
					self.set('isCreating', false);

					self.$('input#organization-manager-users-input-first-name').val('');
					self.$('input#organization-manager-users-input-last-name').val('');
					self.$('input#organization-manager-users-input-email').val('');
				});
			},

			'add-tenant-user': function(tenant) {
				var self = this,
					tenantUserId = app.default.generateUUID();

				var newTenantUser = tenant.store.createRecord('organization-manager-tenant-user', {
					'id': tenantUserId,
					'tenant': tenant
				});

				self.get('tenantUsers').addObject(newTenantUser._internalModel);
				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self._initNewTenantUserSelect(tenantUserId);
				});
			},

			'create-tenant-user': function(tenant) {
				var self = this,
					newUserId = app.default.generateUUID(),
					newUserRelId = app.default.generateUUID();

				var newUserRel = null,
					newUser = self.get('model').store.createRecord('organization-manager-user', {
					'id': newUserId,
					'firstName': self.$('input#organization-manager-users-input-first-name').val(),
					'lastName': self.$('input#organization-manager-users-input-last-name').val(),
					'login': self.$('input#organization-manager-users-input-email').val(),
				});

				self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Creating ' + newUser.get('fullName') + ' record in the database' });
				newUser.save()
				.catch(function(err) {
					throw err;
				})
				.then(function() {
					newUserRel = self.get('model').store.createRecord('organization-manager-tenant-user', {
						'id': newUserRelId,
						'tenant': tenant,
						'user': newUser
					});

					self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Adding ' + newUser.get('fullName') + ' to ' + tenant.get('name') + ' Organization' });
					return newUserRel.save();
				})
				.then(function() {
					self.get('tenantUsers').addObject(newUserRel._internalModel);
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': newUser.get('fullName') + ' has been added to the ' + tenant.get('name') + ' Organization' });

					window.Ember.run.scheduleOnce('afterRender', self, function() {
						self['hide-create-user']();
					});
				})
				.catch(function(err) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': (newUserRel ? newUserRel : newUser) });
					newUser.rollbackAttributes();

					if(newUserRel) {
						self.get('tenantUsers').removeObject(newUserRel._internalModel);
						newUserRel.rollbackAttributes();
					}
				});
			},

			'save-tenant-user': function(data) {
				var tenantUser = this.get('model').store.peekRecord('organization-manager-tenant-user', data.tenantUserId),
					self = this;

				this.get('model').store.find('organization-manager-user', data.userId)
				.then(function(user) {
					tenantUser.set('user', user);
					return tenantUser.save();
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': tenantUser.get('user').get('fullName') + ' has been added to the ' + tenantUser.get('tenant').get('name') + ' organization' });
				})
				.catch(function(reason) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantUser });
					self.get('tenantUsers').removeObject(tenantUser);
				});
			},

			'delete-tenant-user': function(tenantUser) {
				var self = this,
					tenant = tenantUser.get('tenant'),
					userName = (tenantUser.get('user').get('id') ? tenantUser.get('user').get('fullName'): 'New User'),
					delFn = function() {
						tenantUser
						.destroyRecord()
						.then(function() {
							self.get('tenantUsers').removeObject(tenantUser);
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': userName + ' has been removed from the ' + tenant.get('name') + ' organization' });
						})
						.catch(function(err) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantUser });
							tenantUser.rollbackAttributes();
						});
					};

				if(tenantUser.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to remove <strong>"' + userName + '"</strong> from the ' + tenant.get('name') + ' organization?',
						'title': 'Delete <strong>' + userName + '</strong>?',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
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

		exports['default'] = OrganizationManagerUsersComponent;
	}
);
