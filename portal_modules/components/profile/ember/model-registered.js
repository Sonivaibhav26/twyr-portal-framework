define(
	"twyrPortal/profile/model",
	["exports"],
	function(exports, moment) {
		var ProfileModel = window.DS.Model.extend({
			'salutation': window.DS.attr('string'),
			'firstName': window.DS.attr('string'),
			'middleNames': window.DS.attr('string'),
			'lastName': window.DS.attr('string'),
			'suffix': window.DS.attr('string'),
			'sex': window.DS.attr('string'),
			'dob': window.DS.attr('date'),
			'email': window.DS.attr('string'),
			'createdOn': window.DS.attr('date'),

			'formattedDOB': function(key, newValue, oldValue) {
				if(arguments.length > 1) {
					this.set('dob', (new Date(newValue)));
				}
		
				return window.moment(this.get('dob')).format('DD MMM YYYY');
			}.property('dob'),

			'formattedCreatedOn': function() {
				return window.moment(this.get('createdOn')).format('Do MMM YYYY');
			}.property('createdOn').readOnly()
		});

		exports['default'] = ProfileModel;
	}
);
