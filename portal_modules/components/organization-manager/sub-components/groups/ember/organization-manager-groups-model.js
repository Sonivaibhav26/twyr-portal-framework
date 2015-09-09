define(
	"twyrPortal/adapters/organization-manager-group",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-group');

		var OrganizationManagerGroupsAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-groups'
		});

		exports['default'] = OrganizationManagerGroupsAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-group",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-group');

		var OrganizationManagerGroupModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'tenant': window.DS.belongsTo('organization-manager', { 'async': true, 'inverse': null }),
			'parent': window.DS.belongsTo('organization-manager-group', { 'async': true, 'inverse': 'subgroups' }),

			'subgroups': window.DS.hasMany('organization-manager-group', { 'async': true, 'inverse': 'parent' }),
			'permissions': window.DS.hasMany('organization-manager-group-permission', { 'async': true, 'inverse': 'group' }),
			'users': window.DS.hasMany('organization-manager-group-user', { 'async': true, 'inverse': 'group' }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerGroupModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-group-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-group-permission');

		var OrganizationManagerGroupPermissionAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-groups'
		});

		exports['default'] = OrganizationManagerGroupPermissionAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-group-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-group-permission');

		var OrganizationManagerGroupPermissionModel = window.DS.Model.extend({
			'group': window.DS.belongsTo('organization-manager-group', { 'async': true, 'inverse': 'permissions' }),
			'permission': window.DS.belongsTo('organization-manager-component-permission', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerGroupPermissionModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-group-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-group-user');

		var OrganizationManagerGroupUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-groups'
		});

		exports['default'] = OrganizationManagerGroupUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-group-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-group-user');

		var OrganizationManagerGroupUserModel = window.DS.Model.extend({
			'group': window.DS.belongsTo('organization-manager-group', { 'async': true, 'inverse': 'users' }),
			'user': window.DS.belongsTo('organization-manager-user', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerGroupUserModel;
	}
);

define(
	"twyrPortal/adapters/organization-manager-component-permission",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-component-permission');

		var OrganizationManagerComponentPermissionAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager/organization-manager-groups'
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