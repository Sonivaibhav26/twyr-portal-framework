define(
	"twyrPortal/adapters/organization-manager-basic-information",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerBasicInformationAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager',
		});

		exports['default'] = OrganizationManagerBasicInformationAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-basic-information",
	["exports"],
	function(exports) {
		var OrganizationManagerBasicInformationModel = window.DS.Model.extend({
			'name': window.DS.attr('string'),
			'tenantType': window.DS.attr('string', { 'defaultValue': 'Department' }),
			'parent': window.DS.belongsTo('organization-manager-basic-information', { 'async': true, 'inverse': 'departments' }),
			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'departments': window.DS.hasMany('organization-manager-basic-information', { 'async': true, 'inverse': 'parent' }),
			'partners': window.DS.hasMany('organization-manager-business-partner', { 'async': true, 'inverse': null }),

			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerBasicInformationModel;
	}
);

define(
	"twyrPortal/adapters/organization-manager-business-partner",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		var OrganizationManagerBusinessPartnerAdapter = app.default.ApplicationAdapter.extend({
			'namespace': 'organization-manager',
		});

		exports['default'] = OrganizationManagerBusinessPartnerAdapter;
	}
);

define(
	"twyrPortal/models/organization-manager-business-partner",
	["exports"],
	function(exports) {
		var OrganizationManagerBusinessPartnerModel = window.DS.Model.extend({
			'tenantId': window.DS.attr('string'),
			'partnerId': window.DS.attr('string'),
			'partnerName': window.DS.attr('string'),
			'createdOn': window.DS.attr('date', { 'defaultValue': (new Date()) }),

			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			})
		});

		exports['default'] = OrganizationManagerBusinessPartnerModel;
	}
);
