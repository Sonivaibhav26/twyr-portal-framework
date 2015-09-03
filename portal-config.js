/*
 * Name			: portal-config.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal application-level configuration parameters
 *
 */

"use strict";

exports.development = ({
	'loadFactor': 0.25,
	'restart': false,

	'repl': {
		'prompt': ''
	},

	'apiServer': {
		'protocol': 'http',
		'host': 'local-api.twyrframework.com',
		'port': 9001
	},

	'utilities': {
		'path': './portal_modules/utilities'
	},

	'services': {
		'path': './portal_modules/services'
	},

	'components': {
		'path': './portal_modules/components'
	},

	'templates': {
		'templateEngine': 'ejs',
		'path': './public/templates'
	},

	'protocol': 'http',
	'port': 8080,

	'favicon': './public/favicon.ico',
	'poweredBy': 'Twyr Portal',
	
	'browser': {
		'cacheTime': 86400
	},
	
	'cookieParser': {
		'path': '/',
		'domain': '.twyrframework.com',
		'secure': false,
		'httpOnly': false
	},

	'session': {
		'key': 'twyr-portal',
		'secret': 'Th1s!sTheTwyrP0rta1Framew0rk',
		'ttl': 86400,
		'store': {
			'media': 'redis',
			'prefix': 'twyr!portal!session!'
		}
	},
	
	'ssl': {
		'key': './ssl/portal.key',
		'cert': './ssl/portal.crt',
		'rejectUnauthorized': false
	},

	'maxRequestSize': 1e6,
	'requestTimeout': 25,
	'connectionTimeout': 30,

	'publicDir': './public',
	'componentMountPath': '/',

	'title': 'Twyr Portal Framework: Scaffolding for a node.js Enterprise Portal',
	'baseYear': '2014'
});

exports.test = ({
	'loadFactor': 0.5,
	'restart': false,

	'repl': {
		'controlPort': 1337,
		'controlHost': '127.0.0.1',
		'parameters': {
			'prompt': 'Twy\'r Portal Server >',
			'terminal': true,
			'useGlobal': false,

			'input': null,
			'output': null
		}
	},

	'apiServer': {
		'protocol': 'http',
		'host': 'twyr-api-test.twyrframework.com',
		'port': 80
	},

	'utilities': {
		'path': './portal_modules/utilities'
	},

	'services': {
		'path': './portal_modules/services'
	},

	'components': {
		'path': './portal_modules/components'
	},

	'templates': {
		'templateEngine': 'ejs',
		'path': './public/templates'
	},

	'protocol': 'http',
	'port': 8080,

	'favicon': './public/favicon.ico',
	'poweredBy': 'Twyr Portal',
	
	'browser': {
		'cacheTime': 86400
	},
	
	'cookieParser': {
		'path': '/',
		'domain': '.twyrframework.com',
		'secure': true,
		'httpOnly': false
	},

	'session': {
		'key': 'twyr-portal',
		'secret': 'Th1s!sTheTwyrP0rta1Framew0rk',
		'ttl': 86400,
		'store': {
			'media': 'redis',
			'prefix': 'twyr!portal!session!'
		}
	},
	
	'ssl': {
		'key': './ssl/portal.key',
		'cert': './ssl/portal.crt',
		'rejectUnauthorized': false
	},

	'maxRequestSize': 1e6,
	'requestTimeout': 25,
	'connectionTimeout': 30,

	'publicDir': './public',
	'componentMountPath': '/',

	'title': 'Twyr Portal Framework: Scaffolding for a node.js Enterprise Portal',
	'baseYear': '2014'
});

exports.stage = ({
	'loadFactor': 0.75,
	'restart': true,

	'repl': {
		'controlPort': 1337,
		'controlHost': '127.0.0.1',
		'parameters': {
			'prompt': 'Twy\'r Portal Server >',
			'terminal': true,
			'useGlobal': false,

			'input': null,
			'output': null
		}
	},

	'apiServer': {
		'protocol': 'https',
		'host': 'twyr-api-stage.twyrframework.com',
		'port': 443
	},

	'utilities': {
		'path': './portal_modules/utilities'
	},

	'services': {
		'path': './portal_modules/services'
	},

	'components': {
		'path': './portal_modules/components'
	},

	'templates': {
		'templateEngine': 'ejs',
		'path': './public/templates'
	},

	'protocol': 'http',
	'port': 80,

	'favicon': './public/favicon.ico',
	'poweredBy': 'Twyr Portal',
	
	'browser': {
		'cacheTime': 86400
	},
	
	'cookieParser': {
		'path': '/',
		'domain': '.twyrframework.com',
		'secure': true,
		'httpOnly': false
	},

	'session': {
		'key': 'twyr-portal',
		'secret': 'Th1s!sTheTwyrP0rta1Framew0rk',
		'ttl': 86400,
		'store': {
			'media': 'redis',
			'prefix': 'twyr!portal!session!'
		}
	},
	
	'ssl': {
		'key': './ssl/portal.key',
		'cert': './ssl/portal.crt',
		'rejectUnauthorized': false
	},

	'maxRequestSize': 1e6,
	'requestTimeout': 25,
	'connectionTimeout': 30,

	'publicDir': './public',
	'componentMountPath': '/',

	'title': 'Twyr Portal Framework: Scaffolding for a node.js Enterprise Portal',
	'baseYear': '2014'
});

exports.production = ({
	'loadFactor': 1.0,
	'restart': true,

	'repl': {
		'controlPort': 1337,
		'controlHost': '0.0.0.0',
		'parameters': {
			'prompt': 'Twy\'r Portal Server >',
			'terminal': true,
			'useGlobal': false,

			'input': null,
			'output': null
		}
	},

	'apiServer': {
		'protocol': 'https',
		'host': 'twyr-api.twyrframework.com',
		'port': 443
	},

	'utilities': {
		'path': './portal_modules/utilities'
	},

	'services': {
		'path': './portal_modules/services'
	},

	'components': {
		'path': './portal_modules/components'
	},

	'templates': {
		'templateEngine': 'ejs',
		'path': './public/templates'
	},

	'protocol': 'http',
	'port': 80,

	'favicon': './public/favicon.ico',
	'poweredBy': 'Twyr Portal',
	
	'browser': {
		'cacheTime': 86400
	},
	
	'cookieParser': {
		'path': '/',
		'domain': '.twyrframework.com',
		'secure': true,
		'httpOnly': false
	},

	'session': {
		'key': 'twyr-portal',
		'secret': 'Th1s!sTheTwyrP0rta1Framew0rk',
		'ttl': 86400,
		'store': {
			'media': 'redis',
			'prefix': 'twyr!portal!session!'
		}
	},
	
	'ssl': {
		'key': './ssl/portal.key',
		'cert': './ssl/portal.crt',
		'rejectUnauthorized': false
	},

	'maxRequestSize': 1e6,
	'requestTimeout': 25,
	'connectionTimeout': 30,

	'publicDir': './public',
	'componentMountPath': '/',

	'title': 'Twyr Portal Framework: Scaffolding for a node.js Enterprise Portal',
	'baseYear': '2014'
});

