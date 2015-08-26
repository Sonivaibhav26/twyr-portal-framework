<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-list-subsidiaries">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Subsidiaries</h3>
	</div>
	<div class="box-body">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="vertical-align:middle;">Name</th>
			<th style="vertical-align:middle;">Parent Organization</th>
			<th style="vertical-align:middle;">Created On</th>
			<th style="vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.suborganizations as |suborganization index|}}
		<tr>
		{{#if suborganization.isOrganization}}
			<td style="vertical-align:middle;">{{suborganization.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.parent.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.formattedCreatedOn}}</td>
			<td style="vertical-align:middle;">&nbsp;</td>
		{{/if}}
		</tr>
	{{/each}}
	</tbody>
	</table>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-list-departments">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Departments</h3>
	</div>
	<div class="box-body">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="vertical-align:middle;">Name</th>
			<th style="vertical-align:middle;">Parent Organization</th>
			<th style="vertical-align:middle;">Created On</th>
			<th style="vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.suborganizations as |suborganization index|}}
		<tr>
		{{#if suborganization.isDepartment}}
			<td style="vertical-align:middle;">{{suborganization.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.parent.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.formattedCreatedOn}}</td>
			<td style="vertical-align:middle;">&nbsp;</td>
		{{/if}}
		</tr>
	{{/each}}
	</tbody>
	</table>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-details">
<div class="box box-default" style="text-align:left; margin-bottom:0px;\">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Details</h3>
	</div>
	<div class="box-body row" style="margin:0px; padding:0px;">
		<div class="col-md-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Instance Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Machine Name</td>
					<td style="vertical-align:middle;">{{model.name}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Active From</td>
					<td style="vertical-align:middle;">{{model.formattedCreatedOn}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-md-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Machine Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Manufacturer</td>
					<td style="vertical-align:middle;">{{model.machine.manufacturer}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Model</td>
					<td style="vertical-align:middle;">{{model.machine.model}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-md-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">PLC Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Manufacturer</td>
					<td style="vertical-align:middle;">{{model.plc.manufacturer}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Model</td>
					<td style="vertical-align:middle;">{{model.plc.model}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-md-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Protocol Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Name</td>
					<td style="vertical-align:middle;">{{model.protocol.name}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Version</td>
					<td style="vertical-align:middle;">{{model.protocol.version}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
	</div>
	<div class="box-body row" style="margin:0px; padding:0px;">
		<div class="col-md-3" style="text-align:center;">
			{{input checked=model.smsAlert type="checkbox"}} SMS Alert
		</div>
		<div class="col-md-3" style="text-align:center;">
			{{input checked=model.pushAlert type="checkbox"}} Notification Alert
		</div>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-tags">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Tags</h3>
	</div>
	<div class="box-body no-padding">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="text-align:center; vertical-align:middle;">Type</th>
			<th style="text-align:center; vertical-align:middle;">Name</th>
			<th style="text-align:center; vertical-align:middle;">Display Name</th>
			<th style="text-align:center; vertical-align:middle;">Persistence</th>
			<th style="text-align:center; vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.tags key="id" as |tag index|}}
	<tr>
		<td style="vertical-align:middle;">Physical</td>
		<td style="vertical-align:middle;">{{tag.name}}</td>
		<td style="vertical-align:middle;">{{tag.displayName}}</td>
		<td style="vertical-align:middle;">
		{{#if tag.persist}}
			<span>{{tag.persistPeriod}} Days</span>
		{{else}}
			<span>Not persisted</span>
		{{/if}}
		</td>
		<td style="text-align:right; vertical-align:middle;">
			<button type="button" class="btn btn-danger btn-sm" {{action "delete-tag" model tag bubbles=false}}>
				<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
			</button>
		</td>
	</tr>
	{{/each}}
	{{#each model.computed key="id" as |tag index|}}
	<tr>
		<td style="vertical-align:middle;">Computed</td>
		<td style="vertical-align:middle;">{{tag.name}}</td>
		<td style="vertical-align:middle;">{{tag.displayName}}</td>
		<td style="vertical-align:middle;">
		{{#if tag.persist}}
			<span>{{tag.persistPeriod}} Days</span>
		{{else}}
			<span>Not persisted</span>
		{{/if}}
		</td>
		<td style="text-align:right; vertical-align:middle;">
			<button type="button" class="btn btn-danger btn-sm" {{action "delete-computed-tag" model tag bubbles=false}}>
				<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
			</button>
		</td>
	</tr>
	{{/each}}
	</tbody>
	</table>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-users">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Users</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "add-machine-user" model bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Registered User</span>
		    </button>
		</div>
	</div>
	<div class="box-body no-padding">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="text-align:center; vertical-align:middle;">Login</th>
			<th style="text-align:center; vertical-align:middle;">First Name</th>
			<th style="text-align:center; vertical-align:middle;">Last Name</th>
			<th style="text-align:center; vertical-align:middle;">Created On</th>
			<th style="text-align:center; vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.users key="id" as |machineUser index|}}
	{{#if machineUser.isNew}}
	<tr>
		<td colspan="3" class="form-group" style="vertical-align:middle;">
			<select class="form-control" style="width:100%;" id="organization-manager-tenant-machine-management-machine-users-select-{{machineUser.id}}" />
		</td>
		<td style="vertical-align:middle;">{{machineUser.formattedCreatedOn}}</td>
		<td style="text-align:right; vertical-align:middle;">
			<button type="button" class="btn btn-warning btn-sm" {{action "delete-tenant-machine-user" model machineUser bubbles=false}}>
				<i class="fa fa-undo" style="margin-right:5px;"></i><span>Cancel</span>
			</button>
		</td>
	</tr>
	{{else}}
	<tr>
		<td style="vertical-align:middle;">{{machineUser.user.email}}</td>
		<td style="vertical-align:middle;">{{machineUser.user.firstName}}</td>
		<td style="vertical-align:middle;">{{machineUser.user.lastName}}</td>
		<td style="vertical-align:middle;">{{machineUser.formattedCreatedOn}}</td>
		<td style="text-align:right; vertical-align:middle;">
			<button type="button" class="btn btn-danger btn-sm" {{action "delete-tenant-machine-user" model machineUser bubbles=false}}>
				<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
			</button>
		</td>
	</tr>
	{{/if}}
	{{/each}}
	</tbody>
	</table>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Machine List</h3>
	</div>
	<div class="box-body no-padding">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="text-align:center; vertical-align:middle;">Name</th>
			<th style="text-align:center; vertical-align:middle;">Manufacturer</th>
			<th style="text-align:center; vertical-align:middle;">PLC</th>
			<th style="text-align:center; vertical-align:middle;">Protocol</th>
			<th style="text-align:center; vertical-align:middle;">Created On</th>
			<th style="text-align:center; vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.machines as |tenantMachine index|}}
	{{#if tenantMachine.isSelected}}
		<tr style="color:#fff; background-color:#00c0ef !important;">
			<td style="vertical-align:middle;">{{tenantMachine.name}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.machine.manufacturer}}<br />{{tenantMachine.machine.model}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.plc.manufacturer}}<br />{{tenantMachine.plc.model}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.protocol.name}}<br />Version: {{tenantMachine.protocol.version}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.formattedCreatedOn}}</td>
			<td style="text-align:right; vertical-align:middle;">
				<button type="button" class="btn btn-danger btn-sm" {{action "delete" model tenantMachine bubbles=false}}>
					<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
				</button>
			</td>
		</tr>
	{{else}}
		<tr style="cursor:pointer;" {{action "select-machine" model tenantMachine bubbles=false}}>
			<td style="vertical-align:middle;">{{tenantMachine.name}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.machine.manufacturer}}<br />{{tenantMachine.machine.model}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.plc.manufacturer}}<br />{{tenantMachine.plc.model}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.protocol.name}}<br />Version: {{tenantMachine.protocol.version}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.formattedCreatedOn}}</td>
			<td style="text-align:right; vertical-align:middle;">
				<button type="button" class="btn btn-danger btn-sm" {{action "delete" model tenantMachine bubbles=false}}>
					<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
				</button>
			</td>
		</tr>
	{{/if}}
	{{/each}}
	</tbody>
	</table>
	</div>

	{{#if currentlySelectedMachine}}
	<div class="box-body no-padding" style="margin-top:20px;">
		<div class="nav-tabs-custom" style="padding:10px; border-top:3px solid #d2d6de;">
			<ul class="nav nav-tabs">
				<li class="active">
					<a href="#organization-manager-tenant-machine-management-machine-details-tab" data-toggle="tab">Details</a>
				</li>
				<li>
					<a href="#organization-manager-tenant-machine-management-machine-tags-tab" data-toggle="tab">Tags</a>
				</li>
				<li>
					<a href="#organization-manager-tenant-machine-management-machine-users-tab" data-toggle="tab">Users</a>
				</li>
			</ul>
			<div class="tab-content" style="padding:0px;">
				<div class="tab-pane active" id="organization-manager-tenant-machine-management-machine-details-tab" style="padding:0px;">
					{{organization-manager-tenant-machine-management-machine-details model=currentlySelectedMachine controller-action="controller-action"}}
				</div>
				<div class="tab-pane" id="organization-manager-tenant-machine-management-machine-tags-tab" style="padding:0px;">
					{{organization-manager-tenant-machine-management-machine-tags model=currentlySelectedMachine controller-action="controller-action"}}
				</div>
				<div class="tab-pane" id="organization-manager-tenant-machine-management-machine-users-tab" style="padding:0px;">
					{{organization-manager-tenant-machine-management-machine-users model=currentlySelectedMachine controller-action="controller-action"}}
				</div>
			</div>
		</div>
	</div>
	{{/if}}
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-tree">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">Organization Menu</h3>
	</div>
	<div class="box-body">
		<div>&nbsp;</div>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="organization-manager-tenant-machine-management">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Machine Management</h3>
	</div>
	<div id="div-organization-manager-tenant-machine-management-failure-message" class="box-body callout callout-danger" style="display:none; border-radius:0px;">
		{{#each model.errors.id as |error|}}
			<span id="organization-manager-tenant-machine-management-failed-message">{{error.message}}</span>
		{{/each}}
	</div>
	<div id="div-organization-manager-tenant-machine-management-alert-message" class="box-body callout callout-danger" style="display:none; border-radius:0px;">
		<i class="fa fa-ban"></i>
		<span id="organization-manager-tenant-machine-management-alert-message">Alert!</span>
	</div>
	<div id="div-organization-manager-tenant-machine-management-progress-message" class="box-body callout callout-info" style="display:none; border-radius:0px;">
		<i class="fa fa-spinner fa-spin"></i>
		<span id="organization-manager-tenant-machine-management-progress-message">Progress...</span>
	</div>
	<div id="div-organization-manager-tenant-machine-management-success-message" class="box-body callout callout-success" style="display:none; border-radius:0px;">
		<span id="organization-manager-tenant-machine-management-success-message">Success!</span>
	</div>
	<div class="box-body">
		<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="max-height:640px; overflow:auto;">
			{{organization-manager-tenant-machine-management-tree model=currentModel controller-action="controller-action"}}
		</div>
		<div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
			{{component currentComponent model=currentModel controller-action="controller-action"}}
		</div>
	</div>
</div>
</script>
