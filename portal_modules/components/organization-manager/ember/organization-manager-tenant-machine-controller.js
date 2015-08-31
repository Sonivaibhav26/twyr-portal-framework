define(
	"twyrPortal/controllers/organization-manager-tenant-machine-management",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-tenant-machine-management');

		var OrganizationManagerTenantMachineManagementController = window.Ember.Controller.extend({
			'selected-org-changed': function(data) {
				var self = this,
					tmplType = data.type,
					recordType = 'organization-manager-organization-structure';

				switch(data.type) {
					case 'subsidiaries':
					case 'departments':
						tmplType = 'machine';
						break;

					case 'list-subsidiaries':
					case 'list-departments':
						break;

					default:
						tmplType = 'machine';
						break;
				}

				this.get('model').store.findRecord(recordType, data.id)
				.then(function(organizationData) {
					self.set('currentModel', organizationData);
					self.set('currentComponent', 'organization-manager-tenant-machine-management-' + tmplType);
				})
				.catch(function(err) {
					console.error(err);
				});
			},

			'save-machine': function(data) {
				var self = this;

				data.machine.save()
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': data.machine.get('name') + ' Machine has been updated' });
				})
				.catch(function(reason) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': data.machine });
					data.machine.rollbackAttributes();
				});
			},

			'delete-machine': function(data) {
				var organization = data.organization,
					machine = data.machine,
					self = this;

				var delFn = function() {
					machine.destroyRecord()
					.then(function() {
						return organization.get('machines').removeObject(machine);
					})
					.then(function() {
						self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': machine.get('name') + ' Machine has been removed from the ' + organization.get('name') + ' Organization' });
					})
					.catch(function(reason) {
						self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': machine });
						machine.rollbackAttributes();
					});
				};

				if(machine.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + machine.get('name') + '"</strong>?',
						'title': 'Delete',

						'confirm': delFn,

						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-tenant-machine-user': function(data) {
				var newMachineReady = data.tenantMachine.store.createRecord('organization-manager-tenant-machine-user', {
					'id': data.userId,
					'tenantMachine': data.tenantMachine
				});

				data.tenantMachine.get('users').addObject(newMachineReady);
			},

			'save-tenant-machine-user': function(data) {
				var userId = data.userId,
					userTenantMachineId = data.userTenantMachineId,
					self = this;

				var tenantMachineUser = null,
					organizationUser = null;

				var promiseResolutions = [];
				promiseResolutions.push(this.store.peekRecord('organization-manager-tenant-machine-user', userTenantMachineId));
				promiseResolutions.push(this.store.findRecord('organization-manager-organization-user', userId));

				window.Ember.RSVP.Promise.all(promiseResolutions)
				.then(function(results) {
					tenantMachineUser = results[0];
					organizationUser = results[1];

					return tenantMachineUser.set('user', organizationUser);
				})
				.then(function() {
					return tenantMachineUser.save();
				})
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': organizationUser.get('fullName') +  ' has been added to the ' + tenantMachineUser.get('tenantMachine').get('name') + ' machine\'s access list' });
				})
				.catch(function(err) {
					console.error(err);
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantMachineUser });
					tenantMachineUser.rollbackAttributes();
				});
			},

			'delete-tenant-machine-user': function(data) {
				var user = data.user,
					userName = (user.get('user') ? user.get('user').get('fullName') : 'New User'),
					machine = data.tenantMachine,
					self = this;

				var delFn = function() {
					user.destroyRecord()
					.then(function() {
						return machine.get('users').removeObject(user);
					})
					.then(function() {
						self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': userName + ' has been removed from the ' + machine.get('name') + ' machine\'s access list' });
					})
					.catch(function(reason) {
						self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': machine });
						machine.rollbackAttributes();
					});
				};

				if(user.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + user.get('user').get('fullName') + '"</strong>?',
						'title': 'Delete',

						'confirm': delFn,

						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-machine-tag-list': function(data) {
				var machine = data.machine,
					newTag = machine.store.createRecord('organization-manager-tenant-machine-tag', {
						'id': app.default.generateUUID(),
						'machine': machine.get('id'),
						'isEditing': true
					});

				machine.get('tags').addObject(newTag);
			},

			'update-machine-tag-list': function(data) {
				var machine = data.machine,
					tagJSON = data.tags,
					self = this;

				window.Ember.$.ajax({
					'type': 'PUT',
					'url': window.apiServer + 'organization-manager/organizationManagerTenantMachineTags',

					'dataType': 'json',
					'data': {
						'machine': machine.get('id'),
						'tenant': machine.get('tenant').get('id'),
						'tags': tagJSON
					},

					'success': function(data) {
						if(data.status) {
							self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': data.responseText });
						}
						else {
							self.send('portal-action', 'display-status-message', { 'type': 'danger', 'message': data.responseText });
						}
					},

					'error': function(err) {
						self.send('portal-action', 'display-status-message', { 'type': 'danger', 'message': (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )) });
					}
				});
			},

			'add-machine-computed-tag-list': function(data) {
				var machine = data.machine,
					newTag = machine.store.createRecord('organization-manager-tenant-machine-tag-computed', {
						'id': app.default.generateUUID(),
						'machine': machine.get('id'),
						'isEditing': true
					});

				machine.get('computed').addObject(newTag);
			},

			'update-machine-computed-tag-list': function(data) {
				var machine = data.machine,
					tagJSON = data.tags,
					self = this;

				window.Ember.$.ajax({
					'type': 'PUT',
					'url': window.apiServer + 'organization-manager/organizationManagerTenantMachineTagComputeds',

					'dataType': 'json',
					'data': {
						'machine': machine.get('id'),
						'tenant': machine.get('tenant').get('id'),
						'tags': tagJSON
					},

					'success': function(data) {
						if(data.status) {
							self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': data.responseText });
						}
						else {
							self.send('portal-action', 'display-status-message', { 'type': 'danger', 'message': data.responseText });
						}
					},

					'error': function(err) {
						self.send('portal-action', 'display-status-message', { 'type': 'danger', 'message': (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )) });
					}
				});
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

		exports['default'] = OrganizationManagerTenantMachineManagementController;
	}
);
