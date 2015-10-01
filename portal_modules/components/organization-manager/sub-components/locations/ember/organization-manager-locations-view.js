define(
	"twyrPortal/components/organization-manager-locations",
	["exports", "twyrPortal/app"],
	function(exports, app) {
		if(window.developmentMode) console.log('DEFINE: twyrPortal/components/organization-manager-locations');

		var OrganizationManagerLocationsComponent = window.Ember.Component.extend({
			'isCreating': false,

			'didInsertElement': function() {
				var self = this;
				self._super();

				if(!self.get('model'))
					return true;

				this.get('model').store.query('organization-manager-tenant-location', { 'tenant': this.get('model').get('id') })
				.then(function(tenantLocations) {
					self.set('tenantLocations', tenantLocations);
				})
				.catch(function(err) {
					console.error('Error fetching locations for Tenant: ' + self.get('model').get('id') + '\n', err);
				});

				return true;
			},

			'_modelChangeReactor': window.Ember.observer('model', function() {
				if(!this.get('model')) {
					this.set('tenantLocations', null);
					return;
				}

				var self = this;
				this.get('model').store.query('organization-manager-tenant-location', { 'tenant': this.get('model').get('id') })
				.then(function(tenantLocations) {
					self.set('tenantLocations', tenantLocations);
				})
				.catch(function(err) {
					console.error('Error fetching locations for Tenant: ' + self.get('model').get('id') + '\n', err);
				});
			}),

			'_replaceMarker': function(location) {
				var self = this,
					marker = new window.google.maps.Marker({
						'position': location.latLng,
						'map': self.get('map')
					});

				if(self.get('marker')) {
					self.get('marker').setMap(null);
				}

				self.set('marker', marker);

				self.set('route', null);
				self.set('area', null);
				self.set('city', null);
				self.set('state', null);
				self.set('postal_code', null);
				self.set('country', null);
				self.set('latitude', null);
				self.set('longitude', null);

				var geoCoder = new window.google.maps.Geocoder;
				geoCoder.geocode({ 'location': location.latLng }, function(results, status) {
					if(status !== window.google.maps.GeocoderStatus.OK) {
						return;
					}

					var geoCodedAddr = results[0];
					geoCodedAddr.address_components.forEach(function(addrComponent) {
						switch(addrComponent.types[0]) {
							case 'street_number':
								self.set('route', addrComponent.long_name + (self.get('route') ? (' ' + self.get('route')) : ''));
								break;

							case 'route':
								self.set('route', (self.get('route') ? self.get('route') : '') + ' ' + addrComponent.long_name);
								break;

							case 'neighborhood':
							case 'sublocality_level_1':
								self.set('area', (self.get('area') ? self.get('area') : '') + ' ' + addrComponent.long_name);
								break;

							case 'locality':
								self.set('city', addrComponent.long_name);
								break;

							case 'administrative_area_level_1':
								self.set('state', addrComponent.long_name);
								break;

							case 'country':
								self.set('country', addrComponent.long_name);
								break;

							case 'postal_code':
								self.set('postal_code',  (self.get('postal_code') ? self.get('postal_code') : '') + ' ' + addrComponent.long_name);
								break;

							case 'postal_code_prefix':
								self.set('postal_code',  addrComponent.long_name + (self.get('postal_code') ? (' ' + self.get('postal_code')) : ''));
								break;
						};
					});

					self.set('latitude', location.latLng.lat);
					self.set('longitude', location.latLng.lng);
				});
			},

			'show-create-address': function() {
				var self = this;

				self.$('div#organization-manager-locations-create-address').slideDown(600, function() {
					self.set('isCreating', true);

					var mapCanvas = window.document.getElementById('organization-manager-locations-google-map'),
						mapOptions = {
							'zoom': 16,
							'mapTypeId': window.google.maps.MapTypeId.ROADMAP
						};

					if(!self.get('map')) {
						self.set('map', new window.google.maps.Map(mapCanvas, mapOptions));

						self.get('map').addListener('click', function(position) {
							var markerPosition = { 'latLng': {} };
							markerPosition.latLng.lat = position.latLng.H;
							markerPosition.latLng.lng = position.latLng.L;

							self._replaceMarker(markerPosition);
							window.Ember.run.later(self, function() {
								self.get('map').setCenter(position.latLng);
							}, 400);
						});
/*
						self.get('map').addListener('center_changed', function() {
							window.Ember.run.later(self, function() {
								if(!self.get('marker'))
									return;

								self.get('map').panTo(self.get('marker').getPosition());
							}, 400);
						});
*/
					}

					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position) {
							mapOptions.center = {
								lat: position.coords.latitude,
								lng: position.coords.longitude
							};

							self.get('map').setCenter(mapOptions.center);
							self._replaceMarker({ 'latLng': mapOptions.center });
						});
					}
				});
			},

			'hide-create-address': function() {
				var self = this;

				self.$('div#organization-manager-locations-create-address').slideUp(600, function() {
					self.get('marker').setMap(null);
					self.set('marker', null);
					self.set('isCreating', false);

					self.set('locationName', null);
					self.set('route', null);
					self.set('area', null);
					self.set('city', null);
					self.set('state', null);
					self.set('postal_code', null);
					self.set('country', null);
					self.set('latitude', null);
					self.set('longitude', null);
				});
			},

			'show-google-map': function() {
				var self = this;
				window.Ember.$.ajax({
					'url': 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.get('approxLocation').replace(/ /g, '+') + '&key=AIzaSyDof1Dp2E9O1x5oe78cOm0nDbYcnrWiPgA',
					'type': 'GET',
					'xhrFields': {
						'withCredentials': false
					},
					'dataType': 'json'
				})
				.then(function(addressData) {
					self.get('map').setCenter(addressData.results[0].geometry.location);
					self._replaceMarker({ 'latLng': addressData.results[0].geometry.location })
				});
			},

			'create-tenant-location': function(tenant) {
				var self = this,
					newLocationRelId = app.default.generateUUID();

				var newLocationRel = null,
					newLocation = self.get('model').store.createRecord('organization-manager-location', {
						'route': self.get('route'),
						'area': self.get('area'),
						'city': self.get('city'),
						'state': self.get('state'),
						'postalCode': self.get('postal_code'),
						'country': self.get('country'),
						'latitude': self.get('latitude'),
						'longitude': self.get('longitude')
					});

				self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Creating ' + (self.get('locationName') || 'New ') + ' address record' });
				newLocation.save()
				.catch(function(err) {
					throw err;
				})
				.then(function(savedLocation) {
					newLocationRel = self.get('model').store.createRecord('organization-manager-tenant-location', {
						'id': newLocationRelId,
						'name': (self.get('locationName') || 'New'),
						'tenant': tenant,
						'location': newLocation
					});

					self.sendAction('controller-action', 'display-status-message', { 'type': 'info', 'message': 'Adding ' + (self.get('locationName') || 'New ') + ' address to ' + tenant.get('name') + ' Organization' });
					return newLocationRel.save();
				})
				.then(function() {
					self.get('tenantLocations').addObject(newLocationRel._internalModel);
				})
				.then(function() {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': (self.get('locationName') || 'New ') + ' address has been added to the ' + tenant.get('name') + ' Organization' });
					return self['hide-create-address']();
				})
				.catch(function(err) {
					self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': (newLocationRel ? newLocationRel : newLocation) });
					newLocation.rollbackAttributes();

					if(newLocationRel) {
						self.get('tenantLocations').removeObject(newLocationRel._internalModel);
						newLocationRel.rollbackAttributes();
					}
				});
			},

			'delete-tenant-location': function(tenantLocation) {
				var self = this,
					tenant = tenantLocation.get('tenant'),
					locationName = (tenantLocation.get('name')),
					delFn = function() {
						tenantLocation
						.destroyRecord()
						.then(function() {
							self.get('tenantLocations').removeObject(tenantLocation);
							self.sendAction('controller-action', 'display-status-message', { 'type': 'success', 'message': locationName + ' has been removed from the ' + tenant.get('name') + ' organization' });
						})
						.catch(function(err) {
							self.sendAction('controller-action', 'display-status-message', { 'type': 'error', 'errorModel': tenantLocation });
							tenantLocation.rollbackAttributes();
						});
					};

				if(tenantLocation.get('isNew')) {
					delFn();
				}
				else {
					window.Ember.$.confirm({
						'text': 'Are you sure that you want to remove <strong>"' + locationName + '"</strong> address from the ' + tenant.get('name') + ' organization?',
						'title': 'Delete <strong>' + locationName + '</strong>?',
	
						'confirm': delFn,
	
						'cancel': function() {
							// Do nothing...
						}
					});
				}
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

		exports['default'] = OrganizationManagerLocationsComponent;
	}
);
