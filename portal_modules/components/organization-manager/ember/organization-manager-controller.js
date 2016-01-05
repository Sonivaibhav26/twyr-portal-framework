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
