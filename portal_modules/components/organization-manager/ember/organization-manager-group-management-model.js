define(
	"twyrPortal/adapters/organization-manager-group-management",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-group-management');

		var OrganizationManagerGroupManagementAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerGroupManagementAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-group-management",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-group-management');

		var OrganizationManagerGroupManagementModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'parent': window.DS.belongsTo('organization-manager-group-management', { 'async': true, 'inverse': null }),
			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'groups': window.DS.hasMany('organization-manager-organization-group', { 'async': true, 'inverse': 'tenant' })
		});

		exports['default'] = OrganizationManagerGroupManagementModel;
	}
);

define(
	"twyrPortal/adapters/organization-manager-organization-group",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/adapters/organization-manager-organization-group');

		var OrganizationManagerOrganizationGroupAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager'
		});

		exports['default'] = OrganizationManagerOrganizationGroupAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-organization-group",
	["exports"],
	function(exports) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/models/organization-manager-organization-group');

		var OrganizationManagerOrganizationGroupModel = window.DS.Model.extend({
			'tenant': window.DS.belongsTo('organization-manager-group-management', { 'async': true, 'inverse': 'groups' }),

			'parent': window.DS.belongsTo('organization-manager-organization-group', { 'async': true, 'inverse': 'subgroups' }),
			'subgroups': window.DS.hasMany('organization-manager-organization-group', { 'async': true, 'inverse': 'parent' }),

			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),
			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerOrganizationGroupModel;
	}
);
