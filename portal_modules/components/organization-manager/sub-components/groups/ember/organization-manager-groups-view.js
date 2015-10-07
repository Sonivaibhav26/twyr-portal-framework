define(
	"twyrPortal/components/organization-manager-groups-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-groups-tree');

		var OrganizationManagerGroupsTreeComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					// If model is NULL, return...
					if(!self.get('tenantModel'))
						return;

					self._createTree(self.get('tenantModel').get('id'));
				});
			},

			'_createTree': function(tenantId) {
				var self = this;

				// Create the new tree
				var orgGroupTree = self.$('div#organization-manager-groups-tree-container').jstree({
					'core': {
						'check_callback': true,
						'multiple': false,

						'data': {
							'url':window.apiServer + 'organization-manager/organization-manager-groups/organization-manager-groups-tree',
							'dataType': 'json',
							'data': function(node) {
								return { 
									'tenant': tenantId,
									'group': (node ? node.id : null)
								};
							}
						},

						'themes': {
							'icons': false,
							'name': 'bootstrap'
						}
					}
				});

				orgGroupTree.on('activate_node.jstree', function(event, treeNode) {
					self.sendAction('controller-action', 'selected-group-changed', {
						'id': treeNode.node.id
					});
				});

				orgGroupTree.on('ready.jstree', function() {
					var rootNodeId = self.$('div#organization-manager-groups-tree-container > ul > li:first-child').attr('id');
					self.$('div#organization-manager-groups-tree-container').jstree('activate_node', rootNodeId, false, false);
				});
			},

			'_tenantModelChangeReactor': window.Ember.observer('tenantModel', function() {
				var self = this;

				self.$('div#organization-manager-groups-tree-container').jstree('destroy');
				self._createTree(self.get('tenantModel').get('id'));
			}),

			'_modelChangeReactor': window.Ember.observer('model', function() {
				var self = this,
					newEntity = self.get('model'),
					newEntityNode = null;

				// If model is NULL, return...
				if(!newEntity) return;

				// If user selected an existing organization, simply open it and return
				newEntityNode = self.$('div#organization-manager-groups-tree-container').jstree('get_node', newEntity.get('id'));
				if(newEntityNode) {
					self.$('div#organization-manager-groups-tree-container').jstree('open_node', newEntityNode);
					return;
				}

				// If user created a new organization, add node, then open it, and finally return
				var parentNodeId = newEntity.get('parent').get('id');

				var parentNode = self.$('div#organization-manager-groups-tree-container').jstree('get_node', parentNodeId);
				if(!self.$('div#organization-manager-groups-tree-container').jstree('is_open', parentNode))
					self.$('div#organization-manager-groups-tree-container').jstree('open_node', parentNode);

				self.$('div#organization-manager-groups-tree-container').jstree('create_node', parentNode, {
					'id': newEntity.get('id'),
					'text': newEntity.get('name'),
					'parent': parentNodeId,
					'children': true
				}, 'last', function() {
					self.$('div#organization-manager-groups-tree-container').jstree('activate_node', newEntity.get('id'), false, false);
				});
			}),

			'_modelNameChangeReactor': window.Ember.observer('model.name', function(component, propertyName) {
				var selNodes = this.$('div#organization-manager-groups-tree-container').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('model').get('id') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				this.$('div#organization-manager-groups-tree-container').jstree('rename_node', selNodes[selNodeIdx], this.get('model').get('name'));
			}),

			'_modelDeleteReactor': window.Ember.observer('model.isDeleted', function() {
				if(this.get('model').get('isDeleted') === true) {
					var selNodes = this.$('div#organization-manager-groups-tree-container').jstree('get_selected', true),
						selNodeIdx = null;
	
					for(var idx = 0; idx < selNodes.length; idx++){
						if(this.get('model').get('id') != selNodes[idx].id)
							continue;
	
						selNodeIdx = idx;
						break;
					}
	
					if(selNodeIdx === null)
						return;
	
					var parentNode = this.$('div#organization-manager-groups-tree-container').jstree('get_node', selNodes[selNodeIdx].parent);

					window.Ember.run.scheduleOnce('afterRender', this, function() {
						if(selNodes[selNodeIdx]) {
							this.$('div#organization-manager-groups-tree-container').jstree('delete_node', selNodes[selNodeIdx]);
						}

						if(parentNode) {
							this.$('div#organization-manager-groups-tree-container').jstree('activate_node', parentNode, false, false);
						}
					});
				}
				else {
					// TODO: Handle un-delete case...
				}
			}),

			'_deleteTreeNodeChangeReactor': window.Ember.observer('deleteTreeNode', function() {
				if(!this.get('deleteTreeNode'))
					return;

				var self = this,
					deleteNode = self.$('div#organization-manager-groups-tree-container').jstree('get_node', self.get('deleteTreeNode')),
					parentNode = self.$('div#organization-manager-groups-tree-container').jstree('get_node', deleteNode.parent);

				if(deleteNode) {
					self.$('div#organization-manager-groups-tree-container').jstree('delete_node', deleteNode);
				}

				if(parentNode) {
					self.$('div#organization-manager-groups-tree-container').jstree('activate_node', parentNode, false, false);
				}
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

		exports['default'] = OrganizationManagerGroupsTreeComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-groups",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-groups');

		var OrganizationManagerGroupsComponent = window.Ember.Component.extend({
			'_modelChangeReactor': window.Ember.observer('model', function() {
				var self = this;

				if(!this.get('model')) {
					this.set('currentModel', null);
					return;
				}

				this.get('model').store.query('organization-manager-group', { 'tenant': this.get('model').get('id') })
				.catch(function(err) {
					console.error('Error fetching groups for Tenant: ' + self.get('model').get('id') + '\n', err);
				});
			}),

			'selected-group-changed': function(data) {
				var newGroupId = data.id,
					self = this;
				
				this.get('model').store
				.find('organization-manager-group', newGroupId)
				.then(function(group) {
					self.set('currentModel', group);
				})
				.catch(function(err) {
					console.error('Error retrieving group information for id: ' + newGroupId, err);
				});
			},

			'add-group': function(parentGroup) {
				var newSubgroup = parentGroup.store.createRecord('organization-manager-group', {
					'id': app.default.generateUUID(),
					'name': 'New subgroup of ' + parentGroup.get('name'),
					'tenant': parentGroup.get('tenant'),
					'parent': parentGroup,
				});

				parentGroup.get('subgroups').addObject(newSubgroup);
				this.set('currentModel', newSubgroup);
			},

			'save-group': function(group) {
				var self = this;

				group.save()
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': group.get('name') + ' group information has been saved' });
				})
				.catch(function(err) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': group });
					group.rollbackAttributes();
				});
			},

			'delete-group': function(group) {
				var self = this,
					groupName = group.get('name'),
					parentGroup = group.get('parent'),
					delFn = function() {
						group.destroyRecord()
						.then(function() {
							if(parentGroup) {
								parentGroup.get('subgroups').removeObject(group);
							}

							if(self.get('model').get('id') != group.get('id')) {
								self.set('deleteTreeNode', group.get('id'));
							}

							return;
						})
						.then(function() {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': groupName + ' group information has been deleted' });
						})
						.catch(function(err) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': group });
							group.rollbackAttributes();
						});
					};

				if(group.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + groupName + '"</strong>?',
						'title': 'Delete <strong>' + groupName + '</strong>?',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-group-permission': function(data) {
				var newPermissionId = data.groupPermissionId,
					newPermission = data.group.store.createRecord('organization-manager-group-permission', {
						'id': newPermissionId,
						'group': data.group
					});

				data.group.get('permissions').addObject(newPermission);
			},

			'save-group-permission': function(data) {
				var groupPermissionId = data.groupPermissionId,
					permissionId = data.permissionId,
					self = this;

				var groupPermission = this.get('model').store.peekRecord('organization-manager-group-permission', groupPermissionId);

				this.get('model').store.find('organization-manager-component-permission', permissionId)
				.then(function(componentPermission) {
					groupPermission.set('permission', componentPermission);
					return groupPermission.save();
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': groupPermission.get('permission').get('displayName') + ' permission has been added to the ' + groupPermission.get('group').get('name') + ' group' });
				})
				.catch(function(err) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': groupPermission });
					groupPermission.rollbackAttributes();
				});
			},

			'delete-group-permission': function(groupPermission) {
				var self = this,
					permissionName = groupPermission.get('permission').get('displayName'),
					parentGroup = groupPermission.get('group'),
					delFn = function() {
						groupPermission.destroyRecord()
						.then(function() {
							if(parentGroup) {
								parentGroup.get('permissions').removeObject(groupPermission);
							}

							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': permissionName + ' permission has been revoked from ' + parentGroup.get('name') + ' group' });
						})
						.catch(function(err) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': groupPermission });
							groupPermission.rollbackAttributes();
						});
					};

				if(groupPermission.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to revoke <strong>"' + permissionName + '"</strong> permission from the ' + parentGroup.get('name') + ' group?',
						'title': 'Delete <strong>' + permissionName + '</strong>?',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-group-user': function(data) {
				var newUserId = data.groupUserId,
					newUser = data.group.store.createRecord('organization-manager-group-user', {
						'id': newUserId,
						'group': data.group
					});

				data.group.get('users').addObject(newUser);
			},

			'save-group-user': function(data) {
				var userId = data.userId,
					groupUserId = data.groupUserId,
					self = this;

				var groupUser = this.get('model').store.peekRecord('organization-manager-group-user', groupUserId);

				this.get('model').store.find('organization-manager-user', userId)
				.then(function(user) {
					groupUser.set('user', user);
					return groupUser.save();
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': groupUser.get('user').get('fullName') + ' has been added to the ' + groupUser.get('group').get('name') + ' group' });
				})
				.catch(function(err) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': groupUser });
					groupUser.rollbackAttributes();
				});
			},

			'delete-group-user': function(groupUser) {
				var self = this,
					userName = (groupUser.get('user').get('id') ? groupUser.get('user').get('fullName') : 'New User'),
					parentGroup = groupUser.get('group'),
					delFn = function() {
						groupUser.destroyRecord()
						.then(function() {
							if(parentGroup) {
								parentGroup.get('users').removeObject(groupUser);
							}

							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': userName + ' has been removed from ' + parentGroup.get('name') + ' group' });
						})
						.catch(function(err) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': groupUser });
							groupUser.rollbackAttributes();
						});
					};

				if(groupUser.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to remove <strong>"' + userName + '"</strong> from the ' + parentGroup.get('name') + ' group?',
						'title': 'Delete <strong>' + userName + '</strong>?',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
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

		exports['default'] = OrganizationManagerGroupsComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-groups-editor",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-groups-editor');

		var OrganizationManagerGroupsEditorComponent = window.Ember.Component.extend({
			'_initNewGroupUserSelect': function(groupUserId) {
				var self = this,
					selectElem = self.$('select#organization-manager-group-users-tab-select-' + groupUserId);

				selectElem.select2({
					'ajax': {
						'delay': 250,
						'dataType': 'json',

						'url': window.apiServer + 'masterdata/tenantEmails',

						'data': function (params) {
							var queryParameters = {
								'filter': params.term,
								'tenant': self.get('model').get('tenant').get('id')
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
					var groupUserId = selectElem.attr('id').replace('organization-manager-group-users-tab-select-', '');

					self.sendAction('controller-action', 'save-group-user', {
						'userId': selectElem.val(),
						'groupUserId': groupUserId
					});
				});
			},

			'_initNewGroupPermissionSelect': function(groupPermissionId) {
				var self = this,
					selectElem = self.$('select#organization-manager-group-permissions-tab-select-' + groupPermissionId);

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
					var groupPermissionId = selectElem.attr('id').replace('organization-manager-group-permissions-tab-select-', '');

					self.sendAction('controller-action', 'save-group-permission', {
						'groupPermissionId': groupPermissionId,
						'permissionId': selectElem.val()
					});
				});
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				if(!this.get('model')) return;
				var self = this;

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self.get('model').get('users').forEach(function(groupUser) {
						if(!groupUser.get('isNew')) {
							return;
						}

						self._initNewGroupUserSelect(groupUser.get('id'));
					});

					self.get('model').get('permissions').forEach(function(groupPermission) {
						if(!groupPermission.get('isNew')) {
							return;
						}

						self._initNewGroupPermissionSelect(groupPermission.get('id'));
					});
				});
			}),

			'cancel': function() {
				this.get('model').rollbackAttributes();
			},

			'add-group-user': function(parentGroup) {
				var self = this,
					data = {
						'groupUserId': app.default.generateUUID(),
						'group': parentGroup
					};

				this.sendAction('controller-action', 'add-group-user', data);
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self._initNewGroupUserSelect(data.groupUserId);
				});
			},

			'add-group-permission': function(parentGroup) {
				var self = this,
					data = {
						'groupPermissionId': app.default.generateUUID(),
						'group': parentGroup
					};

				this.sendAction('controller-action', 'add-group-permission', data);
				window.Ember.run.scheduleOnce('afterRender', this, function() {
					self._initNewGroupPermissionSelect(data.groupPermissionId);
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

		exports['default'] = OrganizationManagerGroupsEditorComponent;
	}
);
