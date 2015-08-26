define(
	"twyrPortal/adapters/machine-manager-user-tenant-machine",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/machine-manager-user-tenant-machine');

		var MachineManagerUserTenantMachineAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'machine-manager'
		});

		exports['default'] = MachineManagerUserTenantMachineAdapter;
	}
);

define(
	"twyrPortal/models/machine-manager-user-tenant-machine",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/machine-manager-user-tenant-machine');

		var MachineManagerUserTenantMachineModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'tenantName': window.DS.attr('string'),

			'emberComponent': window.DS.attr('string'),
			'emberTemplate': window.DS.attr('string'),

			'machineManufacturer': window.DS.attr('string'),
			'machineCategory': window.DS.attr('string'),
			'machineModel': window.DS.attr('string'),

			'plcManufacturer': window.DS.attr('string'),
			'plcCategory': window.DS.attr('string'),
			'plcModel': window.DS.attr('string'),

			'protocolName': window.DS.attr('string'),
			'protocolVersion': window.DS.attr('string'),

			'tags': window.DS.hasMany('machine-manager-machine-tag', { 'async': true, 'inverse': 'machine' }),
			'computed': window.DS.hasMany('machine-manager-machine-tag-computed', { 'async': true, 'inverse': 'machine' }),

			'minuteAggregates': window.DS.hasMany('machine-manager-aggregate'),
			'hourAggregates': window.DS.hasMany('machine-manager-aggregate'),
			'dayAggregates': window.DS.hasMany('machine-manager-aggregate'),
			'monthAggregates': window.DS.hasMany('machine-manager-aggregate'),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = MachineManagerUserTenantMachineModel;
	}
);


define(
	"twyrPortal/adapters/machine-manager-machine-tag",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/machine-manager-machine-tag');

		var MachineManagerMachineTagAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'machine-manager'
		});

		exports['default'] = MachineManagerMachineTagAdapter;
	}
);

define(
	"twyrPortal/models/machine-manager-machine-tag",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/machine-manager-machine-tag');

		var MachineManagerMachineTagModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'displayName': window.DS.attr('string'),
			'value': window.DS.attr('string'),
			'alert': window.DS.attr('boolean'),

			'machine': window.DS.belongsTo('machine-manager-user-tenant-machine', { 'async': true, 'inverse': 'tags' })
		});

		exports['default'] = MachineManagerMachineTagModel;
	}
);


define(
	"twyrPortal/adapters/machine-manager-machine-tag-computed",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/machine-manager-machine-tag-computed');

		var MachineManagerMachineTagComputedAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'machine-manager'
		});

		exports['default'] = MachineManagerMachineTagComputedAdapter;
	}
);

define(
	"twyrPortal/models/machine-manager-machine-tag-computed",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/machine-manager-machine-tag-computed');

		var MachineManagerMachineTagComputedModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'displayName': window.DS.attr('string'),
			'value': window.DS.attr('string'),
			'alert': window.DS.attr('boolean'),

			'machine': window.DS.belongsTo('machine-manager-user-tenant-machine', { 'async': true, 'inverse': 'computed' })
		});

		exports['default'] = MachineManagerMachineTagComputedModel;
	}
);


define(
	"twyrPortal/adapters/machine-manager-aggregate",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/machine-manager-aggregate');

		var MachineManagerAggregateAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'machine-manager'
		});

		exports['default'] = MachineManagerAggregateAdapter;
	}
);

define(
	"twyrPortal/models/machine-manager-aggregate",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/machine-manager-aggregate');

		var MachineManagerAggregateModel = window.DS.Model.extend({
			'ago': window.DS.attr('number'),
			'aggregateData': window.DS.attr('string')
		});

		exports['default'] = MachineManagerAggregateModel;
	}
);
