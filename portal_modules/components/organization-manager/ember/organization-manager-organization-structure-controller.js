define(
	"twyrPortal/controllers/organization-manager-organization-structure",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-organization-structure');

		var OrganizationManagerOrganizationStructureController = window.Ember.Controller.extend({
			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-organization-manager-organization-structure-failure-message').slideUp(timeout || 600);

				window.Ember.$('div#div-organization-manager-organization-structure-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-organization-structure-alert-message').text('');

				window.Ember.$('div#div-organization-manager-organization-structure-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-organization-structure-progress-message').text('');

				window.Ember.$('div#div-organization-manager-organization-structure-success-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-organization-structure-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('div#div-organization-manager-organization-structure-' + statusMessageType + '-message').slideDown(600);
				if(statusMessageType != 'failure') {
					window.Ember.$('span#organization-manager-organization-structure-' + statusMessageType + '-message').html(messageText);
				}
			},

			'add-entity': function(data) {
				var recordData = null,
					self = this;

				switch(data.type) {
					case 'subsidiary':
						data.type = 'organization-manager-organization-structure';
						recordData = {
							'id': app.default.generateUUID(),
							'name': 'New Subsidiary',
							'tenantType': 'Organization'
						};
						break;

					case 'department':
						data.type = 'organization-manager-organization-structure';
						recordData = {
							'id': app.default.generateUUID(),
							'parent': this.get('currentModel').get('id'),
							'name': 'New Department',
							'tenantType': 'Department'
						};
						break;

					case 'vendor':
						data.type = 'organization-manager-organization-partner';
						recordData = {
							'id': app.default.generateUUID(),
							'tenant': this.get('currentModel').get('id')
						};
						break;
				};

				var newEntity = this.get('currentModel').store.createRecord(data.type, recordData);
				if(recordData.tenantType)
					self.get('currentModel').get('suborganizations').addObject(newEntity);
				else
					self.get('currentModel').get('partners').addObject(newEntity);

				self.get('currentModel').set('contextChange', newEntity);
			},

			'save-org': function(data) {
				var self = this;

				self.get('currentModel').save()
				.then(function() {
					self.showStatusMessage('success', 'Organization information has been updated');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(reason) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						self.get('currentModel').rollbackAttributes();
						self.get('currentModel').transitionTo('loaded.saved');
					}, 5000);
				});
			},

			'delete-org': function(data) {
				if(data.id.indexOf('--') > 0)
					return;

				var self = this,
					delFn = function() {
						self.get('currentModel').destroyRecord()
						.then(function() {
							self.showStatusMessage('success', 'Organization information has been deleted');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						})
						.catch(function(reason) {
							self.showStatusMessage('failure');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
		
								self.get('currentModel').rollbackAttributes();
								self.get('currentModel').transitionTo('loaded.saved');
							}, 5000);
						});
					};

				if(self.get('currentModel').get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + (self.get('currentModel').get('name') || self.get('currentModel').get('partner').get('name')) + '"</strong>?',
						'title': 'Delete',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'selected-org-changed': function(data) {
				var self = this,
					tmplType = data.type,
					recordType = 'organization-manager-organization-structure';

				switch(data.type) {
					case 'subsidiaries':
					case 'departments':
						tmplType = 'organization';
						break;

					case 'vendors':
						tmplType = 'vendors';
						recordType = 'organization-manager-organization-partner';
						break;

					case 'list-subsidiaries':
					case 'list-departments':
					case 'list-vendors':
						break;

					default:
						tmplType = 'organization';
						break;
				}

				this.get('model').store.findRecord(recordType, data.id)
				.then(function(organizationData) {
					self.set('currentModel', organizationData);
					self.set('currentComponent', 'organization-manager-organization-structure-' + tmplType);
				})
				.catch(function(err) {
					console.error(err);
				});
			},

			'actions': {
				'controller-action': function(action, data) {
					console.log('OrganizationManagerOrganizationStructureController::controller-action: ', arguments);
					this[action](data);
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureController;
	}
);