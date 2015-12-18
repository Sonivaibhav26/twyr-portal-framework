define(
	"twyrPortal/components/organization-manager-team",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-team');

		var OrganizationManagerTeamComponent = window.Ember.Component.extend({
			'isCreating': false,
			'canDeleteUsers': false,

			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.$(self.$().parents('div.nav-tabs-custom')[0]).find('li > a').on('show.bs.tab', function(event) {
					if(window.Ember.$(event.target).text().toLowerCase().indexOf('user') < 0) return;
					self._setTenantTeam();
				});

				return true;
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				this._setTenantTeam();
			}),

			'_numUsersChangeReactor': window.Ember.observer('tenantTeam.length', function() {
				if(!this.get('tenantTeam')) return;

				var oldUsers = this.get('tenantTeam').filterBy('isNew', false);
				this.set('canDeleteUsers', (oldUsers.get('length') > 1));
			}),

			'_userStatusChangeReactor': window.Ember.observer('tenantTeam.@each.isNew', function() {
				if(!this.get('tenantTeam')) return;

				var oldUsers = this.get('tenantTeam').filterBy('isNew', false);
				this.set('canDeleteUsers', (oldUsers.get('length') > 1));
			}),

			'_setTenantTeam': function() {
				var self = this;

				self.set('tenantTeam', null);
				self.set('selectedTenantUser', null);

				if(!self.get('model'))
					return;

				self.get('model').store.query('organization-manager-team', { 'tenant': self.get('model').get('id') })
				.then(function(tenantTeam) {
					var filteredTeam = window.Ember.ArrayProxy.create({ 'content': window.Ember.A([]) });

 					self.get('model').store.peekAll('organization-manager-team').forEach(function(teamMember) {
						if(teamMember.get('tenant').get('id') !== self.get('model').get('id'))
							return;

						filteredTeam.addObject(teamMember);
					});

					self.set('tenantTeam', filteredTeam);
					window.Ember.run.later(self, function() {
						self.get('tenantTeam').forEach(function(tenantUser) {
							tenantUser.set('isSelected', false);
							if(!tenantUser.get('isNew')) {
								return;
							}

							self._initNewTenantUserSelect(tenantUser.get('id'));
						});

						self.get('tenantTeam').get('firstObject').set('isSelected', true);
						self.set('selectedTenantUser', self.get('tenantTeam').get('firstObject'));
					}, 500);
				})
				.catch(function(err) {
					console.error('Error fetching team for ' + self.get('model').get('name') + '\n', err);
				});
			},

			'_initNewTenantUserSelect': function(tenantUserId) {
				var self = this,
					selectElem = self.$('select#organization-manager-team-tab-select-' + tenantUserId);

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
					var tenantUserId = selectElem.attr('id').replace('organization-manager-team-tab-select-', '');

					self['save-tenant-user']({
						'userId': selectElem.val(),
						'tenantUserId': tenantUserId
					});
				});
			},

			'show-create-user': function() {
				var self = this;

				self.$('div#organization-manager-team-create-user').slideDown(600, function() {
					self.set('isCreating', true);
				});
			},

			'hide-create-user': function() {
				var self = this;

				self.$('div#organization-manager-team-create-user').slideUp(600, function() {
					self.set('isCreating', false);

					self.$('input#organization-manager-team-input-first-name').val('');
					self.$('input#organization-manager-team-input-last-name').val('');
					self.$('input#organization-manager-team-input-email').val('');
				});
			},

			'add-tenant-user': function(tenant) {
				var self = this,
					tenantUserId = app.default.generateUUID();

				var newTenantUser = tenant.store.createRecord('organization-manager-team', {
					'id': tenantUserId,
					'tenant': tenant
				});

				self.get('tenantTeam').addObject(newTenantUser);
				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self._initNewTenantUserSelect(tenantUserId);
				});
			},

			'create-tenant-user': function(tenant) {
				var self = this,
					newUserId = app.default.generateUUID(),
					newUserRelId = app.default.generateUUID();

				var newUserRel = null,
					newUser = self.get('model').store.createRecord('organization-manager-user', {
					'id': newUserId,
					'firstName': self.$('input#organization-manager-team-input-first-name').val(),
					'lastName': self.$('input#organization-manager-team-input-last-name').val(),
					'login': self.$('input#organization-manager-team-input-email').val(),
				});

				self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Creating ' + newUser.get('fullName') + ' record in the database' });
				newUser.save()
				.catch(function(err) {
					throw err;
				})
				.then(function() {
					newUserRel = self.get('model').store.createRecord('organization-manager-team', {
						'id': newUserRelId,
						'tenant': tenant,
						'user': newUser
					});

					self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Adding ' + newUser.get('fullName') + ' to ' + tenant.get('name') + ' Organization' });
					return newUserRel.save();
				})
				.then(function() {
					self.get('tenantTeam').addObject(newUserRel._internalModel);
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': newUser.get('fullName') + ' has been added to the ' + tenant.get('name') + ' Organization' });

					window.Ember.run.scheduleOnce('afterRender', self, function() {
						self['hide-create-user']();
						self['select-tenant-user'](newUserRel);
					});
				})
				.catch(function(err) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': (newUserRel ? newUserRel : newUser) });
					newUser.rollbackAttributes();

					if(newUserRel) {
						self.get('tenantTeam').removeObject(newUserRel);
						newUserRel.rollbackAttributes();
					}
				});
			},

			'save-tenant-user': function(data) {
				var tenantUser = this.get('model').store.peekRecord('organization-manager-team', data.tenantUserId),
					self = this;

				this.get('model').store.find('organization-manager-user', data.userId)
				.then(function(user) {
					tenantUser.set('user', user);
					return tenantUser.save();
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': tenantUser.get('user').get('fullName') + ' has been added to the ' + tenantUser.get('tenant').get('name') + ' organization' });
					self['select-tenant-user'](tenantUser);
				})
				.catch(function(reason) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantUser });
					self.get('tenantTeam').removeObject(tenantUser);
				});
			},

			'delete-tenant-user': function(tenantUser) {
				var self = this,
					tenant = tenantUser.get('tenant'),
					userName = (tenantUser.get('user').get('id') ? tenantUser.get('user').get('fullName'): 'New User'),
					delFn = function() {
						var wasSelected = false;
						if(tenantUser.get('isSelected')) {
							wasSelected = true;

							tenantUser.set('isSelected', false);
							self.set('selectedTenantUser', null);
						}

						tenantUser
						.destroyRecord()
						.then(function() {
							self.get('tenantTeam').removeObject(tenantUser);
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': userName + ' has been removed from the ' + tenant.get('name') + ' organization' });

							var newSelectedTenantUser = self.get('tenantTeam').get('firstObject');
							newSelectedTenantUser.set('isSelected', true);
							self.set('selectedTenantUser', newSelectedTenantUser);
						})
						.catch(function(err) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantUser });

							tenantUser.rollbackAttributes();
							if(wasSelected) {
								tenantUser.set('isSelected', true);
								self.set('selectedTenantUser', tenantUser);
							}
						});
					};

				if(tenantUser.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to remove <strong>"' + userName + '"</strong> from the ' + tenant.get('name') + ' organization?',
						'title': 'Delete <strong>' + userName + '</strong>?',

						'confirm': delFn,

						'cancel': function() {
							// Do nothing...
						}
					});
				}
			},

			'select-tenant-user': function(tenantUser) {
				this.get('tenantTeam').forEach(function(user) {
					user.set('isSelected', false);
				});

				tenantUser.set('isSelected', true);
				this.set('selectedTenantUser', tenantUser);
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

		exports['default'] = OrganizationManagerTeamComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-team-groups",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-team-groups');

		var OrganizationManagerTeamGroupsComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				this._super();

				if(!this.get('model'))
					return true;

				this._createTrees();
				return true;
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				if(!this.get('model'))
					return;

				this._createTrees();
			}),

			'_createTrees': function() {
				var self = this,
					tenantId = self.get('model').get('tenant').get('id'),
					userId = self.get('model').get('user').get('id');

				// Delete the existing trees, if any...
				self.$('div#organization-manager-team-groups-unused-tree-container').jstree('destroy');
				self.$('div#organization-manager-team-groups-used-tree-container').jstree('destroy');

				// Create the unused groups tree
				var unusedGroupTree = self.$('div#organization-manager-team-groups-unused-tree-container').jstree({
					'core': {
						'check_callback': false,
						'multiple': false,

						'data': {
							'url':window.apiServer + 'organization-manager/organization-manager-team/organization-manager-team-unused-groups-tree',
							'dataType': 'json',
							'data': function(node) {
								return {
									'tenant': tenantId,
									'user': userId,
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

				unusedGroupTree.on('ready.jstree', function() {
					var rootNodeId = self.$('div#organization-manager-team-groups-unused-tree-container > ul > li:first-child').attr('id');
					self.$('div#organization-manager-team-groups-unused-tree-container').jstree('activate_node', rootNodeId, false, false);
				});

				// Create the used groups tree
				var usedGroupTree = self.$('div#organization-manager-team-groups-used-tree-container').jstree({
					'core': {
						'check_callback': false,
						'multiple': false,

						'data': {
							'url': window.apiServer + 'organization-manager/organization-manager-team/organization-manager-team-used-groups-tree',
							'dataType': 'json',
							'data': function(node) {
								return {
									'tenant': tenantId,
									'user': userId,
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

				usedGroupTree.on('ready.jstree', function() {
					var rootNodeId = self.$('div#organization-manager-team-groups-used-tree-container > ul > li:first-child').attr('id');
					self.$('div#organization-manager-team-groups-used-tree-container').jstree('activate_node', rootNodeId, false, false);
				});
			},

			'add-user-group': function() {
				var selNodes = this.$('div#organization-manager-team-groups-unused-tree-container').jstree('get_selected', true)[0],
					tenantId = this.get('model').get('tenant').get('id'),
					groupId = (selNodes ? selNodes.id : null),
					userId = this.get('model').get('user').get('id');

				if(!groupId) return;

				var self = this;
				window.Ember.$.ajax({
					'type': 'POST',
					'url': window.apiServer + 'organization-manager/organization-manager-team/organization-manager-team-add-user-group',

					'dataType': 'json',
					'data': {
						'tenant': tenantId,
						'user': userId,
						'group': groupId
					},

					'success': function(data) {
						self.$('div#organization-manager-team-groups-used-tree-container').jstree().refresh();
						self.$('div#organization-manager-team-groups-unused-tree-container').jstree().refresh();
					},

					'error': function(err) {
						self.sendAction('controller-action', 'display-status-message', { 'type': 'danger', 'message': (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )) });
					}
				});
			},

			'delete-user-group': function() {
				var selNodes = this.$('div#organization-manager-team-groups-used-tree-container').jstree('get_selected', true)[0],
					tenantId = this.get('model').get('tenant').get('id'),
					groupId = (selNodes ? selNodes.id : null),
					userId = this.get('model').get('user').get('id');

				if(!groupId) return;

				var self = this;
				window.Ember.$.ajax({
					'type': 'POST',
					'url': window.apiServer + 'organization-manager/organization-manager-team/organization-manager-team-delete-user-group',

					'dataType': 'json',
					'data': {
						'tenant': tenantId,
						'user': userId,
						'group': groupId
					},

					'success': function(data) {
						self.$('div#organization-manager-team-groups-used-tree-container').jstree().refresh();
						self.$('div#organization-manager-team-groups-unused-tree-container').jstree().refresh();
					},

					'error': function(err) {
						self.sendAction('controller-action', 'display-status-message', { 'type': 'danger', 'message': (err.responseJSON ? err.responseJSON.responseText : (err.responseText || 'Unknown error' )) });
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

		exports['default'] = OrganizationManagerTeamGroupsComponent;
	}
);

