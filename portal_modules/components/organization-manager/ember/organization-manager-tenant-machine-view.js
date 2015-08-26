define(
	"twyrPortal/components/organization-manager-tenant-machine-management-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-tenant-machine-management-tree');

		var OrganizationManagerTenantMachineManagementTreeComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					var orgStructureTree = self.$('div.box-body div').jstree({
						'core': {
							'check_callback': true,
							'multiple': false,

							'data': {
								'url':window.apiServer + 'organization-manager/organizationStructureTree',
								'dataType': 'json',
								'data': function(node) {
									return { 'id': (node ? node.id : null) };
								}
							},

							'themes': {
								'icons': false,
								'name': 'bootstrap'
							}
						}
					});

					orgStructureTree.on('activate_node.jstree', function(event, treeNode) {
						var nodeId = treeNode.node.id,
							entityType = 'organization';

						if(treeNode.node.parent.indexOf('--') > 0) {
							nodeId = treeNode.node.id;
							entityType = treeNode.node.parent.substring(2 + treeNode.node.parent.indexOf('--'));
						}

						if(treeNode.node.id.indexOf('--') > 0) {
							nodeId = treeNode.node.id.substring(0, treeNode.node.id.indexOf('--'));
							entityType = 'list-' + treeNode.node.id.substring(2 + treeNode.node.id.indexOf('--'));
						}

						self.sendAction('controller-action', 'selected-org-changed', {
							'id': nodeId,
							'type': entityType
						});
					});

					orgStructureTree.on('ready.jstree', function() {
						var rootNodeId = self.$('div.box-body div > ul > li:first-child').attr('id');
						self.$('div.box-body div').jstree('activate_node', rootNodeId, false, false);
					});
				});
			},

			'_modelNameChangeReactor': window.Ember.observer('model.name', function(component, propertyName) {
				var selNodes = this.$('div.box-body div').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('model').get('id') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				if(propertyName == 'model.name') {
					this.$('div.box-body div').jstree('rename_node', selNodes[selNodeIdx], this.get('model').get('name'));
				}

				if((propertyName == 'model.partner.name') && (this.get('model').get('partner'))){
					this.$('div.box-body div').jstree('rename_node', selNodes[selNodeIdx], this.get('model').get('partner').get('name'));
				}
			}),

			'_modelContextChangeReactor': window.Ember.observer('model.contextChange', function() {
				var self = this,
					newEntity = self.get('model').get('contextChange');

				self.get('model').set('contextChange', null);
				if(!newEntity) return;

				var parentNodeId = (newEntity.get('parent') || newEntity.get('tenant')).get('id');
				if(newEntity.get('isOrganization') == true) {
					parentNodeId = parentNodeId + '--subsidiaries';
				}

				if(newEntity.get('isDepartment') == true) {
					parentNodeId = parentNodeId + '--departments';
				}

				var parentNode = self.$('div.box-body div').jstree('get_node', (newEntity.get('parent') || newEntity.get('tenant')).get('id'));
				if(!self.$('div.box-body div').jstree('is_open', parentNode))
					self.$('div.box-body div').jstree('open_node', parentNode);

				parentNode = self.$('div.box-body div').jstree('get_node', parentNodeId);
				self.$('div.box-body div').jstree('create_node', parentNode, {
					'id': newEntity.get('id'),
					'text': newEntity.get('name') || newEntity.get('partner').get('name'),
					'parent': parentNodeId,
					'children': true
				}, 'last', function() {
					self.$('div.box-body div').jstree('activate_node', newEntity.get('id'), false, false);
				});
			}),

			'_modelDeleteReactor': window.Ember.observer('model.isDeleted', function() {
				if(this.get('model').get('isDeleted') !== true) return;

				var selNodes = this.$('div.box-body div').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('model').get('id') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				var parentNode = this.$('div.box-body div').jstree('get_node', selNodes[selNodeIdx].parents[1]);
				this.$('div.box-body div').jstree('delete_node', selNodes[selNodeIdx]);
				this.$('div.box-body div').jstree('activate_node', parentNode, false, false);
			})
		});

		exports['default'] = OrganizationManagerTenantMachineManagementTreeComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-tenant-machine-management-machine-tags",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-tenant-machine-management-machine-tags');

		var OrganizationManagerTenantMachineManagementMachineTagsComponent = window.Ember.Component.extend({
			'actions': {
				'delete-tag': function(machine, tag) {
					tag.deleteRecord();
					machine.get('tags').removeObject(tag);
				},
	
				'delete-computed-tag': function(machine, tag) {
					tag.deleteRecord();
					machine.get('computed').removeObject(tag);
				}
			}
		});

		exports['default'] = OrganizationManagerTenantMachineManagementMachineTagsComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-tenant-machine-management-machine-users",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-tenant-machine-management-machine-users');

		var OrganizationManagerTenantMachineManagementMachineTagsComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				this._initSelect2Boxes();
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				this._initSelect2Boxes();
			}),

			'_initSelect2Boxes': function() {
				var self = this;
				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self.get('model').get('users').forEach(function(machineUser) {
						if(!machineUser.get('isNew')) return;

						console.log('New User: ' + machineUser.get('id'));
						self._initSelect(self.$('select#organization-manager-tenant-machine-management-machine-users-select-' + machineUser.get('id')));
					});
				});
			},

			'_initSelect': function(selectElem) {
				var self = this;
				selectElem.select2({
					'ajax': {
						'delay': 250,
						'dataType': 'json',

						'url': window.apiServer + 'masterdata/emails',

						'data': function (params) {
							var queryParameters = {
								'filter': params.term
							}

							return queryParameters;
						},

						'processResults': function (data) {
							var processedResult =  {
								'results': window.Ember.$.map(data, function(item) {
									return {
										'text': item.email,
										'slug': item.email + ' (' + item.name + ')',
										'id': item.id
									};
								})
							};

							return processedResult;
						},

						'cache': true
					},

					'minimumInputLength': 2,
					'minimumResultsForSearch': 10,

					'allowClear': true,
					'closeOnSelect': true,

					'placeholder': 'root@twyrportal.com'
				})
				.on('change', function() {
					var userRelId = selectElem.attr('id').replace('select#organization-manager-tenant-machine-management-machine-users-select-', '');

					self.sendAction('controller-action', 'save-tenant-machine-user', {
						'userId': selectElem.val(),
						'userTenantMachineId': userRelId
					});
				});
			},

			'actions': {
				'delete-tenant-machine-user': function(machine, user) {
					this.sendAction('controller-action', 'delete-tenant-machine-user', {
						'tenantMachine': machine,
						'user': user
					});
				},

				'add-machine-user': function(machine) {
					var newUserId = app.default.generateUUID();
					this.sendAction('controller-action', 'add-tenant-machine-user', {
						'userId': newUserId,
						'tenantMachine': machine
					});

					var self = this;
					window.Ember.run.scheduleOnce('afterRender', this, function() {
						self._initSelect(self.$('select#organization-manager-tenant-machine-management-machine-users-select-' + newUserId));
					});
				}
			}
		});

		exports['default'] = OrganizationManagerTenantMachineManagementMachineTagsComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-tenant-machine-management-machine",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-tenant-machine-management-machine');

		var OrganizationManagerTenantMachineManagementMachineComponent = window.Ember.Component.extend({
			'willClearRender': function() {
				this.get('model').get('machines').forEach(function(tenantMachine) {
					tenantMachine.set('isSelected', false);
				});

				return true;
			},

			'actions': {
				'delete': function(organization, machine) {
					this.sendAction('controller-action', 'delete-machine', {
						'organization': organization,
						'machine': machine
					});
				},

				'select-machine': function(organization, machine) {
					organization.get('machines').forEach(function(tenantMachine) {
						tenantMachine.set('isSelected', false);
					});

					var self = this;
					window.Ember.run.scheduleOnce('afterRender', self, function() {
						machine.set('isSelected', true);
						self.set('currentlySelectedMachine', machine);
					});
				},

				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = OrganizationManagerTenantMachineManagementMachineComponent;
	}
);

