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
		});

		exports['default'] = OrganizationManagerGroupManagementModel;
	}
);
