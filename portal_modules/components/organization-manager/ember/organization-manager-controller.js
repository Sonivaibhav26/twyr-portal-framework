define(
	"twyrPortal/controllers/organization-manager",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager');

		var OrganizationManagerController = window.Ember.Controller.extend({
			'selected-org-changed': function(data) {
				var self = this;

				this.get('model').store.findRecord('organization-manager', data.id)
				.then(function(organizationData) {
					self.set('currentModel', organizationData);
				})
				.catch(function(err) {
					console.error(err);
				});
			},

			'add-subsidiary': function(organization) {
				var newSubsidiary = this.get('model').store.createRecord('organization-manager', {
					'id': app.default.generateUUID(),
					'name': 'New Subsidiary',
					'parent': organization,
					'tenantType': 'Organization'
				});

				organization.get('suborganizations').addObject(newSubsidiary);
				this.set('currentModel', newSubsidiary);
			},

			'add-department': function(organization) {
				var newDepartment = this.get('model').store.createRecord('organization-manager', {
					'id': app.default.generateUUID(),
					'name': 'New Department',
					'parent': organization,
					'tenantType': 'Department'
				});

				organization.get('suborganizations').addObject(newDepartment);
				this.set('currentModel', newDepartment);
			},

			'save-organization': function(organization) {
				var self = this;

				organization
				.save()
				.then(function() {
					self.send('controller-action', 'display-status-message', { 'type': 'success', 'message': organization.get('name') + ' organization information has been saved' });
				})
				.catch(function(reason) {
					self.send('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': organization });
					organization.rollbackAttributes();
				});
			},

			'delete-organization': function(organization) {
				var delOrgName = organization.get('name'),
					parentOrg = organization.get('parent');

				var self = this,
					delFn = function() {
						organization.destroyRecord()
						.then(function() {
							if(parentOrg) {
								parentOrg.get('suborganizations').removeObject(organization);
							}

							if(self.get('currentModel').get('id') != organization.get('id')) {
								self.set('deleteTreeNode', organization.get('id'));
							}

							return;
						})
						.then(function() {
							self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': delOrgName + ' information has been deleted' });
						})
						.catch(function(reason) {
							self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': organization });
							organization.rollbackAttributes();
						});
					};

				if(organization.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + delOrgName + '"</strong>?',
						'title': 'Delete <strong>' + delOrgName + '</strong>?',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'create-tenant-user': function(data) {
				var self = this,
					newUserId = app.default.generateUUID(),
					newUserRelId = app.default.generateUUID(),
					tenant = data.organization;

				var newUserRel = null,
					newUser = self.get('model').store.createRecord('organization-manager-user', {
					'id': newUserId,
					'firstName': data.firstName,
					'lastName': data.lastName,
					'login': data.login
				});

				self.send('portal-action', 'display-status-message', { 'type': 'info', 'message': 'Creating ' + newUser.get('fullName') + ' record in the database' });
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

					self.send('portal-action', 'display-status-message', { 'type': 'info', 'message': 'Adding ' + newUser.get('fullName') + ' to ' + tenant.get('name') + ' Organization' });
					return newUserRel.save();
				})
				.then(function() {
					return tenant.get('users').addObject(newUserRel);
				})
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': newUser.get('fullName') + ' has been added to the ' + tenant.get('name') + ' Organization' });
				})
				.catch(function(err) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': (newUserRel ? newUserRel : newUser) });
					newUser.rollbackAttributes();

					if(newUserRel) {
						tenant.get('users').removeObject(newUserRel);
						newUserRel.rollbackAttributes();
					}
				});
			},

			'add-tenant-user': function(data) {
				var newTenantUser = data.tenant.store.createRecord('organization-manager-tenant-user', {
					'id': data.tenantUserId,
					'tenant': data.tenant
				});

				data.tenant.get('users').addObject(newTenantUser);
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
					self.send('controller-action', 'display-status-message', { 'type': 'success', 'message': tenantUser.get('user').get('fullName') + ' has been added to the ' + tenantUser.get('tenant').get('name') + ' organization' });
				})
				.catch(function(reason) {
					self.send('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantUser });
					tenantUser.rollbackAttributes();
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
							tenant.get('users').removeObject(tenantUser);
							self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': userName + ' has been removed from the ' + tenant.get('name') + ' organization' });
						})
						.catch(function(reason) {
							self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantUser });
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
						this.send('portal-action', action, data);
				}
			}
		});

		exports['default'] = OrganizationManagerController;
	}
);
