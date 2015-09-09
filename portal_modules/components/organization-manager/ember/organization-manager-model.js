define(
	"twyrPortal/adapters/organization-manager",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager');

		var OrganizationManagerAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager');

		var OrganizationManagerModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'parent': window.DS.belongsTo('organization-manager', { 'async': true, 'inverse': 'suborganizations' }),
			'tenantType': window.DS.attr('string'),

			'suborganizations': window.DS.hasMany('organization-manager', { 'async': true, 'inverse': 'parent' }),
			'users': window.DS.hasMany('organization-manager-tenant-user', { 'async': true, 'inverse': 'tenant' }),

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

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-tenant-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-user');

		var OrganizationManagerTenantUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
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
			'tenant': window.DS.belongsTo('organization-manager', { 'async': true, 'inverse': 'users' }),
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


define(
	"twyrPortal/adapters/organization-manager-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-user');

		var OrganizationManagerUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-user');

		var OrganizationManagerUserModel = window.DS.Model.extend({
			'login': window.DS.attr('string'),

			'firstName': window.DS.attr('string'),
			'middleNames': window.DS.attr('string'),
			'lastName': window.DS.attr('string'),

			'fullName': window.Ember.computed('firstName', 'lastName', {
				'get': function(key) {
					return this.get('firstName') + ' ' + this.get('lastName');
				}
			}),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerUserModel;
	}
);
