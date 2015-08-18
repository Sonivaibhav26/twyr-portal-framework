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

			'suborganizations': window.DS.hasMany('organization-manager-organization-structure', { 'async': true, 'inverse': 'parent' }),
			'groups': window.DS.hasMany('organization-manager-organization-group', { 'async': true, 'inverse': 'tenant' }),
			'users': window.DS.hasMany('organization-manager-organization-user-tenant', { 'async': true, 'inverse': 'tenant' }),

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

		exports['default'] = OrganizationManagerOrganizationStructureModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-organization-group",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-group');

		var OrganizationManagerOrganizationGroupAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationGroupAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-group",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-group');

		var OrganizationManagerOrganizationGroupModel = window.DS.Model.extend({
			'displayName': window.DS.attr('string'),

			'tenant': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': 'groups' }),

			'parent': window.DS.belongsTo('organization-manager-organization-group', { 'async': true, 'inverse': 'subgroups' }),
			'subgroups': window.DS.hasMany('organization-manager-organization-group', { 'async': true, 'inverse': 'parent' }),

			'permissions': window.DS.hasMany('organization-manager-organization-group-permission', { 'async': true, 'inverse': 'group' }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationGroupModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-organization-user-tenant",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-user-tenant');

		var OrganizationManagerOrganizationUserTenantAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationUserTenantAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-user-tenant",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-user-tenant');

		var OrganizationManagerOrganizationUserModel = window.DS.Model.extend({
			'tenant': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': 'users' }),
			'user': window.DS.belongsTo('organization-manager-organization-user', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationUserModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-organization-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-user');

		var OrganizationManagerOrganizationUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-user');

		var OrganizationManagerOrganizationUserModel = window.DS.Model.extend({
			'firstName': window.DS.attr('string'),
			'middleNames': window.DS.attr('string'),
			'lastName': window.DS.attr('string'),
			'email': window.DS.attr('string'),

			'fullName': window.Ember.computed('firstName', 'lastName', {
				'get': function(key) {
					return (this.get('firstName') + ' ' + this.get('lastName'));
				}
			}),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationUserModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-organization-group-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-group-permission');

		var OrganizationManagerOrganizationGroupPermissionAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationGroupPermissionAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-group-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-group-permission');

		var OrganizationManagerOrganizationGroupPermissionModel = window.DS.Model.extend({
			'group': window.DS.belongsTo('organization-manager-organization-group', { 'async': true, 'inverse': 'permissions' }),
			'permission': window.DS.belongsTo('organization-manager-component-permission', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationGroupPermissionModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-component-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-component-permission');

		var OrganizationManagerComponentPermissionAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerComponentPermissionAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-component-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-component-permission');

		var OrganizationManagerComponentPermissionModel = window.DS.Model.extend({
			'componentName': window.DS.attr('string'),
			'displayName': window.DS.attr('string'),
			'description':  window.DS.attr('string')
		});

		exports['default'] = OrganizationManagerComponentPermissionModel;
	}
);
