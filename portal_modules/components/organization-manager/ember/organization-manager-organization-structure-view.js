define(
	"twyrPortal/components/organization-manager-organization-structure-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-tree');

		var OrganizationManagerOrganizationStructureTreeComponent = window.Ember.Component.extend({
			'_initializeCollapses': window.Ember.observer('model', function() {
				var self = this;

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self.$('button[data-widget="collapse"]').each(function(idx, collapseButton) {
						window.Ember.$(collapseButton).on('click', function(e) {
							e.preventDefault();
							self._collapse(window.Ember.$(this));
						});
					});
				});
			}),

			'_collapse': function(element) {
				// Find the box parent
				var box = element.parents(".box").first();

				// Find the body and the footer
				var box_content = box.find("> .box-body, > .box-footer");
				if (!box.hasClass("collapsed-box")) {
					// Convert minus into plus
					element.children(":first")
						.removeClass('fa-minus')
						.addClass('fa-plus');

					// Hide the content
					box_content.slideUp(300, function () {
						box.addClass("collapsed-box");
					});
				}
				else {
					// Convert plus into minus
					element.children(":first")
						.removeClass('fa-plus')
						.addClass('fa-minus');

					// Show the content
					box_content.slideDown(300, function () {
						box.removeClass("collapsed-box");
					});
				}
			},

			'isChild': window.Ember.computed('model', 'parent', function() {
				if(!this.get('parent'))
					return false;

				if(this.get('parent').get('id') == this.get('model').get('id'))
					return false;

				return true;
			}),

			'actions': {
				'setCurrentWidget': function(widgetName, parent, model) {
					this.sendAction('setCurrentWidget', widgetName, parent, model);
				},

				'deleteOrganization': function(parent, organization) {
					this.sendAction('deleteEntity', 'organization', parent, organization);
				},

				'deletePartner': function(organization, partner) {
					this.sendAction('deleteEntity', 'partner', organization, partner);
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureTreeComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-about",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-about');

		var OrganizationManagerOrganizationStructureAboutComponent = window.Ember.Component.extend({
			'actions': {
				'save': function() {
					var self = this;

					self.get('model')
					.save()
					.then(function() {
						console.log('Persisted ' + self.get('model').get('name') + ' successfully');
					})
					.catch(function(err) {
						console.error('Error persisting ' + self.get('model').get('name') + ': ', err);

						self.get('model').rollbackAttributes();
						self.get('model').transitionTo('loaded.saved');
					});
				},

				'cancel': function() {
					this.get('model').rollbackAttributes();
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureAboutComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-partner",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-partner');

		var OrganizationManagerOrganizationStructurePartnerComponent = window.Ember.Component.extend({
			'_initialize': function() {
				var self = this;

				if(!self.get('model').get('isNew'))
					return;

				var partnerSelectElem = self.$('select.form-control');
				if(!partnerSelectElem.length) return;

				console.log('Partner Select Elem: ', partnerSelectElem);

				partnerSelectElem = $(partnerSelectElem[0]);
				partnerSelectElem.select2({
					'ajax': {
						'delay': 250,
						'dataType': 'json',
	
						'url': window.apiServer + 'masterdata/partners',

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
		
					'minimumInputLength': 2,
					'minimumResultsForSearch': 10,

					'allowClear': false,
					'closeOnSelect': true,

					'placeholder': 'Partner'
				})
				.on('change', function() {
					var model = self.get('model');
					model.store.find('organization-manager-organization-structure', partnerSelectElem.val())
					.then(function(partnerOrg) {
						model.set('partner', partnerOrg);
						return model.save();
					})
					.then(function() {
						console.log('Successfully saved ' + model.get('tenant').get('name') + '/' + model.get('partner').get('name') + ' succesfully');
					})
					.catch(function(err) {
						console.error('Error retrieving partner organization data: ', err);
						model.rollbackAttributes();
					});
				});
			}.on('didInsertElement')
		});

		exports['default'] = OrganizationManagerOrganizationStructurePartnerComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-user-manager",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-user-manager');

		var OrganizationManagerOrganizationStructureUserManagerComponent = window.Ember.Component.extend({
			'_initialize': window.Ember.observer('model', function() {
				var self = this;

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					if(!self.get('model')) return;

					self.get('model').get('users').forEach(function(user) {
						if(!user.get('isNew'))
							return;

						self._initSelect(user);
					});
				});
			}),

			'isUserRemovable': window.Ember.computed('model.users.@each.isNew', {
				'get': function() {
					var oldUsers = this.get('model').get('users').filter(function(user) {
						return !user.get('isNew');
					});

					return (oldUsers.get('length') > 1);
				}
			}),

			'_initSelect': function(user) {
				var self = this,
					selectElem = self.$('select#organization-manager-organization-structure-user-manager-select-' + user.get('id'));

				if(!selectElem)
					return;

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
										'text': item.email + ' (' + item.name + ')',
										'slug': item.email,
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

					'allowClear': false,
					'closeOnSelect': true,

					'placeholder': 'Users\' email'
				})
				.on('change', function() {
					user.store.find('organization-manager-user', selectElem.val())
					.then(function(orgUser) {
						user.set('user', orgUser);
						return user.save();
					})
					.then(function() {
						console.log('Successfully added user');
					})
					.catch(function(err) {
						console.error('Error retrieving user data: ', err);
						user.rollbackAttributes();
					});
				});
			},

			'actions': {
				'add': function() {
					var parent = this.get('model'),
						self = this,
						newUserRel = parent.store.createRecord('organization-manager-organization-user', {
							'id': app.default.generateUUID(),
							'tenant': parent
						});

					parent.get('users').addObject(newUserRel);
					window.Ember.run.scheduleOnce('afterRender', self, function() {
						self._initSelect(newUserRel);
					})
				},

				'delete': function(user) {
					var parent = this.get('model'),
						delFn = function() {
							user.destroyRecord()
							.then(function() {
								console.log('Deleted ' + user.get('user').get('firstName') + ' successfully');
								parent.get('users').removeObject(user);
							})
							.catch(function(err) {
								console.error('Error deleting ' + user.get('user').get('firstName') + ': ', err);
		
								user.rollbackAttributes();
								user.transitionTo('loaded.saved');
							});
						};

					if(!user.get('isNew')) {
						window.Ember.$.confirm({
							'text': 'Are you sure that you want to remove <strong>"' + user.get('user').get('fullName') + '"</strong> from the list of Users?',
							'title': 'Delete User',
	
							'confirm': delFn,
	
							'cancel': function() {
								// Nothing to do...
							}
						});
					}
					else {
						delFn();
					}
				},

				'cancel': function() {
					this.get('model').rollbackAttributes();
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureUserManagerComponent;
	}
);
