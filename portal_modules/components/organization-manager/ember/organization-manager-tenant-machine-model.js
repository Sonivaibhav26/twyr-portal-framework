define(
	"twyrPortal/adapters/organization-manager-machine",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-machine');

		var OrganizationManagerMachineAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerMachineAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-machine",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-machine');

		var OrganizationManagerMachineModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'manufacturer': window.DS.attr('string'),
			'category': window.DS.attr('string'),
			'model': window.DS.attr('string'),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerMachineModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-plc",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-plc');

		var OrganizationManagerPLCAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerPLCAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-plc",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-plc');

		var OrganizationManagerPLCModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'manufacturer': window.DS.attr('string'),
			'category': window.DS.attr('string'),
			'model': window.DS.attr('string'),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerPLCModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-protocol",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-protocol');

		var OrganizationManagerProtocolAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerProtocolAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-protocol",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-protocol');

		var OrganizationManagerProtocolModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'version': window.DS.attr('string'),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerProtocolModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-tenant-machine",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-tenant-machine');

		var OrganizationManagerTenantMachineAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerTenantMachineAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-tenant-machine",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-machine');

		var OrganizationManagerTenantMachineModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'tenant': window.DS.belongsTo('organization-manager-organization-structure', { 'async': true, 'inverse': 'machines' }),
			'users': window.DS.hasMany('organization-manager-tenant-machine-user', { 'async': true, 'inverse': 'tenantMachine' }),

			'emberComponent': window.DS.attr('string'),
			'emberTemplate': window.DS.attr('string'),

			'machine': window.DS.belongsTo('organization-manager-machine', { 'async': true, 'inverse': null }),
			'plc': window.DS.belongsTo('organization-manager-plc', { 'async': true, 'inverse': null }),
			'protocol': window.DS.belongsTo('organization-manager-protocol', { 'async': true, 'inverse': null }),

			'tags': window.DS.hasMany('organization-manager-tenant-machine-tag', { 'async': true, 'inverse': 'machine' }),
			'computed': window.DS.hasMany('organization-manager-tenant-machine-tag-computed', { 'async': true, 'inverse': 'machine' }),

			'smsAlert': window.DS.attr('boolean'),
			'pushAlert': window.DS.attr('boolean'),
			'emailAlert': window.DS.attr('boolean'),

			'statusAlert': window.DS.attr('boolean'),
			'statusAlertPeriod': window.DS.attr('number'),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerTenantMachineModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-tenant-machine-tag",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-tenant-machine-tag');

		var OrganizationManagerTenantMachineTagAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerTenantMachineTagAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-tenant-machine-tag",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-machine-tag');

		var OrganizationManagerTenantMachineTagModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'displayName': window.DS.attr('string'),

			'lowLowValue': window.DS.attr('string'),
			'lowValue': window.DS.attr('string'),
			'highValue': window.DS.attr('string'),
			'highHighValue': window.DS.attr('string'),

			'persist': window.DS.attr('boolean'),
			'persistFrequency': window.DS.attr('string', { 'defaultValue': 'none' }),
			'persistPeriod': window.DS.attr('number', { 'defaultValue': 0 }),

			'disablePersistence': window.Ember.computed('persist', {
				'get': function() {
					return !this.get('persist');
				}
			}),

			'machine': window.DS.belongsTo('organization-manager-tenant-machine', { 'async': true, 'inverse': 'tags' })
		});

		exports['default'] = OrganizationManagerTenantMachineTagModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-tenant-machine-tag-computed",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-tenant-machine-tag-computed');

		var OrganizationManagerTenantMachineTagComputedAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerTenantMachineTagComputedAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-tenant-machine-tag-computed",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-machine-tag-computed');

		var OrganizationManagerTenantMachineTagComputedModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'displayName': window.DS.attr('string'),
			'expression': window.DS.attr('string'),

			'lowLowValue': window.DS.attr('string'),
			'lowValue': window.DS.attr('string'),
			'highValue': window.DS.attr('string'),
			'highHighValue': window.DS.attr('string'),

			'persist': window.DS.attr('boolean'),
			'persistFrequency': window.DS.attr('string', { 'defaultValue': 'none' }),
			'persistPeriod': window.DS.attr('number', { 'defaultValue': 0 }),

			'disablePersistence': window.Ember.computed('persist', {
				'get': function() {
					return !this.get('persist');
				}
			}),

			'machine': window.DS.belongsTo('organization-manager-tenant-machine', { 'async': true, 'inverse': 'computed' })
		});

		exports['default'] = OrganizationManagerTenantMachineTagComputedModel;
	}
);


define(
	"twyrPortal/adapters/organization-manager-tenant-machine-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-tenant-machine-user');

		var OrganizationManagerTenantMachineUserAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerTenantMachineUserAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-tenant-machine-user",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-tenant-machine-user');

		var OrganizationManagerTenantMachineUserModel = window.DS.Model.extend({
			'tenantMachine': window.DS.belongsTo('organization-manager-tenant-machine', { 'async': true, 'inverse': 'users' }),
			'user': window.DS.belongsTo('organization-manager-organization-user', { 'async': true, 'inverse': null }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerTenantMachineUserModel;
	}
);
