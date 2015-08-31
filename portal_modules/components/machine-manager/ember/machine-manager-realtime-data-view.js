define(
	"twyrPortal/components/machine-manager-realtime-data-machine-list",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/machine-manager-realtime-data-machine-list');

		var MachineManagerRealtimeDataMachineListComponent = window.Ember.Component.extend({
			'watch': function(machine) {
				machine.set('isWatched', true);
			},

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = MachineManagerRealtimeDataMachineListComponent;
	}
);

define(
	"twyrPortal/components/machine-manager-realtime-data-machine-tabs",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/machine-manager-realtime-data-machine-tabs');

		var MachineManagerRealtimeDataMachineTabsComponent = window.Ember.Component.extend({
			'streamer': null,

			'didInsertElement': function() {
				this._super();

				var self = this,
					streamer = window.Primus.connect(window.apiServer, {
						'strategy': 'online, disconnect',
						'ping': 3000,
						'pong': 6000
					});

				streamer.on('open', function() {
					streamer.on('data', self._machineDataProcessor.bind(self));
					self.set('streamer', streamer);
				});

				streamer.on('reconnected', function() {
					streamer.on('data', self._machineDataProcessor.bind(self));
					self.set('streamer', streamer);
				});

				streamer.on('close', function() {
					self.set('streamer', null);
				});

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					var activeTab = self.$('li.active');
					if(!activeTab) return;

					if(!activeTab.length) {
						var firstTab = self.$('ul.nav li:first-child a')[0];
						self.$(firstTab).click();
					}
				});
			},

			'willDestroyElement': function() {
				if(this.get('streamer')) {
					this.get('streamer').end();
					this.set('streamer', null);
				}

				return true;
			},

			'_machineDataProcessor': function(machineData) {
				if(!machineData) return;

				if(window.developmentMode) console.log('twyrPortal/components/machine-manager-realtime-data-machine-tabs::_machineDataProcessor:\n', machineData);

				// Non-aggregate, real-time data
				if(machineData.machineId.indexOf('!Aggregate!Data') < 0) {
					var machineModel = (this.get('model').filterBy('tenantMachineId', machineData.machineId))[0],
						tags = machineModel.get('tags');

					tags.forEach(function(tag) {
						var tagValue = machineData.data[tag.get('name')];
						if(tagValue) tag.set('value', tagValue);
					});
				}
				else {
					machineData.machineId = machineData.machineId.replace('!Aggregate!Data', '');

					var machineId = machineData.machineId.substring(0, machineData.machineId.indexOf('!')),
						aggregateType = (machineData.machineId.substring(1 + machineData.machineId.indexOf('!'))).toLowerCase();

					var machineRecords = this.get('model').filterBy('tenantMachineId', machineId);
					for(var midx = 0; midx < machineRecords.length; midx++) {
						var thisMachine = machineRecords[midx];
		
						var aggregateRecords = thisMachine.get(aggregateType + 'Aggregates'),
							aggregateList = aggregateRecords.toArray();
		
						aggregateList.forEach(function(currAggregateDataRecord) {
							if(currAggregateDataRecord) {
								currAggregateDataRecord.deleteRecord();
								aggregateRecords.removeObject(currAggregateDataRecord);
							}
						});
		
						for(var didx = 0; didx < machineData.data.length; didx++) {
							var thisData = { 'id': app.default.generateUUID(), 'ago': didx, 'aggregateData': JSON.stringify(machineData.data[didx]) };
							thisMachine.get(aggregateType + 'Aggregates').addObject(this.store.createRecord('machine-manager-aggregate', thisData));
						}
					}
				}
			},

			'unwatch': function(machine) {
				this.get('streamer').write({
					'command': 'unsubscribe',
					'machineId': machine.get('tenantMachineId')
				});

				machine.set('isWatched', false);

				var self = this;
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					var activeTab = self.$('li.active');
					if(!activeTab) return;

					if(!activeTab.length) {
						var firstTab = self.$('ul.nav li:first-child a')[0];
						self.$(firstTab).click();
					}
				});
			},

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = MachineManagerRealtimeDataMachineTabsComponent;
	}
);


define(
	"twyrPortal/components/machine-manager-realtime-data-default-display",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/machine-manager-realtime-data-default-display');

		var MachineManagerRealtimeDataDefaultDisplayComponent = window.Ember.Component.extend({
			'_initialize': function() {
				var self = this;
				if(!self.get('model'))
					return true;

				self.get('model').get('tags').forEach(function(tag) {
					self.set(tag.get('name'), tag);
				});

				var computedPropertyMethods = window.Ember.ArrayProxy.create({ 'content': window.Ember.A([]) });
				self.get('model').get('computed').forEach(function(thisComputed) {
					var parsedExpression = window.math.parse(thisComputed.get('expression'));
					parsedExpression.transform(function(node, path, parent) {
						if(node.type == 'SymbolNode')
							node.name = ('this.get(\'' + node.name + '\').get(\'value\')');

						return node;
					});

					var functionBody = 'var computedValue = ' + parsedExpression.toString() + ';\ncompProp.set(\'value\', computedValue);';
					var methodDefn = (new Function('compProp', functionBody));

					thisComputed.set('value', '0');
					computedPropertyMethods.addObject(methodDefn.bind(self, thisComputed));
					self.set(thisComputed.get('name'), thisComputed);
				});

				self.addObserver('model.tags.@each.value', function() {
					computedPropertyMethods.forEach(function(computedPropertyMethod) {
						computedPropertyMethod();
					});
				});

				if(!self.get('streamer'))
					return true;

				self.get('streamer').write({
					'command': 'subscribe',
					'machineId': self.get('model').get('tenantMachineId')
				});

				return true;
			}.on('init'),

			'_streamerChangeReactor': window.Ember.observer('streamer', function() {
				var self = this;
				if(!self.get('streamer'))
					return;

				self.get('streamer').write({
					'command': 'subscribe',
					'machineId': self.get('model').get('tenantMachineId')
				});
			})
		});

		exports['default'] = MachineManagerRealtimeDataDefaultDisplayComponent;
	}
);


define(
	"twyrPortal/components/machine-manager-realtime-data-non-default-display",
	["exports", "twyrPortal/components/machine-manager-realtime-data-default-display"],
	function(exports, baseComponent) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/machine-manager-realtime-data-non-default-display');

		var MachineManagerRealtimeDataNonDefaultDisplayComponent = baseComponent.default.extend({});

		exports['default'] = MachineManagerRealtimeDataNonDefaultDisplayComponent;
	}
);

