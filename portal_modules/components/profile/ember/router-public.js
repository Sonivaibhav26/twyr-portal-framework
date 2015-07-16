var Router = require('twyrPortal/router')['default'];
Router.map(function() {
	this.route('resetPassword', { 'path': '/resetpassword' });
	this.route('registerAccount', { 'path': '/registerAccount' });
});
