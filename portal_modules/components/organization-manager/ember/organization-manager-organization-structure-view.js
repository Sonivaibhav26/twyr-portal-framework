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
			}),

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
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

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
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
			'willClearRender': function() {
				var self = this;
				self._super();

				if(self.get('currentlySelectedUser')) {
					self.get('currentlySelectedUser').set('isCurrentlySelected', false);
				}

				self.set('currentlySelectedUser', null);
				self.get('model').get('users').forEach(function(thisUserRel) {
					if(!thisUserRel.get('user').get('isLoaded'))
						return;

					thisUserRel.get('user').set('isCurrentlySelected', false);
				});
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				var self = this;
				if(self.get('currentlySelectedUser')) {
					self.get('currentlySelectedUser').set('isCurrentlySelected', false);
				}

				self.set('currentlySelectedUser', null);
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.$('select').each(function(index, selectElem) {
						if(self.$(selectElem).attr('id').indexOf('new-user-group') >= 0)
							return;

						self._initSelect(self.$(selectElem));
					});

					var firstLoadedUser = null;
					self.get('model').get('users').forEach(function(thisUserRel) {
						if(!thisUserRel.get('user').get('isLoaded'))
							return;

						thisUserRel.get('user').set('isCurrentlySelected', false);
						if(!firstLoadedUser) firstLoadedUser = thisUserRel.get('user');

					});

					if(firstLoadedUser) {
						self.$('tr#organization-manager-organization-structure-organization-users-tr-' + firstLoadedUser.get('id')).click();
					}
				});
			}),
			
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
					var userRelId = selectElem.attr('id').replace('organization-manager-organization-structure-organization-users-select-new-', ''),
						cachedUser = null;

					self.sendAction('controller-action', 'save-user-rel', {
						'userId': selectElem.val(),
						'userRelId': userRelId
					});

					if(self.get('currentlySelectedUser')) {
						cachedUser = self.get('currentlySelectedUser');
						cachedUser.set('isCurrentlySelected', false);

						self.set('currentlySelectedUser', null);
					}

					window.Ember.run.scheduleOnce('afterRender', self, function() {
						if(!cachedUser) return;
						self.$('tr#organization-manager-organization-structure-organization-users-tr-' + cachedUser.get('id')).click();
					});
				});
			},

			'_initGroupSelect': function(selectElem) {
				var self = this;
				selectElem.select2({
					'ajax': {
						'delay': 250,
						'dataType': 'json',

						'url': window.apiServer + 'masterdata/userGroups',

						'data': function (params) {
							var queryParameters = {
								'tenantId': self.get('model').get('id'),
								'userId': self.get('currentlySelectedUser').get('id'),
								'filter': params.term
							}

							return queryParameters;
						},

						'processResults': function (data) {
							var processedResult =  {
								'results': window.Ember.$.map(data, function(item) {
									return {
										'text': item.display_name,
										'slug': item.display_name,
										'id': item.id
									};
								})
							};

							return processedResult;
						},

						'cache': true
					},

					'minimumInputLength': 0,
					'minimumResultsForSearch': 10,

					'allowClear': true,
					'closeOnSelect': true,

					'placeholder': 'Group Name'
				})
				.on('change', function() {
					var groupRelId = selectElem.attr('id').replace('organization-manager-organization-structure-organization-users-select-new-user-group-', '');

					self.sendAction('controller-action', 'save-user-group', {
						'groupId': selectElem.val(),
						'groupRelId': groupRelId
					});
				});
			},

			'create': function(organization) {
				var email = self.$('input#organization-manager-organization-structure-organization-users-input-email').val(),
					firstName = self.$('input#organization-manager-organization-structure-organization-users-input-first-name').val(),
					lastName  = self.$('input#organization-manager-organization-structure-organization-users-input-last-name').val();

				this.sendAction('controller-action', 'create-user-rel', {
					'organization': organization,
					'email': email,
					'firstName': firstName,
					'lastName': lastName
				});

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.$('input#organization-manager-organization-structure-organization-users-input-email').val('');
					self.$('input#organization-manager-organization-structure-organization-users-input-first-name').val('');
					self.$('input#organization-manager-organization-structure-organization-users-input-last-name').val('');
				});
			},

			'add': function() {
				var self = this,
					newUserRelId = app.default.generateUUID();

				this.sendAction('controller-action', 'add-user-rel', {
					'organization': this.get('model'),
					'newUserRelId': newUserRelId
				});

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self._initSelect(self.$('select#organization-manager-organization-structure-organization-users-select-new-' + newUserRelId));
				});
			},

			'delete': function(userRel) {
				this.set('currentlySelectedUser', null);
				this.sendAction('controller-action', 'delete-user-rel', {
					'organization': this.get('model'), 
					'userRel': userRel
				});
			},

			'select': function(userRel) {
				if(this.get('currentlySelectedUser')) {
					this.get('currentlySelectedUser').set('isCurrentlySelected', false);
				}

				this.set('currentlySelectedUser', null);
				this.get('model').get('users').forEach(function(thisUserRel) {
					if(!thisUserRel.get('user').get('isLoaded'))
						return;

					thisUserRel.get('user').set('isCurrentlySelected', false);
				});

				userRel.get('user').set('isCurrentlySelected', true);
				this.set('currentlySelectedUser', userRel.get('user'));

				var self = this;
				userRel.get('user').get('groups').forEach(function(userGroup) {
					if(userGroup.get('tenant') == self.get('model').get('id')) {
						userGroup.set('belongsToTenant', true);
					}
					else {
						userGroup.set('belongsToTenant', false);
					}
				});

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self.$('select').each(function(index, selectElem) {
						if(self.$(selectElem).attr('id').indexOf('new-user-group') >= 0)
							self._initGroupSelect(self.$(selectElem));
					});
				});
			},

			'add-user-group': function(user) {
				var self = this,
					userGroupId = app.default.generateUUID();

				self.sendAction('controller-action', 'add-user-group', {
					'tenant': self.get('model').get('id'),
					'user': user,
					'userGroupId': userGroupId
				});

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					var selectElem = self.$('select#organization-manager-organization-structure-organization-users-select-new-user-group-' + userGroupId);
					self._initGroupSelect(self.$(selectElem));
				});
			},

			'delete-user-group': function(userGroup) {
				this.sendAction('controller-action', 'delete-user-group', {
					'user': this.get('currentlySelectedUser'),
					'userGroup': userGroup
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

			'_modelChangeReactor': window.Ember.observer('model', function() {
				this.set('currentModel', this.get('model'));
			}),

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
				self._initTree();
			},

			'_initTree': function() {
				var self = this;

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					var orgStructureTree = self.$('div.box-body div').jstree({
						'core': {
							'check_callback': true,
							'multiple': false,

							'data': {
								'url':window.apiServer + 'organization-manager/organizationStructureGroupsTree',
								'dataType': 'json',
								'data': function(node) {
									var tenantId = (self.get('model') && self.get('model').get('tenant')) ? self.get('model').get('tenant').get('id') : self.get('model').get('id');
									return {
										'tenantId': tenantId,
										'groupId': (node ? node.id : '#')
									};
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

						self.get('model').store.findRecord('organization-manager-organization-group', treeNode.node.id)
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

					orgStructureTree.on('refresh.jstree', function() {
						var rootNodeId = self.$('div.box-body div > ul > li:first-child').attr('id');
						self.$('div.box-body div').jstree('activate_node', rootNodeId, false, false);
					});
				});
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				var self = this;

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self.$('div.box-body div').jstree(true).refresh();
				});
			}),

			'_modelNameChangeReactor': window.Ember.observer('currentModel.displayName', function() {
				var selNodes = this.$('div.box-body div').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('currentModel').get('id') != selNodes[idx].id)
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

				var parentNodeId = newEntity.get('parent').get('id'),
					parentNode = self.$('div.box-body div').jstree('get_node', parentNodeId);

				if(!self.$('div.box-body div').jstree('is_open', parentNode))
					self.$('div.box-body div').jstree('open_node', parentNode);

				parentNode = self.$('div.box-body div').jstree('get_node', parentNodeId);
				self.$('div.box-body div').jstree('create_node', parentNode, {
					'id': newEntity.get('id'),
					'text': newEntity.get('displayName'),
					'parent': parentNodeId,
					'children': true
				}, 'last', function() {
					self.$('div.box-body div').jstree('activate_node', newEntity.get('id'), false, false);
				});
			}),

			'_modelDeleteReactor': window.Ember.observer('currentModel.isDeleted', function() {
				if(this.get('currentModel').get('isDeleted') !== true) return;

				var selNodes = this.$('div.box-body div').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('currentModel').get('id') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				var parentNode = this.$('div.box-body div').jstree('get_node', selNodes[selNodeIdx].parents[0]);
				this.$('div.box-body div').jstree('delete_node', selNodes[selNodeIdx]);
				this.$('div.box-body div').jstree('activate_node', parentNode, false, false);
			}),

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
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

			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureGroupDetailComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-group-permissions",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-group-permissions');

		var OrganizationManagerOrganizationStructureGroupPermissionsComponent = window.Ember.Component.extend({
			'onModelChange': window.Ember.observer('model', function() {
				var self = this;
				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self.$('select').each(function(index, selectElem) {
						self._initSelect(self.$(selectElem));
					})
				});
			}),

			'_initSelect': function(selectElem) {
				var self = this;
				selectElem.select2({
					'ajax': {
						'delay': 250,
						'dataType': 'json',

						'url': window.apiServer + 'masterdata/groupPermissions',

						'data': function (params) {
							var queryParameters = {
								'groupId': self.get('model').get('id'),
								'parentId': self.get('model').get('parent').get('id'),
								'filter': params.term
							}

							return queryParameters;
						},

						'processResults': function (data) {
							var processedResult =  {
								'results': window.Ember.$.map(data, function(item) {
									return {
										'text': item.name,
										'slug': item.name,
										'id': item.id
									};
								})
							};

							return processedResult;
						},

						'cache': true
					},

					'minimumInputLength': 0,
					'minimumResultsForSearch': 10,

					'allowClear': true,
					'closeOnSelect': true,

					'placeholder': 'Permission Name'
				})
				.on('change', function() {
					var permissionRelId = selectElem.attr('id').replace('organization-manager-organization-structure-group-permissions-select-', '');

					self.sendAction('controller-action', 'save-permission', {
						'group': self.get('model'),
						'permissionRelId': permissionRelId,
						'permissionId': selectElem.val()
					});
				});
			},

			'add-permission': function(permissionRel) {
				var newRelId = app.default.generateUUID();
				this.sendAction('controller-action', 'add-permission', {
					'newRelId': newRelId,
					'group': this.get('model')
				});

				var self = this;
				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self._initSelect(self.$('select#organization-manager-organization-structure-group-permissions-select-' + newRelId));
				});
			},

			'delete-permission': function(permissionRel) {
				this.sendAction('controller-action', 'delete-permission', {
					'group': this.get('model'),
					'permissionRel': permissionRel
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

		exports['default'] = OrganizationManagerOrganizationStructureGroupPermissionsComponent;
	}
);
