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
					organization.destroyRecord()
					.then(function() {
						parent.get('suborganizations').removeObject(organization);
					})
					.catch(function(err) {
						console.error('Delete organization failed: ', err);

						organization.rollbackAttributes();
						organization.transitionTo('loaded.saved');
					});
				},

				'deletePartner': function(organization, partner) {
					partner.destroyRecord()
					.then(function() {
						organization.get('partners').removeObject(partner);
					})
					.catch(function(err) {
						console.error('Delete partner failed: ', err);

						partner.rollbackAttributes();
						partner.transitionTo('loaded.saved');
					});
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
					console.log('Retrieving Partner Org: ' + partnerSelectElem.val() + '/' + partnerSelectElem.text());
					
					self.get('model').store.find('organization-manager-organization-structure', partnerSelectElem.val())
					.then(function(partnerOrg) {
						console.log('Partner Org: ', partnerOrg);

						self.get('model').set('partner', partnerOrg);
						partnerOrg.get('partners').addObject(self.get('model'));

						return self.get('model').save();
					})
					.then(function() {
						console.log('Successfully saved ' + self.get('model').get('tenant').get('name') + '/' + self.get('model').get('partner').get('name') + ' succesfully');
					})
					.catch(function(err) {
						console.error('Error retrieving partner organization data: ', err);
						self.get('model').rollbackAttributes();
					});
				});
			}.on('didInsertElement')
		});

		exports['default'] = OrganizationManagerOrganizationStructurePartnerComponent;
	}
);
