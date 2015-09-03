define(
	"twyrPortal/controllers/organization-manager-organization-structure",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-organization-structure');

		var OrganizationManagerOrganizationStructureController = window.Ember.Controller.extend({
			'_removePermissionFromSubGroups': function(group, permissionId) {
				var self = this;

				group.get('subgroups').forEach(function(subgroup) {
					var toBeRemoved = subgroup.get('permissions').filter(function(groupPermissionRel) {
						return (groupPermissionRel.get('permission').get('id') == permissionId);
					});

					subgroup.get('permissions').removeObject(toBeRemoved);
					self._removePermissionFromSubGroups(subgroup, permissionId);
				});
			},

			'add-entity': function(data) {
				var recordData = null,
					self = this;

				switch(data.type) {
					case 'subsidiary':
						data.type = 'organization-manager-organization-structure';
						recordData = {
							'id': app.default.generateUUID(),
							'name': 'New Subsidiary',
							'tenantType': 'Organization'
						};
						break;

					case 'department':
						data.type = 'organization-manager-organization-structure';
						recordData = {
							'id': app.default.generateUUID(),
							'parent': this.get('currentModel').get('id'),
							'name': 'New Department',
							'tenantType': 'Department'
						};
						break;
				};

				var newEntity = this.get('currentModel').store.createRecord(data.type, recordData);
				self.get('currentModel').get('suborganizations').addObject(newEntity);
				self.get('currentModel').set('contextChange', newEntity);
				},

			'save-org': function(data) {
				var self = this,
					shouldReload = self.get('currentModel').get('isNew');

				self.get('currentModel').save()
				.then(function() {
					if(shouldReload) {
						return self.get('currentModel').reload();
					}
					else {
						return self.get('currentModel');
					}
				})
				.then(function(reloadedModel) {
					self.set('currentModel', reloadedModel);
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': self.get('currentModel').get('name') + ' information has been updated' });
				})
				.catch(function(reason) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': self.get('currentModel') });
				});
			},

			'delete-org': function(data) {
				if(data.id.indexOf('--') > 0)
					return;

				var self = this,
					delFn = function() {
						var delOrgName = self.get('currentModel').get('name');
						self.get('currentModel')
						.destroyRecord()
						.then(function() {
							self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': delOrgName + ' information has been deleted' });
						})
						.catch(function(reason) {
							self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': self.get('currentModel') });
							self.get('currentModel').rollbackAttributes();
						});
					};

				if(self.get('currentModel').get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + (self.get('currentModel').get('name') || self.get('currentModel').get('partner').get('name')) + '"</strong>?',
						'title': 'Delete',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'selected-org-changed': function(data) {
				var self = this,
					tmplType = data.type,
					recordType = 'organization-manager-organization-structure';

				switch(data.type) {
					case 'subsidiaries':
					case 'departments':
						tmplType = 'organization';
						break;

					case 'list-subsidiaries':
					case 'list-departments':
						break;

					default:
						tmplType = 'organization';
						break;
				}

				this.get('model').store.findRecord(recordType, data.id)
				.then(function(organizationData) {
					self.set('currentModel', organizationData);
					self.set('currentComponent', 'organization-manager-organization-structure-' + tmplType);
				})
				.catch(function(err) {
					console.error(err);
				});
			},

			'create-user-rel': function(data) {
				var self = this,
					newUserId = app.default.generateUUID(),
					newUserRelId = app.default.generateUUID(),
					tenant = data.organization;

				var newUserRel = null,
					newUser = self.get('model').store.createRecord('organization-manager-organization-user', {
					'id': newUserId,
					'firstName': data.firstName,
					'lastName': data.lastName,
					'email': data.email
				});

					self.send('portal-action', 'display-status-message', { 'type': 'info', 'message': 'Adding ' + data.firstName + ' ' + data.lastName + ' to ' + tenant.get('name') });
				newUser.save()
				.catch(function(err) {
					throw err;
				})
				.then(function() {
					newUserRel = self.get('model').store.createRecord('organization-manager-organization-user-tenant', {
						'id': newUserRelId,
						'tenant': tenant,
						'user': newUser
					});

					return newUserRel.save();
				})
				.then(function() {
					return tenant.get('users').addObject(newUserRel);
				})
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': newUser.get('fullName') + ' has been added to the ' + tenant.get('name') + ' Organization' });
				})
				.catch(function(err) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': (newUserRel ? newUserRel : newUser) });
					newUser.rollbackAttributes();

					if(newUserRel) {
						tenant.get('users').removeObject(newUserRel);
						newUserRel.rollbackAttributes();
					}
				});
			},

			'add-user-rel': function(data) {
				var parent = data.organization,
					newUserRelId = data.newUserRelId,
					newUserRel = parent.store.createRecord('organization-manager-organization-user-tenant', {
						'id': newUserRelId,
						'tenant': parent
					});

				parent.get('users').addObject(newUserRel);
			},

			'save-user-rel': function(data) {
				var self = this,
					user = null,
					userRel = null;

				window.Ember.RSVP.Promise.all([
					self.get('model').store.find('organization-manager-organization-user', data.userId),
					self.get('model').store.peekRecord('organization-manager-organization-user-tenant', data.userRelId)
				])
				.then(function(results) {
					user = results[0];
					userRel = results[1];

					userRel.set('user', user);
					return userRel.save();
				})
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': user.get('fullName') + ' has been added to the ' + self.get('currentModel').get('name') + ' Organization' });
				})
				.catch(function(err) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': userRel });
					userRel.rollbackAttributes();
				});
			},

			'delete-user-rel': function(data) {
				var self = this,
					parent = data.organization,
					userRel = data.userRel,
					userName = (userRel.get('user') ? userRel.get('user').get('fullName') : 'New User Record ');

				var delFn = function() {
					userRel.destroyRecord()
					.then(function() {
						parent.get('users').removeObject(userRel);
						self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': userName + ' has been deleted from the ' + parent.get('name') + ' Organization' });
					})
					.catch(function(reason) {
						self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': userRel });
						userRel.rollbackAttributes();
					});
				};

				if(userRel.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + userRel.get('user').get('fullName') + '"</strong>?',
						'title': 'Delete',

						'confirm': delFn,

						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-group': function(data) {
				var newSubgroup = data.parent.store.createRecord('organization-manager-organization-group', {
						'id': app.default.generateUUID(),
						'displayName': 'New Group',

						'tenant': data.parent.get('tenant'),
						'parent': data.parent
					});

				data.parent.get('subgroups').addObject(newSubgroup);
				data.parent.set('contextChange', newSubgroup);
			},

			'save-group': function(data) {
				var self = this;

				data.group.save()
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': 'Saved ' + data.group.get('displayName') + ' Group successfully' });
				})
				.catch(function(reason) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': data.group });
					data.group.rollbackAttributes();
				});
			},

			'delete-group': function(data) {
				var self = this,
					delFn = function() {
						data.group.destroyRecord()
						.then(function() {
							self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': 'Deleted ' + data.group.get('displayName') + ' Group successfully' });
						})
						.catch(function(reason) {
							self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': data.group });
							data.group.rollbackAttributes();
						});
					};

				if(data.group.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + data.group.get('displayName') + '"</strong>?',
						'title': 'Delete',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-permission': function(data) {
				var group = data.group,
					newRelId = data.newRelId;

				var newGroupPermission = group.store.createRecord('organization-manager-organization-group-permission', {
					'id': newRelId,
					'group': group
				});

				group.get('permissions').addObject(newGroupPermission);
			},

			'save-permission': function(data) {
				var group = data.group,
					permissionRel = group.get('permissions').filterBy('id', data.permissionRelId)[0],
					permissionId = data.permissionId,
					self = this;

				group.store.find('organization-manager-component-permission', permissionId)
				.then(function(permission) {
					permissionRel.set('group', group);
					permissionRel.set('permission', permission);

					return permissionRel.save();
				})
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': 'Added ' + permission.get('displayName') + ' Permission to the ' + group.get('displayName') + ' group' });
				})
				.catch(function(reason) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': permissionRel });
					permissionRel.rollbackAttributes();
				});
			},

			'delete-permission': function(data) {
				var group = data.group,
					permissionRel = data.permissionRel,
					self = this;

				var delFn = function() {
					permissionRel.destroyRecord()
					.then(function() {
						return group.get('permissions').removeObject(permissionRel);
					})
					.then(function() {
						self._removePermissionFromSubGroups(group, permissionRel.get('permission').get('id'));
						self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': 'Deleted Group Permission successfully' });
					})
					.catch(function(reason) {
						self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': permissionRel });
						permissionRel.rollbackAttributes();
					});
				};

				if(permissionRel.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + permissionRel.get('permission').get('displayName') + '"</strong> from the ' + group.get('displayName') + ' group?',
						'title': 'Delete',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'add-user-group': function(data) {
				var user = data.user,
					tenant = data.tenant,
					userGroupId = data.userGroupId,
					newUserGroup = this.get('model').store.createRecord('organization-manager-organization-user-group', {
						'id': userGroupId,
						'tenant': tenant,
						'user': user,
						'belongsToTenant': true
					});

				user.get('groups').addObject(newUserGroup);
			},

			'save-user-group': function(data) {
				var groupId = data.groupId,
					groupRelId = data.groupRelId,
					self = this;

				var groupRel = null,
					group = null;

				window.Ember.RSVP.Promise.all([
					this.get('model').store.peekRecord('organization-manager-organization-user-group', groupRelId),
					this.get('model').store.find('organization-manager-organization-group', groupId)
				])
				.then(function(results) {
					groupRel = results[0];
					group = results[1];

					groupRel.set('group', group);
					return groupRel.save();
				})
				.then(function() {
					self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': 'Saved ' + group.get('displayName') + ' Group successfully' });
				})
				.catch(function(reason) {
					self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': groupRel });
					groupRel.rollbackAttributes();
				});
			},

			'delete-user-group': function(data) {
				var user = data.user,
					userGroup = data.userGroup,
					self = this;

				var delFn = function() {
					userGroup.destroyRecord()
					.then(function() {
						return user.get('groups').removeObject(userGroup)
					})
					.then(function() {
						self.send('portal-action', 'display-status-message', { 'type': 'success', 'message': 'Deleted ' + user.get('fullName') + ' from the Group' });
					})
					.catch(function(reason) {
						self.send('portal-action', 'display-status-message', { 'type': 'error', 'errorModel': userGroup });
						userGroup.rollbackAttributes();
					});
				};

				if(userGroup.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to delete <strong>"' + userGroup.get('group').get('displayName') + '"</strong>?',
						'title': 'Delete',
	
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
						this.send('portal-action', action, data);
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureController;
	}
);
