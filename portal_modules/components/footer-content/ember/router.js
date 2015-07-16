var Router = require('twyrPortal/router')['default'];
Router.map(function() {
	this.route('about', { 'path': '/about' });
	this.route('terms', { 'path': '/terms' });
	this.route('privacy', { 'path': '/privacy' });
	this.route('contact', { 'path': '/contact' });
});
