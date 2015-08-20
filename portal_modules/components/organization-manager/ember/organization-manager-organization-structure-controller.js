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

			'resetStatusMessages': function(timeout) {
				window.Ember.$('div#div-organization-manager-organization-structure-failure-message').slideUp(timeout || 600);

				window.Ember.$('div#div-organization-manager-organization-structure-alert-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-organization-structure-alert-message').text('');

				window.Ember.$('div#div-organization-manager-organization-structure-progress-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-organization-structure-progress-message').text('');

				window.Ember.$('div#div-organization-manager-organization-structure-success-message').slideUp(timeout || 600);
				window.Ember.$('span#organization-manager-organization-structure-success-message').text('');
			},

			'showStatusMessage': function(statusMessageType, messageText) {
				this.resetStatusMessages(2);

				window.Ember.$('div#div-organization-manager-organization-structure-' + statusMessageType + '-message').slideDown(600);
				if(statusMessageType != 'failure') {
					window.Ember.$('span#organization-manager-organization-structure-' + statusMessageType + '-message').html(messageText);
				}
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
					self.showStatusMessage('success', 'Organization information has been updated');

					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(reason) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						self.get('currentModel').rollbackAttributes();
						self.get('currentModel').transitionTo('loaded.saved');
					}, 5000);
				});
			},

			'delete-org': function(data) {
				if(data.id.indexOf('--') > 0)
					return;

				var self = this,
					delFn = function() {
						self.get('currentModel').destroyRecord()
						.then(function() {
							self.showStatusMessage('success', 'Organization information has been deleted');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						})
						.catch(function(reason) {
							self.showStatusMessage('failure');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
		
								self.get('currentModel').rollbackAttributes();
								self.get('currentModel').transitionTo('loaded.saved');
							}, 5000);
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
					self.get('model').store.find('organization-manager-organization-user-tenant', data.userRelId)
				])
				.then(function(results) {
					user = results[0];
					userRel = results[1];

					userRel.set('user', user);
					return userRel.save();
				})
				.then(function() {
					self.showStatusMessage('success', 'User has been added to the Organization');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(err) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						userRel.rollbackAttributes();
						userRel.transitionTo('created.uncommitted');
					}, 5000);
				});
			},

			'delete-user-rel': function(data) {
				var self = this,
					parent = data.organization,
					userRel = data.userRel;

				var delFn = function() {
					userRel.destroyRecord()
					.then(function() {
						parent.get('users').removeObject(userRel);
	
						self.showStatusMessage('success', 'User has been deleted from the Organization');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					})
					.catch(function(reason) {
						self.showStatusMessage('failure');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
	
							userRel.rollbackAttributes();
							userRel.transitionTo('loaded.saved');
						}, 5000);
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
					self.showStatusMessage('success', 'Saved Group successfully');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(reason) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						data.group.rollbackAttributes();
						data.group.transitionTo('loaded.saved');
					}, 5000);
				});
			},

			'delete-group': function(data) {
				var self = this,
					delFn = function() {
						data.group.destroyRecord()
						.then(function() {
							self.showStatusMessage('success', 'Deleted Group successfully');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
							}, 5000);
						})
						.catch(function(reason) {
							self.showStatusMessage('failure');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
		
								data.group.rollbackAttributes();
								data.group.transitionTo('loaded.saved');
							}, 5000);
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
					self.showStatusMessage('success', 'Added Group Permission successfully');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(reason) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						permissionRel.rollbackAttributes();
						permissionRel.transitionTo('created.uncommitted');
					}, 5000);
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

						self.showStatusMessage('success', 'Deleted Group Permission successfully');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					})
					.catch(function(reason) {
						self.showStatusMessage('failure');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
	
							permissionRel.rollbackAttributes();
							permissionRel.transitionTo('loaded.saved');
						}, 5000);
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
					userGroupId = data.userGroupId,
					newUserGroup = this.get('model').store.createRecord('organization-manager-organization-user-group', {
						'id': userGroupId,
						'user': user
					});

				user.get('groups').addObject(newUserGroup);
			},

			'save-user-group': function(data) {
				var groupId = data.groupId,
					groupRelId = data.groupRelId,
					self = this;

				window.Ember.RSVP.Promise.all([
					this.get('model').store.find('organization-manager-organization-user-group', groupRelId),
					this.get('model').store.find('organization-manager-organization-group', groupId)
				])
				.then(function(results) {
					var groupRel = results[0],
						group = results[1];

					groupRel.set('group', group);
					return groupRel.save();
				})
				.then(function() {
					self.showStatusMessage('success', 'Saved Group successfully');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(reason) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						userGroup.rollbackAttributes();
						userGroup.transitionTo('loaded.saved');
					}, 5000);
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
						self.showStatusMessage('success', 'Deleted Group successfully');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
						}, 5000);
					})
					.catch(function(reason) {
						self.showStatusMessage('failure');
						window.Ember.run.later(self, function() {
							self.resetStatusMessages();
	
							userGroup.rollbackAttributes();
							userGroup.transitionTo('loaded.saved');
						}, 5000);
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
						console.log('TODO: Handle ' + action + ' action with data: ', data);
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureController;
	}
);
