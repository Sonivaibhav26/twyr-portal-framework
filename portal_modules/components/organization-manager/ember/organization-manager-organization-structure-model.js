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
			'partners': window.DS.hasMany('organization-manager-organization-partner', { 'async': true, 'inverse': 'tenant' }),
			'users': window.DS.hasMany('organization-manager-organization-user', { 'async': true, 'inverse': 'tenant' }),

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
			'tenant': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': 'partners' }),
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

define(
	"twyrPortal/adapters/organization-manager-organization-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-user');

		var OrganizationManagerOrganizationUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-user",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-user');

		var OrganizationManagerOrganizationUserModel = window.DS.Model.extend({
			'tenant': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': 'users' }),
			'user': window.DS.belongsTo('organization-manager-user', { 'async': true, 'inverse': 'tenants' }),

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
	"twyrPortal/adapters/organization-manager-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-user');

		var OrganizationManagerUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-user",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-user');

		var OrganizationManagerOrganizationUserModel = window.DS.Model.extend({
			'tenants': window.DS.hasMany('organization-manager-organization-user', { 'async': true, 'inverse': 'user' }),

			'firstName': window.DS.attr('string'),
			'lastName': window.DS.attr('string'),
			'email': window.DS.attr('string'),

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

		exports['default'] = OrganizationManagerOrganizationUserModel;
	}
);
