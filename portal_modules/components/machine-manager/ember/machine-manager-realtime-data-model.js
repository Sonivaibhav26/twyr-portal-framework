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
			'tenantMachineId': window.DS.attr('string'),

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

			'lowLowValue': window.DS.attr('number'),
			'lowValue': window.DS.attr('number'),
			'highValue': window.DS.attr('number'),
			'highHighValue': window.DS.attr('number'),

			'value': window.DS.attr('number'),

			'lowlowalert': window.DS.attr('boolean'),
			'lowalert': window.DS.attr('boolean'),
			'noalert': window.DS.attr('boolean'),
			'highalert': window.DS.attr('boolean'),
			'highhighalert': window.DS.attr('boolean'),

			'machine': window.DS.belongsTo('machine-manager-user-tenant-machine', { 'async': true, 'inverse': 'tags' }),

			'setAlert': window.Ember.observer('value', function() {
				this.set('lowlowalert', false);
				this.set('lowalert', false);
				this.set('noalert', true);
				this.set('highalert', false);
				this.set('highhighalert', false);

				if(this.get('value') < this.get('lowLowValue')) {
					this.set('noalert', false);
					this.set('lowlowalert', true);
					return;
				}

				if(this.get('value') < this.get('lowValue')) {
					this.set('noalert', false);
					this.set('lowalert', true);
					return;
				}

				if(this.get('value') > this.get('highHighValue')) {
					this.set('noalert', false);
					this.set('highhighalert', true);
					return;
				}

				if(this.get('value') > this.get('highValue')) {
					this.set('noalert', false);
					this.set('highalert', true);
					return;
				}
			})
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
			'expression':  window.DS.attr('string'),

			'lowLowValue': window.DS.attr('number'),
			'lowValue': window.DS.attr('number'),
			'highValue': window.DS.attr('number'),
			'highHighValue': window.DS.attr('number'),

			'value': window.DS.attr('number'),
			'alert': window.DS.attr('boolean'),

			'machine': window.DS.belongsTo('machine-manager-user-tenant-machine', { 'async': true, 'inverse': 'computed' }),

			'setAlert': window.Ember.observer('value', function() {
				this.set('lowlowalert', false);
				this.set('lowalert', false);
				this.set('noalert', true);
				this.set('highalert', false);
				this.set('highhighalert', false);

				if(this.get('value') < this.get('lowLowValue')) {
					this.set('noalert', false);
					this.set('lowlowalert', true);
					return;
				}

				if(this.get('value') < this.get('lowValue')) {
					this.set('noalert', false);
					this.set('lowalert', true);
					return;
				}

				if(this.get('value') > this.get('highHighValue')) {
					this.set('noalert', false);
					this.set('highhighalert', true);
					return;
				}

				if(this.get('value') > this.get('highValue')) {
					this.set('noalert', false);
					this.set('highalert', true);
					return;
				}
			})
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
