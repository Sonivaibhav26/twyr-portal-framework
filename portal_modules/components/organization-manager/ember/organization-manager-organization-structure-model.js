define(
	"twyrPortal/adapters/organization-manager-organization-structure",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-structure');

		var OrganizationManagerOrganizationStructureAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationStructureAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-structure",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-structure');

		var OrganizationManagerOrganizationStructureModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'parent': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': 'suborganizations' }),
			'tenantType': window.DS.attr('string'), 
			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'suborganizations': window.DS.hasMany('organization-manager-organization-structure', { 'async': true, 'inverse': 'parent' }),
			'partners': window.DS.hasMany('organization-manager-organization-partner', { 'async': true, 'inverse': null }),

			'isDepartment': window.Ember.computed('tenantType', {
				'get': function(key) {
					return (this.get('tenantType') == 'Department');
				}
			}),

			'isOrganization': window.Ember.computed('tenantType', {
				'get': function(key) {
					return (this.get('tenantType') == 'Organization');
				}
			}),

			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationStructureModel;
	}
);

define(
	"twyrPortal/adapters/organization-manager-organization-partner",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-partner');

		var OrganizationManagerOrganizationPartnerAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationPartnerAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-partner",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-partner');

		var OrganizationManagerOrganizationPartnerModel = window.DS.Model.extend({
			'tenant': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': null }),
			'partner': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationPartnerModel;
	}
);
