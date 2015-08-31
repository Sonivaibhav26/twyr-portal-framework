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
<div class="box box-primary" style="text-align:left; margin-bottom:0px;\">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Details</h3>
		<div class="pull-right">
			<button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete" bubbles=false}}>
				<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
			</button>
		</div>
		{{#if model.hasDirtyAttributes}}
		{{#unless model.isNew}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "cancel" bubbles=false}}>
		    <button type="button" class="btn btn-warning btn-sm">
				<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
		    </button>
		</div>
		{{/unless}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "save" bubbles=false}}>
		    <button type="submit" class="btn btn-primary btn-sm">
				<i class="fa fa-save" style="margin-right:5px;" /><span>Save</span>	
		    </button>
		</div>
		{{/if}}
	</div>
	{{#if model.isNew}}
	<div class="box-body">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Instance Details</h3>
			</div>
			<div class="box-body">
				<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
					<div class="form-group">
						<label>Instance Name</label>
						{{input type="text" class="form-control" value=model.name}}
					</div>
				</div>
				<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
					<div class="form-group">
						<label>Created On</label>
						{{input type="text" class="form-control" value=model.formattedCreatedOn readonly="readonly"}}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="box-body">
		<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Machine Details</h3>
			</div>
			<div class="box-body">
				<div class="form-group">
					<label>Name</label>
					{{input type="text" class="form-control" value=model.machine.name}}
				</div>
				<div class="form-group">
					<label>Manufacturer</label>
					{{input type="text" class="form-control" value=model.machine.manufacturer}}
				</div>
				<div class="form-group">
					<label>Category</label>
					{{input type="text" class="form-control" value=model.machine.category}}
				</div>
				<div class="form-group">
					<label>Model</label>
					{{input type="text" class="form-control" value=model.machine.model}}
				</div>
			</div>
		</div>
		</div>
		<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">PLC Details</h3>
			</div>
			<div class="box-body">
				<div class="form-group">
					<label>Name</label>
					{{input type="text" class="form-control" value=model.plc.name}}
				</div>
				<div class="form-group">
					<label>Manufacturer</label>
					{{input type="text" class="form-control" value=model.plc.manufacturer}}
				</div>
				<div class="form-group">
					<label>Category</label>
					{{input type="text" class="form-control" value=model.plc.category}}
				</div>
				<div class="form-group">
					<label>Model</label>
					{{input type="text" class="form-control" value=model.plc.model}}
				</div>
			</div>
		</div>
		</div>
		<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Protocol Details</h3>
			</div>
			<div class="box-body">
				<div class="form-group">
					<label>Name</label>
					{{input type="text" class="form-control" value=model.protocol.name}}
				</div>
				<div class="form-group">
					<label>Version</label>
					{{input type="text" class="form-control" value=model.protocol.version}}
				</div>
			</div>
		</div>
		</div>
	</div>
	{{else}}
	<div class="box-body">
		<div class="col-lg-8 col-md-8 col-sm-8 col-xs-12" style="padding-left:0px;">
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="box-title">Hardware / Connectivity Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Active From</td>
					<td style="vertical-align:middle;">{{model.formattedCreatedOn}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Machine</td>
					<td style="vertical-align:middle;">{{model.machine.manufacturer}} / {{model.machine.category}} / {{model.machine.model}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">PLC</td>
					<td style="vertical-align:middle;">{{model.plc.manufacturer}} / {{model.plc.category}} / {{model.plc.model}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Protocol</td>
					<td style="vertical-align:middle;">{{model.protocol.name}} / Version: {{model.protocol.version}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12" style="padding-right:0px;">
		<div class="box box-default">
			<div class="box-header with-border">
				<h3 class="box-title">Alert Configuration</h3>
			</div>
			<div class="box-body no-padding">
				<table class="table">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">SMS Alert</td>
					<td style="text-align:right; vertical-align:middle;">
						{{input type="checkbox" checked=model.smsAlert}}
					</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Email Alert</td>
					<td style="text-align:right; vertical-align:middle;">
						{{input type="checkbox" checked=model.emailAlert}}
					</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Push Alert</td>
					<td style="text-align:right; vertical-align:middle;">
						{{input type="checkbox" checked=model.pushAlert}}
					</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Health Check Alert</td>
					<td style="text-align:right; vertical-align:middle; width:20%;">
						{{input type="number" class="form-control input-sm" value=model.statusAlertPeriod placeholder="Hours"}}
					</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
	</div>

	<div class="box-body nav-tabs-custom" style="margin-bottom:0px;">
		<ul class="nav nav-tabs">
			<li class="active">
				<a href="#organization-manager-tenant-machine-management-machine-tags-tab" data-toggle="tab">Tags</a>
			</li>
			<li>
				<a href="#organization-manager-tenant-machine-management-machine-users-tab" data-toggle="tab">Users</a>
			</li>
		</ul>
		<div class="tab-content" style="padding:0px;">
			<div class="tab-pane active" id="organization-manager-tenant-machine-management-machine-tags-tab" style="padding:0px;">
				{{organization-manager-tenant-machine-management-machine-tags model=model controller-action="controller-action"}}
			</div>
			<div class="tab-pane" id="organization-manager-tenant-machine-management-machine-users-tab" style="padding:0px;">
				{{organization-manager-tenant-machine-management-machine-users model=model controller-action="controller-action"}}
			</div>
		</div>
	</div>
	{{/if}}
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-computed-tag-edit">
<div class="box box-default" style="text-align:left; margin-bottom:0px;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.displayName}}</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "cancel" bubbles=false}}>
		    <button type="button" class="btn btn-warning btn-sm">
				<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
		    </button>
		</div>
		{{#if model.hasDirtyAttributes}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "save" bubbles=false}}>
		    <button type="submit" class="btn btn-primary btn-sm">
				<i class="fa fa-save" style="margin-right:5px;" /><span>Save</span>	
		    </button>
		</div>
		{{/if}}
	</div>
	<div class="box-body">
		<div class="row" style="margin:0px;">
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
				<div class="box box-primary" style="text-align:left;">
					<div class="box-header with-border" style="min-height:50px;">
						<h3 class="box-title">Basics</h3>
					</div>
					<div class="box-body">
						<div class="form-group">
							<label>Tag Name</label>
							{{input type="text" class="form-control" value=model.displayName}}
						</div>
						<div class="form-group">
							<label>Formula</label>
							{{input type="text" class="form-control" value=model.expression}}
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
				<div class="box box-primary" style="text-align:left; margin-bottom:0px;">
					<div class="box-header with-border" style="min-height:50px;">
						<h3 class="box-title">Alert Values</h3>
					</div>
					<div class="box-body">
					<div class="row">
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>Low-low</label>
							{{input type="number" class="form-control" value=model.lowLowValue placeholder="Not set"}}
						</div>
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>Low</label>
							{{input type="number" class="form-control" value=model.lowValue placeholder="Not set"}}
						</div>
					</div>
					<div class="row">
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>High</label>
							{{input type="number" class="form-control" value=model.highValue placeholder="Not set"}}
						</div>
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>High-high</label>
							{{input type="number" class="form-control" value=model.highHighValue placeholder="Not set"}}
						</div>
					</div>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
				<div class="box box-primary" style="text-align:left;">
					<div class="box-header with-border" style="min-height:50px;">
						<h3 class="box-title">Persistence</h3>
						<div class="pull-right">
							Enabled {{input type="checkbox" checked=model.persist}}
						</div>
					</div>
					<div class="box-body">
						<div class="form-group">
							<label>Persist (days)</label>
							{{input type="number" class="form-control" value=model.persistPeriod disabled=model.disablePersistence}}
						</div>
						<div class="form-group">
							<label>Frequency</label>
							<select class="form-control" disabled={{model.disablePersistence}}>
								<option value="none">Not set</option>
								<option value="minute">Every Minute</option>
								<option value="hour">Hourly</option>
								<option value="day">Daily</option>
								<option value="month">Monthly</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-tag-edit">
<div class="box box-default" style="text-align:left; margin-bottom:0px;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.displayName}}</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "cancel" bubbles=false}}>
		    <button type="button" class="btn btn-warning btn-sm">
				<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
		    </button>
		</div>
		{{#if model.hasDirtyAttributes}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "save" bubbles=false}}>
		    <button type="submit" class="btn btn-primary btn-sm">
				<i class="fa fa-save" style="margin-right:5px;" /><span>Save</span>	
		    </button>
		</div>
		{{/if}}
	</div>
	<div class="box-body">
		<div class="row" style="margin:0px;">
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
				<div class="box box-primary" style="text-align:left;">
					<div class="box-header with-border" style="min-height:50px;">
						<h3 class="box-title">Basics</h3>
					</div>
					<div class="box-body">
						<div class="form-group">
							<label>Register</label>
							{{input type="text" class="form-control" value=model.name}}
						</div>
						<div class="form-group">
							<label>Tag Name</label>
							{{input type="text" class="form-control" value=model.displayName}}
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
				<div class="box box-primary" style="text-align:left; margin-bottom:0px;">
					<div class="box-header with-border" style="min-height:50px;">
						<h3 class="box-title">Alert Values</h3>
					</div>
					<div class="box-body">
					<div class="row">
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>Low-low</label>
							{{input type="number" class="form-control" value=model.lowLowValue placeholder="Not set"}}
						</div>
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>Low</label>
							{{input type="number" class="form-control" value=model.lowValue placeholder="Not set"}}
						</div>
					</div>
					<div class="row">
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>High</label>
							{{input type="number" class="form-control" value=model.highValue placeholder="Not set"}}
						</div>
						<div class="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
							<label>High-high</label>
							{{input type="number" class="form-control" value=model.highHighValue placeholder="Not set"}}
						</div>
					</div>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
				<div class="box box-primary" style="text-align:left;">
					<div class="box-header with-border" style="min-height:50px;">
						<h3 class="box-title">Persistence</h3>
						<div class="pull-right">
							Enabled {{input type="checkbox" checked=model.persist}}
						</div>
					</div>
					<div class="box-body">
						<div class="form-group">
							<label>Persist (days)</label>
							{{input type="number" class="form-control" value=model.persistPeriod disabled=model.disablePersistence}}
						</div>
						<div class="form-group">
							<label>Frequency</label>
							<select class="form-control" disabled={{model.disablePersistence}}>
								<option value="none">Not set</option>
								<option value="minute">Every Minute</option>
								<option value="hour">Hourly</option>
								<option value="day">Daily</option>
								<option value="month">Monthly</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-tags">
<div class="box box-default" style="text-align:left; margin-bottom:0px;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Tags</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-computed-tag" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Computed Tag</span>
		    </button>
		</div>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-tag" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Physical Tag</span>
		    </button>
		</div>
	</div>
	<div class="box-body no-padding">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="text-align:center; vertical-align:middle;">Tag</th>
			<th style="text-align:center; vertical-align:middle;">Register</th>
			<th style="text-align:center; vertical-align:middle;">Type</th>
			<th style="text-align:center; vertical-align:middle;">Persistence</th>
			<th style="text-align:center; vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.tags key="id" as |tag index|}}
	{{#if tag.isEditing}}
	<tr>
		<td colspan="5">
		{{organization-manager-tenant-machine-management-machine-tag-edit model=tag controller-action="controller-action"}}
		</td>
	</tr>
	{{else}}
	<tr>
		<td style="vertical-align:middle;">{{tag.displayName}}</td>
		<td style="vertical-align:middle;">{{tag.name}}</td>
		<td style="vertical-align:middle;">Physical</td>
		<td style="vertical-align:middle;">
		{{#if tag.persist}}
			<span>Every {{tag.persistFrequency}} for {{tag.persistPeriod}} Days</span>
		{{else}}
			<span>Not persisted</span>
		{{/if}}
		</td>
		<td style="text-align:right; vertical-align:middle;">
			<button type="button" class="btn btn-primary btn-sm" {{action "controller-action" "edit-tag" tag bubbles=false}}>
				<i class="fa fa-edit" style="margin-right:5px;"></i><span>Edit</span>
			</button>
			<button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-tag" tag bubbles=false}}>
				<i class="fa fa-remove" style="margin-right:5px;"></i><span>Delete</span>
			</button>
		</td>
	</tr>
	{{/if}}
	{{/each}}
	{{#each model.computed key="id" as |tag index|}}
	{{#if tag.isEditing}}
	<tr>
		<td colspan="5">
		{{organization-manager-tenant-machine-management-machine-computed-tag-edit model=tag controller-action="controller-action"}}
		</td>
	</tr>
	{{else}}
	<tr>
		<td style="vertical-align:middle;">{{tag.displayName}}</td>
		<td style="vertical-align:middle;">{{tag.name}}</td>
		<td style="vertical-align:middle;">Computed</td>
		<td style="vertical-align:middle;">
		{{#if tag.persist}}
			<span>Every {{tag.persistFrequency}} for {{tag.persistPeriod}} Days</span>
		{{else}}
			<span>Not persisted</span>
		{{/if}}
		</td>
		<td style="text-align:right; vertical-align:middle;">
			<button type="button" class="btn btn-primary btn-sm" {{action "controller-action" "edit-tag" tag bubbles=false}}>
				<i class="fa fa-edit" style="margin-right:5px;"></i><span>Edit</span>
			</button>
			<button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-computed-tag" tag bubbles=false}}>
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

<script type="text/x-handlebars" data-template-name="components/organization-manager-tenant-machine-management-machine-users">
<div class="box box-default" style="text-align:left; margin-bottom:0px;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.name}} Users</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-machine-user" bubbles=false}}>
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
			<button type="button" class="btn btn-warning btn-sm" {{action "controller-action" "delete-tenant-machine-user" machineUser bubbles=false}}>
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
			<button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-tenant-machine-user" machineUser bubbles=false}}>
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
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-machine" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Machine</span>
		    </button>
		</div>
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
		</tr>
	{{else}}
		<tr id="organization-manager-tenant-machine-management-machine-{{tenantMachine.id}}" style="cursor:pointer;" {{action "controller-action" "select-machine" tenantMachine bubbles=false}}>
			<td style="vertical-align:middle;">{{tenantMachine.name}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.machine.manufacturer}}<br />{{tenantMachine.machine.model}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.plc.manufacturer}}<br />{{tenantMachine.plc.model}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.protocol.name}}<br />Version: {{tenantMachine.protocol.version}}</td>
			<td style="vertical-align:middle;">{{tenantMachine.formattedCreatedOn}}</td>
		</tr>
	{{/if}}
	{{/each}}
	</tbody>
	</table>
	</div>

	{{#if currentlySelectedMachine}}
	<div class="box-body no-padding" style="margin-top:20px;">
		{{organization-manager-tenant-machine-management-machine-details model=currentlySelectedMachine controller-action="controller-action"}}
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
