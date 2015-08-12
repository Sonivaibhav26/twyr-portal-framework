define(
	"twyrPortal/controllers/organization-manager-sub-organization-structure",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-sub-organization-structure');

		var OrganizationManagerSubOrganizationStructureController = window.Ember.Controller.extend({
			'rootOrganizationId': '',

			'isChild': window.Ember.computed('model.id', {
				'get': function(key) {
					return (this.get('model').get('id') != this.get('rootOrganizationId'));
				}
			}),

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

			'save': function() {
				var self = this;

				self.get('model').save()
				.then(function() {
					self.showStatusMessage('success', 'Organization information has been updated');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();
					}, 5000);
				})
				.catch(function(reason) {
					self.showStatusMessage('failure');
					window.Ember.run.later(self, function() {
						self.resetStatusMessages();

						self.get('model').rollbackAttributes();
						self.get('model').transitionTo('loaded.saved');
					}, 5000);
				});
			},

			'cancel': function() {
				this.get('model').rollbackAttributes();
			},

			'delete': function() {
				var self = this;

				window.Ember.$.confirm({
					'text': 'Are you sure that you want to delete organization account for <strong>"' + self.get('model').get('name') + '"</strong>?',
					'title': 'Delete Organization',

					'confirm': function() {
						var parentOrganization = self.get('model').get('parent');

						self.get('model')
						.destroyRecord()
						.then(function() {
							self.showStatusMessage('success', 'Organization information has been deleted');
							window.Ember.run.later(self, function() {
								self.resetStatusMessages();

								if(self.get('isChild')) {
									self.transitionToRoute('organization-manager-sub-organization-structure', parentOrganization);
								}
								else {
									self.transitionToRoute('application');
								}
							}, 5000);
						})
						.catch(function(reason) {
							self.showStatusMessage('failure');
							console.error('Error Deleting Organization: ', reason);

							window.Ember.run.later(self, function() {
								self.resetStatusMessages();
	
								self.get('model').rollbackAttributes();
								self.get('model').transitionTo('loaded.saved');
							}, 5000);
						});
					},

					'cancel': function() {
						// Do nothing...
					}
				});
			},

			'actions': {
				'controller-action': function(action) {
					this[action]();
				}
			}
		});

		exports['default'] = OrganizationManagerSubOrganizationStructureController;
	}
);

define(
	"twyrPortal/controllers/organization-manager-sub-organization-partner",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/controllers/organization-manager-sub-organization-partner');

		var OrganizationManagerSubOrganizationPartnerController = window.Ember.Controller.extend({
			'_onModelChange': window.Ember.observer('model', function() {
				var self = this;
				window.Ember.run.scheduleOnce('afterRender', self, function() {
					if(!self.get('model').get('isNew')) return;
					self._initSelect();
				});
			}),

			'_initSelect': function() {
				var self = this,
					vendor = self.get('model'),
					selectElem = window.Ember.$('select#select-organization-manager-sub-organization-structure-partners-new-' + vendor.get('id'));

				if(!selectElem) return;

				selectElem.select2({
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

					'placeholder': 'Vendor'
				})
				.on('change', function() {
					vendor.store.find('organization-manager-organization-structure', selectElem.val())
					.then(function(partnerOrg) {
						vendor.set('partner', partnerOrg);
						return vendor.save();
					})
					.then(function() {
						console.log('Successfully saved ' + vendor.get('tenant').get('name') + '/' + vendor.get('partner').get('name') + ' relationship');
					})
					.catch(function(err) {
						console.error('Error retrieving partner organization data: ', err);
						vendor.rollbackAttributes();
					});
				});
			},
		});

		exports['default'] = OrganizationManagerSubOrganizationPartnerController;
	}
);