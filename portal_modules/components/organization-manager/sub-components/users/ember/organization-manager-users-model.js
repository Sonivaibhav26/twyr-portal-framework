define(
	"twyrPortal/adapters/organization-manager-tenant-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-user');

		var OrganizationManagerTenantUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-users'
		});

		exports['default'] = OrganizationManagerTenantUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-tenant-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-user');

		var OrganizationManagerTenantUserModel = window.DS.Model.extend({
			'tenant': window.DS.belongsTo('organization-manager', { 'async': true, 'inverse': null }),
			'user': window.DS.belongsTo('organization-manager-user', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerTenantUserModel;
	}
);
