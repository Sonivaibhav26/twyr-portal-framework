define(
	"twyrPortal/adapters/organization-manager-tenant-location",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-location');

		var OrganizationManagerTenantLocationAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-locations'
		});

		exports['default'] = OrganizationManagerTenantLocationAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-tenant-location",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-location');

		var OrganizationManagerTenantLocationModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'tenant': window.DS.belongsTo('organization-manager', { 'async': true, 'inverse': null }),
			'location': window.DS.belongsTo('organization-manager-location', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerTenantLocationModel;
	}
);

define(
	"twyrPortal/adapters/organization-manager-location",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-location');

		var OrganizationManagerLocationAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-locations'
		});

		exports['default'] = OrganizationManagerLocationAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-location",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-location');

		var OrganizationManagerLocationModel = window.DS.Model.extend({
			'route': window.DS.attr('string'),
			'area': window.DS.attr('string'),
			'city': window.DS.attr('string'),
			'state': window.DS.attr('string'),
			'postalCode': window.DS.attr('string'),
			'country': window.DS.attr('string'),
			'latitude': window.DS.attr('number'),
			'longitude': window.DS.attr('number'),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerLocationModel;
	}
);
