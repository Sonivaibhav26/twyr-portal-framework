define(
	"twyrPortal/components/organization-manager-group-management-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-group-management-tree');

		var OrganizationManagerGroupManagementTreeComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					var groupManagementTree = self.$('div.box-body div').jstree({
						'core': {
							'check_callback': true,
							'multiple': false,

							'data': {
								'url':window.apiServer + 'organization-manager/groupManagementTree',
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

					groupManagementTree.on('activate_node.jstree', function(event, treeNode) {
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

					groupManagementTree.on('ready.jstree', function() {
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

		exports['default'] = OrganizationManagerGroupManagementTreeComponent;
	}
);
