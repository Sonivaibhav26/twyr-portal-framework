define(
	"twyrPortal/components/organization-manager-sub-organization-structure-about",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-about');

		var OrganizationManagerOrganizationStructureAboutComponent = window.Ember.Component.extend({
			'actions': {
				'save': function() {
					this.sendAction('controller-action', 'save');
				},

				'cancel': function() {
					this.sendAction('controller-action', 'cancel');
				},

				'delete': function() {
					this.sendAction('controller-action', 'delete');
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureAboutComponent;
	}
);

define(
	"twyrPortal/controllers/organization-manager-sub-organization-structure/subsidiaries",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-sub-organization-structure/subsidiaries');

		var OrganizationManagerSubOrganizationStructureSubsidiariesController = window.Ember.ArrayController.extend({
			'parentController': window.Ember.inject.controller('organization-manager-sub-organization-structure'),

			'_onModelChange': window.Ember.observer('model', function() {
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					window.Ember.$('table#table-organization-manager-sub-organization-structure-subsidiaries-list').DataTable();
				});
			}),

			'actions': {
				'add': function() {
					var parentOrganization = this.get('parentController').get('model'),
						newSubsidiary = parentOrganization.store.createRecord('organization-manager-organization-structure', {
							'id': app.default.generateUUID(),
							'name': 'New Susidiary',
							'parent': parentOrganization,
							'tenantType': 'Organization'
						});

					parentOrganization.get('suborganizations').addObject(newSubsidiary);
					this.transitionToRoute('organization-manager-sub-organization-structure', newSubsidiary);
				}
			}
		});

		exports['default'] = OrganizationManagerSubOrganizationStructureSubsidiariesController;
	}
);

define(
	"twyrPortal/controllers/organization-manager-sub-organization-structure/departments",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-sub-organization-structure/departments');

		var OrganizationManagerSubOrganizationStructureDepartmentsController = window.Ember.ArrayController.extend({
			'parentController': window.Ember.inject.controller('organization-manager-sub-organization-structure'),

			'_onModelChange': window.Ember.observer('model', function() {
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					window.Ember.$('table#table-organization-manager-sub-organization-structure-departments-list').DataTable();
				});
			}),

			'actions': {
				'add': function() {
					var parentOrganization = this.get('parentController').get('model'),
						newSubsidiary = parentOrganization.store.createRecord('organization-manager-organization-structure', {
							'id': app.default.generateUUID(),
							'name': 'New Department',
							'parent': parentOrganization,
							'tenantType': 'Department'
						});

					parentOrganization.get('suborganizations').addObject(newSubsidiary);
					this.transitionToRoute('organization-manager-sub-organization-structure', newSubsidiary);
				}
			}
		});

		exports['default'] = OrganizationManagerSubOrganizationStructureDepartmentsController;
	}
);

define(
	"twyrPortal/controllers/organization-manager-sub-organization-structure/partners",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-sub-organization-structure/partners');

		var OrganizationManagerSubOrganizationStructurePartnersController = window.Ember.ArrayController.extend({
			'parentController': window.Ember.inject.controller('organization-manager-sub-organization-structure'),

			'actions': {
				'add': function() {
					var self = this,
						parentOrganization = self.get('parentController').get('model'),
						newPartner = parentOrganization.store.createRecord('organization-manager-organization-partner', {
							'id': app.default.generateUUID(),
							'tenant': parentOrganization
						});

					parentOrganization.get('partners').addObject(newPartner);
					this.transitionToRoute('organization-manager-sub-organization-partner', newPartner);
//					window.Ember.run.scheduleOnce('afterRender', self, function() {
//						self._initSelect(newPartner);
//					});
				},

				'delete': function(vendor) {
					var self = this,
						parentOrganization = self.get('parentController').get('model'),
						delFn = function() {
							parentOrganization.get('partners').removeObject(vendor);

							vendor.destroyRecord()
							.then(function() {
								console.log('Succesfully deleted ' + vendor.get('partner').get('name'));
							})
							.catch(function(err) {
								console.error('Error deleting ' + vendor.get('partner').get('name') + ': ', err);

								vendor.rollbackAttributes();
								vendor.transitionTo('loaded.saved');
							});
						};

					if(!vendor.get('isNew')) {
						window.Ember.$.confirm({
							'text': 'Are you sure that you want to remove <strong>"' + vendor.get('partner').get('name') + '"</strong> from the list of Vendors?',
							'title': 'Delete Vendor',
	
							'confirm': delFn,
	
							'cancel': function() {
								// Do nothing...
							}
						});
					}
					else {
						delFn();
					}
				}
			}
		});

		exports['default'] = OrganizationManagerSubOrganizationStructurePartnersController;
	}
);
