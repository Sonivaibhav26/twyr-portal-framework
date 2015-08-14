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

						console.log('activate_node.jstree', treeNode.node);
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

			'_modelNameChangeReactor': window.Ember.observer('model.name', 'model.partner.name', function(component, propertyName) {
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

				if(newEntity.get('tenant')) {
					parentNodeId = parentNodeId + '--vendors';
				}

				var parentNode = self.$('div.box-body div').jstree('get_node', (newEntity.get('parent') || newEntity.get('tenant')).get('id'));
				if(!self.$('div.box-body div').jstree('is_open', parentNode))
					self.$('div.box-body div').jstree('open_node', parentNode);

				parentNode = self.$('div.box-body div').jstree('get_node', parentNodeId);
				var newNodeId = self.$('div.box-body div').jstree('create_node', parentNode, {
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
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureOrganizationComponent;
	}
);

define(
	"twyrPortal/components/organization-manager-organization-structure-vendors",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-organization-structure-vendors');

		var OrganizationManagerOrganizationStructureVendorComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					self.$('select.form-control').each(function(index, selectElem) {
						self._initSelect(self.$(selectElem));
					});
				});
			},

			'_initSelect': function(selectElem) {
				if(!selectElem) return;

				var self = this;
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
					self.get('model').store.find('organization-manager-organization-structure', selectElem.val())
					.then(function(vendorOrg) {
						self.get('model').set('partner', vendorOrg);
						return self.get('model').save();
					})
					.catch(function(err) {
						console.error('Error retrieving partner organization data: ', err);
						self.get('model').rollbackAttributes();
					});
				});
			},

			'actions': {
				'delete': function() {
					this.sendAction('controller-action', 'delete-org', {
						'id': this.get('model').get('id'),
						'type': 'vendor'
					});
				}
			}
		});

		exports['default'] = OrganizationManagerOrganizationStructureVendorComponent;
	}
);
