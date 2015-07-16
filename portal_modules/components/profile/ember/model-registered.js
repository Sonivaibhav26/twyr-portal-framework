/*
 * Name			: portal_modules/components/profile/ember/model-registered.js
 * Author		: Vish Desai (vishwakarma_d@hotmail.com)
 * Version		: 0.6.1
 * Copyright	: Copyright (c) 2014 Vish Desai (https://www.linkedin.com/in/vishdesai).
 * License		: The MIT License (http://opensource.org/licenses/MIT).
 * Description	: The Twy'r Portal Profile Manager Component Registered Ember Model
 *
 */

<script type="text/javascript">

Portal.Profile = DS.Model.extend({
	'salutation': DS.attr('string'),
	'firstname': DS.attr('string'),
	'middlenames': DS.attr('string'),
	'lastname': DS.attr('string'),
	'suffix': DS.attr('string'),
	'username': DS.attr('string'),
	'password1': DS.attr('string'),
	'password2': DS.attr('string'),
	'createdon': DS.attr('date')
});

</script>

