define(
	"twyrPortal/components/organization-manager-about",
	["exports"],
	function(exports) {
		var OrganizationManagerAboutComponent = window.Ember.Component.extend({
			'actions': {
				'save': function() {
					var self = this;

					self.get('model')
					.save()
					.then(function() {
						console.log('Persisted Tenant successfully');
					})
					.catch(function(err) {
						console.error('Error persisting tenant: ', err);

						self.get('model').rollbackAttributes();
						self.get('model').transitionTo('loaded.saved');
					});
				},

				'cancel': function(deptId) {
					this.get('model').rollbackAttributes();
				}
			}
		});

		exports['default'] = OrganizationManagerAboutComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-departments",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerDepartmentsComponent = window.Ember.Component.extend({
			'actions': {
				'addDepartment': function() {
					var self = this,
						newDepartment = self.get('model').store.createRecord('organization-manager-organization-structure', {
							'id': app.default.generateUUID(),
							'name': '',
							'parentId': self.get('model').get('id'),
							'tenantType': 'Department'
						});

					self.get('model').get('departments').addObject(newDepartment);
				},

				'saveDepartment': function(department) {
					department.save()
					.then(function() {
						console.log('Saved department succesfully');
					})
					.catch(function(err) {
						console.error('Could not add new department: ', err);
						department.transitionTo('created.uncommitted');
					});
				},

				'deleteDepartment': function(department) {
					var self = this;

					department.destroyRecord()
					.then(function() {
						self.get('model').get('departments').removeObject(department);
					})
					.catch(function(err) {
						console.error('Delete department failed: ', err);

						department.rollbackAttributes();
						department.transitionTo('loaded.saved');
					});
				}
			}
		});

		exports['default'] = OrganizationManagerDepartmentsComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-subtenants",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerSubTenantsComponent = window.Ember.Component.extend({
			'actions': {
				'addSubTenant': function() {
					var self = this,
						newSubTenant = self.get('model').store.createRecord('organization-manager-organization-structure', {
							'id': app.default.generateUUID(),
							'name': '',
							'parentId': self.get('model').get('id'),
							'tenantType': 'Organization'
						});

					self.get('model').get('subTenants').addObject(newSubTenant);
				},

				'saveSubTenant': function(subTenant) {
					subTenant.save()
					.then(function() {
						console.log('Saved subsidiary succesfully');
					})
					.catch(function(err) {
						console.error('Could not add new subsidiary: ', err);
						subTenant.transitionTo('created.uncommitted');
					});
				},

				'deleteSubTenant': function(subTenant) {
					var self = this;

					subTenant.destroyRecord()
					.then(function() {
						self.get('model').get('subTenants').removeObject(subTenant);
					})
					.catch(function(err) {
						console.error('Delete subsidiary failed: ', err);

						subTenant.rollbackAttributes();
						subTenant.transitionTo('loaded.saved');
					});
				}
			}
		});

		exports['default'] = OrganizationManagerSubTenantsComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-business-partners-single",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerBusinessPartnersSingleComponent = window.Ember.Component.extend({
			'_initializePartnerSelectElement': function() {
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					var partnerSelectElem = window.Ember.$('select#organization-manager-business-partners-select-partner-' + this.get('partner').get('id')),
						self = this;

					if(!partnerSelectElem) return;
					partnerSelectElem.select2({
						'ajax': {
							'delay': 250,
							'dataType': 'json',
		
							'url': window.apiServer + 'masterdata/partners',

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
											'text': item.name,
											'slug': item.name,
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

						'allowClear': false,
						'closeOnSelect': true,

						'placeholder': 'Partner'
					})
					.on('change', function() {
						self.get('partner').set('partnerId', partnerSelectElem.val());
						self.get('partner').set('partnerName', partnerSelectElem.text());
					});
				});
			}.on('init'),

			'actions': {
				'savePartner': function(partner) {
					partner.save()
					.then(function() {
						console.log('Saved partner succesfully');
					})
					.catch(function(err) {
						console.error('Could not add new partner: ', err);
						partner.transitionTo('created.uncommitted');
					});
				},

				'deletePartner': function(partner) {
					var self = this;

					window.Ember.$.confirm({
						'text': 'Are you sure that you want to remove <strong>"' + (partner.get('partnerName') || 'New Partner') + '"</strong> as a business partner?',

						'confirm': function() {
							partner.destroyRecord()
							.then(function() {
								self.get('model').get('partners').removeObject(partner);
							})
							.catch(function(err) {
								console.error('Delete partner failed: ', err);
		
								partner.rollbackAttributes();
								partner.transitionTo('loaded.saved');
							});
						},

						'cancel': function() {
							// Nothing to do...
						}
					});
				}
			}
		});

		exports['default'] = OrganizationManagerBusinessPartnersSingleComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-business-partners",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerBusinessPartnersComponent = window.Ember.Component.extend({
			'actions': {
				'addPartner': function() {
					var self = this,
						newPartner = self.get('model').store.createRecord('organization-manager-business-partner', {
							'id': app.default.generateUUID(),
							'tenantId': self.get('model').get('id')
						});

					self.get('model').get('partners').addObject(newPartner);
				}
			}
		});

		exports['default'] = OrganizationManagerBusinessPartnersComponent;
	}
);