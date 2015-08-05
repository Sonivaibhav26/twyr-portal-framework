define(
	"twyrPortal/adapters/organization-manager-organization-structure",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerOrganizationStructureAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager',
		});

		exports['default'] = OrganizationManagerOrganizationStructureAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-structure",
	["exports"],
	function(exports) {
		var OrganizationManagerOrganizationStructureModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),

			'parentId': window.DS.attr('string'),
			'parentName': window.DS.attr('string'),

			'tenantType': window.DS.attr('string', { 'defaultValue': 'Department' }),
			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'departments': window.DS.hasMany('organization-manager-organization-structure', { 'async': true, 'inverse': null }),
			'subTenants': window.DS.hasMany('organization-manager-organization-structure', { 'async': true, 'inverse': null }),

			'partners': window.DS.hasMany('organization-manager-business-partner', { 'async': true, 'inverse': null }),

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
	"twyrPortal/adapters/organization-manager-business-partner",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerBusinessPartnerAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager',
		});

		exports['default'] = OrganizationManagerBusinessPartnerAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-business-partner",
	["exports"],
	function(exports) {
		var OrganizationManagerBusinessPartnerModel = window.DS.Model.extend({
			'tenantId': window.DS.attr('string'),
			'partnerId': window.DS.attr('string'),
			'partnerName': window.DS.attr('string'),
			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerBusinessPartnerModel;
	}
);
