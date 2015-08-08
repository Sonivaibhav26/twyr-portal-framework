define(
	"twyrPortal/controllers/organization-manager-organization-structure",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-organization-structure');

		var OrganizationManagerOrganizationStructureController = window.Ember.Controller.extend({
			'_displayComponent': null,
			'_displayParentModel': null,
			'_displayModel': null,

			'_initialize': function() {
				var self = this;
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.set('_displayComponent', 'organization-manager-organization-structure-about');
					self.set('_displayModel', self.get('model'));
				});
			}.on('init'),

			'displayComponent': window.Ember.computed('_displayComponent', function() {
				return this.get('_displayComponent');
			}),

			'displayParentModel': window.Ember.computed('_displayModel', function() {
				return this.get('_displayParentModel');
			}),

			'displayModel': window.Ember.computed('_displayModel', function() {
				return this.get('_displayModel');
			}),

			'actions': {
				'setCurrentWidget': function(widgetName, parent, model) {
					var self = this,
						tenantType = '';

					parent = parent || self.get('model');

					switch(widgetName) {
						case 'department':
							tenantType = 'Department';
							widgetName = 'about';
						break;

						case 'subsidiary':
							tenantType = 'Organization';
							widgetName = 'about';
						break;
					}						

					if(!model) {
						if(widgetName == 'about') {
							model = parent.store.createRecord('organization-manager-organization-structure', {
								'id': app.default.generateUUID(),
								'name': 'New ' + tenantType + ' (' + parent.get('name') + ')',
								'parentId': self.get('model').get('id'),
								'tenantType': tenantType
							});
	
							parent.get('suborganizations').addObject(model);
						}

						if(widgetName == 'partner') {
							model = parent.store.createRecord('organization-manager-organization-partner', {
								'id': app.default.generateUUID(),
								'tenant': parent
							});
	
							parent.get('partners').addObject(model);
						}
					}

					if(model.get('id') == self.get('model').get('id'))
						parent = null;

					window.Ember.run(function() {
						self.set('_displayComponent', 'organization-manager-organization-structure-' + widgetName);
						self.set('_displayParentModel', parent);
						self.set('_displayModel', model);
					});
				},

				'deleteEntity': function(entity, parent, model) {
					var modelCollectionField = '',
						entityName = '',
						title = '';

					switch(entity) {
						case 'organization':
							modelCollectionField = 'suborganizations';
							entityName = model.get('name') || 'New Organization';
							title = 'Delete ' + (model.get('isDepartment') ? 'Department': 'Subsidiary');
						break;

						case 'partner':
							modelCollectionField = 'partners';
							entityName = model.get('partner').get('name') || 'New Business Partner';
							title = 'Delete Business Partner';
						break;
					};

					window.Ember.$.confirm({
						'text': 'Are you sure that you want to remove <strong>"' + entityName + '"</strong>?',
						'title': title,

						'confirm': function() {
							model.destroyRecord()
							.then(function() {
								parent.get(modelCollectionField).removeObject(model);
							})
							.catch(function(err) {
								model.rollbackAttributes();
								model.transitionTo('loaded.saved');
							});
						},

						'cancel': function() {
							// Nothing to do...
						}
					});

				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureController;
	}
);

