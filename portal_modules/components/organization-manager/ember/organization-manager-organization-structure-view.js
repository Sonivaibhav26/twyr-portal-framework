define(
	"twyrPortal/components/organization-manager-organization-structure-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-tree');

		var OrganizationManagerOrganizationStructureTreeComponent = window.Ember.Component.extend({
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

		exports['default'] = OrganizationManagerOrganizationStructureTreeComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-organization",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-organization');

		var OrganizationManagerOrganizationStructureOrganizationComponent = window.Ember.Component.extend({
			'actions': {
				'add': function(entityType) {
					this.sendAction('controller-action', 'add-entity', {
						'id': this.get('model').get('id'),
						'type': entityType
					});
				},

				'save': function() {
					this.sendAction('controller-action', 'save-org', {
						'id': this.get('model').get('id'),
						'type': 'organization'
					});
				},

				'cancel': function() {
					this.get('model').rollbackAttributes();
				},

				'delete': function() {
					this.sendAction('controller-action', 'delete-org', {
						'id': this.get('model').get('id'),
						'type': 'organization'
					});
				},

				'controller-action': function(action, data) {
					this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureOrganizationComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-organization-structure-organization-users",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-organization-users');

		var OrganizationManagerOrganizationStructureOrganizationUsersComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				this._super();

				var self = this;
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.$('select').each(function(index, selectElem) {
						self._initSelect(self.$(selectElem));
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
					var userRelId = selectElem.attr('id').replace('organization-manager-organization-structure-organization-users-select-new-', '');

					self.sendAction('controller-action', 'save-user-rel', {
						'userId': selectElem.val(),
						'userRelId': userRelId
					});
				});
			},

			'actions': {
				'create': function(organization) {
				},

				'add': function(organization) {
					var self = this,
						newUserRelId = app.default.generateUUID();

					this.sendAction('controller-action', 'add-user-rel', {
						'organization': organization,
						'newUserRelId': newUserRelId
					});

					window.Ember.run.scheduleOnce('afterRender', this, function() {
						self._initSelect(self.$('select#organization-manager-organization-structure-organization-users-select-new-' + newUserRelId));
					});
				},

				'delete': function(organization, userRel) {
					this.sendAction('controller-action', 'delete-user-rel', {
						'organization': organization, 
						'userRel': userRel
					});
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureOrganizationUsersComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-organization-groups",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-organization-groups');

		var OrganizationManagerOrganizationStructureGroupsComponent = window.Ember.Component.extend({
			'currentModel': null,

			'_initialize': function() {
				this.set('currentModel', this.get('model'));
			}.on('init'),

			'selected-group-changed': function(data) {
				this.set('currentModel', data.group);
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

		exports['default'] = OrganizationManagerOrganizationStructureGroupsComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-groups-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-groups-tree');

		var OrganizationManagerOrganizationStructureGroupsTreeComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					var orgStructureTree = self.$('div.box-body div').jstree({
						'core': {
							'check_callback': true,
							'multiple': false,

							'data': {
								'url':window.apiServer + 'organization-manager/organizationStructureGroupsTree',
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
						if(!treeNode.node) return;

						var nodeId = treeNode.node.id.substring(0, treeNode.node.id.indexOf('--'));

						self.get('model').store.findRecord('organization-manager-organization-group', nodeId)
						.then(function(groupData) {
							self.set('currentModel', groupData);

							self.sendAction('controller-action', 'selected-group-changed', {
								'group': groupData
							});
						})
						.catch(function(err) {
							console.error(err);
						});
					});

					orgStructureTree.on('ready.jstree', function() {
						var rootNodeId = self.$('div.box-body div > ul > li:first-child').attr('id');
						self.$('div.box-body div').jstree('activate_node', rootNodeId, false, false);
					});
				});
			},

			'_modelNameChangeReactor': window.Ember.observer('currentModel.displayName', function(component, propertyName) {
				var selNodes = this.$('div.box-body div').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if((this.get('currentModel').get('id') + '--group') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				this.$('div.box-body div').jstree('rename_node', selNodes[selNodeIdx], this.get('currentModel').get('displayName'));
			}),

			'_modelContextChangeReactor': window.Ember.observer('currentModel.contextChange', function() {
				var self = this,
					newEntity = self.get('currentModel').get('contextChange');

				self.get('currentModel').set('contextChange', null);
				if(!newEntity) return;

				var parentNodeId = newEntity.get('parent').get('id') + '--group',
					parentNode = self.$('div.box-body div').jstree('get_node', parentNodeId);

				if(!self.$('div.box-body div').jstree('is_open', parentNode))
					self.$('div.box-body div').jstree('open_node', parentNode);

				parentNode = self.$('div.box-body div').jstree('get_node', parentNodeId);
				self.$('div.box-body div').jstree('create_node', parentNode, {
					'id': newEntity.get('id') + '--group',
					'text': newEntity.get('displayName'),
					'parent': parentNodeId,
					'children': true
				}, 'last', function() {
					self.$('div.box-body div').jstree('activate_node', newEntity.get('id') + '--group', false, false);
				});
			}),

			'_modelDeleteReactor': window.Ember.observer('currentModel.isDeleted', function() {
				if(this.get('currentModel').get('isDeleted') !== true) return;

				var selNodes = this.$('div.box-body div').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if((this.get('currentModel').get('id') + '--group') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				var parentNode = this.$('div.box-body div').jstree('get_node', selNodes[selNodeIdx].parents[0]);
				this.$('div.box-body div').jstree('delete_node', selNodes[selNodeIdx]);
				this.$('div.box-body div').jstree('activate_node', parentNode, false, false);
			})
		});

		exports['default'] = OrganizationManagerOrganizationStructureGroupsTreeComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-group-detail",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-group-detail');

		var OrganizationManagerOrganizationStructureGroupDetailComponent = window.Ember.Component.extend({
			'actions': {
				'save': function() {
					this.sendAction('controller-action', 'save-group', {
						'group': this.get('model')
					});
				},

				'cancel': function() {
					this.get('model').rollbackAttributes();
				},

				'delete': function() {
					this.sendAction('controller-action', 'delete-group', {
						'group': this.get('model')
					});
				},

				'add-subgroup': function() {
					this.sendAction('controller-action', 'add-group', {
						'parent': this.get('model')
					});
				},

				'delete-permission': function(permissionRel) {
					this.sendAction('controller-action', 'delete-permission', {
						'group': this.get('model'),
						'permissionRel': permissionRel
					});
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureGroupDetailComponent;
	}
);

