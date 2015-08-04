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
						newDepartment = self.get('model').store.createRecord('organization-manager-basic-information', {
							'id': app.default.generateUUID(),
							'name': ''
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
	"twyrPortal/components/organization-manager-partners",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerPartnersComponent = window.Ember.Component.extend({
			'_initializePartnerSelectElement': function(partner) {
				var self = this;

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					var partnerSelectElem = window.Ember.$('select#organization-manager-partners-select-partner-' + partner.get('id'));
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
						partner.set('partnerId', partnerSelectElem.val());
						partner.set('partnerName', partnerSelectElem.text());
					});
				});
			},

			'actions': {
				'addPartner': function() {
					var self = this,
						newPartner = self.get('model').store.createRecord('organization-manager-business-partner', {
							'id': app.default.generateUUID(),
							'tenantId': self.get('model').get('id')
						});

					self.get('model').get('partners').addObject(newPartner);
					self._initializePartnerSelectElement(newPartner);
				},

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

					partner.destroyRecord()
					.then(function() {
						self.get('model').get('partners').removeObject(partner);
					})
					.catch(function(err) {
						console.error('Delete partner failed: ', err);

						partner.rollbackAttributes();
						partner.transitionTo('loaded.saved');
					});
				}
			}
		});

		exports['default'] = OrganizationManagerPartnersComponent;
	}
);
