define(
	"twyrPortal/models/profile",
	["exports"],
	function(exports) {
		var ProfileModel = window.DS.Model.extend({
			'salutation': window.DS.attr('string'),
			'firstName': window.DS.attr('string'),
			'middleNames': window.DS.attr('string'),
			'lastName': window.DS.attr('string'),
			'suffix': window.DS.attr('string'),
			'sex': window.DS.attr('string'),
			'dob': window.DS.attr('date'),
			'email': window.DS.attr('string'),
			'isSearchable': window.DS.attr('boolean', { 'defaultValue': true }),
			'defaultHome': window.DS.attr('string'),
			'createdOn': window.DS.attr('date'),

			'formattedDOB': window.Ember.computed('dob', {
				'get': function(key) {
					return window.moment(this.get('dob')).format('DD MMM YYYY');
				},

				'set': function(key, newValue) {
					this.set('dob', (new Date(newValue)));
				}
			}),

			'formattedCreatedOn': window.Ember.computed('createdOn', {
				'get': function(key) {
					return window.moment(this.get('createdOn')).format('Do MMM YYYY');
				}
			}).readOnly()
		});

		exports['default'] = ProfileModel;
	}
);
