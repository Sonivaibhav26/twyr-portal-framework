define(
	"twyrPortal/components/organization-manager-tree",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-tree');

		var OrganizationManagerTreeComponent = window.Ember.Component.extend({
			'didInsertElement': function() {
				var self = this;
				self._super();

				window.Ember.run.scheduleOnce('afterRender', self, function() {
					var orgStructureTree = self.$('div#organization-manager-tree-container').jstree({
						'core': {
							'check_callback': true,
							'multiple': false,

							'data': {
								'url':window.apiServer + 'organization-manager/organization-structure-tree',
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
						self.sendAction('controller-action', 'selected-org-changed', {
							'id': treeNode.node.id
						});
					});

					orgStructureTree.on('ready.jstree', function() {
						var rootNodeId = self.$('div#organization-manager-tree-container > ul > li:first-child').attr('id');
						self.$('div#organization-manager-tree-container').jstree('activate_node', rootNodeId, false, false);
					});
				});
			},

			'_modelNameChangeReactor': window.Ember.observer('model.name', function(component, propertyName) {
				var selNodes = this.$('div#organization-manager-tree-container').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('model').get('id') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				this.$('div#organization-manager-tree-container').jstree('rename_node', selNodes[selNodeIdx], this.get('model').get('name'));
			}),

			'_modelChangeReactor': window.Ember.observer('model', function() {
				var self = this,
					newEntity = self.get('model'),
					newEntityNode = null;

				// If model is NULL, return...
				if(!newEntity) return;

				// If user selected an existing organization, simply open it and return
				newEntityNode = self.$('div#organization-manager-tree-container').jstree('get_node', newEntity.get('id'));
				if(newEntityNode) {
					self.$('div#organization-manager-tree-container').jstree('open_node', newEntityNode);
					return;
				}

				// If user created a new organization, add node, then open it, and finally return
				var parentNodeId = newEntity.get('parent').get('id');

				var parentNode = self.$('div#organization-manager-tree-container').jstree('get_node', parentNodeId);
				if(!self.$('div#organization-manager-tree-container').jstree('is_open', parentNode))
					self.$('div#organization-manager-tree-container').jstree('open_node', parentNode);

				self.$('div#organization-manager-tree-container').jstree('create_node', parentNode, {
					'id': newEntity.get('id'),
					'text': newEntity.get('name'),
					'parent': parentNodeId,
					'children': true
				}, 'last', function() {
					self.$('div#organization-manager-tree-container').jstree('activate_node', newEntity.get('id'), false, false);
				});
			}),

			'_modelDeleteReactor': window.Ember.observer('model.isDeleted', function() {
				if(this.get('model').get('isDeleted') !== true) return;

				var selNodes = this.$('div#organization-manager-tree-container').jstree('get_selected', true),
					selNodeIdx = null;

				for(var idx = 0; idx < selNodes.length; idx++){
					if(this.get('model').get('id') != selNodes[idx].id)
						continue;

					selNodeIdx = idx;
					break;
				}

				if(selNodeIdx === null)
					return;

				var parentNode = this.$('div#organization-manager-tree-container').jstree('get_node', selNodes[selNodeIdx].parent);

				window.Ember.run.scheduleOnce('afterRender', this, function() {
					if(selNodes[selNodeIdx]) {
						this.$('div#organization-manager-tree-container').jstree('delete_node', selNodes[selNodeIdx]);
					}

					if(parentNode) {
						this.$('div#organization-manager-tree-container').jstree('activate_node', parentNode, false, false);
					}
				});
			}),

			'_deleteTreeNodeChangeReactor': window.Ember.observer('deleteTreeNode', function() {
				if(!this.get('deleteTreeNode'))
					return;

				var self = this,
					deleteNode = self.$('div#organization-manager-tree-container').jstree('get_node', self.get('deleteTreeNode')),
					parentNode = this.$('div#organization-manager-tree-container').jstree('get_node', deleteNode.parent);

				if(deleteNode) {
					self.$('div#organization-manager-tree-container').jstree('delete_node', deleteNode);
				}

				if(parentNode) {
					self.$('div#organization-manager-tree-container').jstree('activate_node', parentNode, false, false);
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

		exports['default'] = OrganizationManagerTreeComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-editor",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-editor');

		var OrganizationManagerEditorComponent = window.Ember.Component.extend({
			'cancel': function() {
				this.get('model').rollbackAttributes();
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

		exports['default'] = OrganizationManagerEditorComponent;
	}
);


define(
	"twyrPortal/components/organization-manager-suborganizations",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-suborganizations');

		var OrganizationManagerSuborganizationsComponent = window.Ember.Component.extend({
			'actions': {
				'controller-action': function(action, data) {
					if(this[action])
						this[action](data);
					else
						this.sendAction('controller-action', action, data);
				}
			}
		});

		exports['default'] = OrganizationManagerSuborganizationsComponent;
	}
);


