define(
	"twyrPortal/controllers/organization-manager-tenant-machine-management",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-tenant-machine-management');

		var OrganizationManagerTenantMachineManagementController = window.Ember.Controller.extend({
			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-organization-manager-tenant-machine-management-failure-message').slideUp(timeout || 600);

				window.Ember.$('div#div-organization-manager-tenant-machine-management-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-tenant-machine-management-alert-message').text('');

				window.Ember.$('div#div-organization-manager-tenant-machine-management-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-tenant-machine-management-progress-message').text('');

				window.Ember.$('div#div-organization-manager-tenant-machine-management-success-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-tenant-machine-management-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('div#div-organization-manager-tenant-machine-management-' + statusMessageType + '-message').slideDown(600);
				if(statusMessageType != 'failure') {
					window.Ember.$('span#organization-manager-tenant-machine-management-' + statusMessageType + '-message').html(messageText);
				}
			},

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
						self.resetStatusMessages();
						self.showStatusMessage('success', 'Machine has been removed from the Organization');
	
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					})
					.catch(function(reason) {
						self.resetStatusMessages();
						self.showStatusMessage('failure');
	
						machine.rollbackAttributes();
	
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
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
					userTenantMachineId = data.userTenantMachineId;

				var tenantMachineUser = null,
					organizationUser = null;

				var promiseResolutions = [];
				promiseResolutions.push(this.store.findRecord('organization-manager-tenant-machine-user', userTenantMachineId));
				promiseResolutions.push(this.store.findRecord('organization-manager-organization-user', userId));

				window.Ember.RSVP.Promise.all(promiseResolutions)
				.then(function(results) {
					tenantMachineUser = results[0];
					organizationUser = results[1];

					return tenantMachineUser.get('users').addObject(organizationUser);
				})
				.then(function() {
					return tenantMachineUser.save();
				})
				.then(function() {
					self.resetStatusMessages();
					self.showStatusMessage('success', 'User has been added to the machine\'s watcher list');

					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(err) {
					self.resetStatusMessages();
					self.showStatusMessage('failure');

					tenantMachineUser.rollbackAttributes();

					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				});
			},

			'delete-tenant-machine-user': function(data) {
				var user = data.user,
					machine = data.tenantMachine,
					self = this;

				var delFn = function() {
					user.destroyRecord()
					.then(function() {
						return machine.get('users').removeObject(user);
					})
					.then(function() {
						self.resetStatusMessages();
						self.showStatusMessage('success', 'User has been removed from the machine\'s watcher list');
	
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					})
					.catch(function(reason) {
						self.resetStatusMessages();
						self.showStatusMessage('failure');
	
						machine.rollbackAttributes();
	
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
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

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						console.log('TODO: Handle ' + action + ' action with data: ', data);
				}
			}
		});

		exports['default'] = OrganizationManagerTenantMachineManagementController;
	}
);