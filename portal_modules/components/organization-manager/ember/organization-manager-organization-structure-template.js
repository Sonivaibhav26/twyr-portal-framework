<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-group-permissions">
{{#unless model.isNew}}
<div class="box box-default" style="text-align:left; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.displayName}} Permissions</h3>
		{{#if model.parent}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-permission" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Permission</span>
		    </button>
		</div>
		{{/if}}
	</div>
	<div class="box-body no-padding">
		<table class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="text-align:center; vertical-align:middle;">Component</th>
				<th style="text-align:center; vertical-align:middle;">Permission Name</th>
				<th style="text-align:center; vertical-align:middle;">Description</th>
				{{#if model.parent}}
				<th style="text-align:center; vertical-align:middle;">&nbsp;</th>
				{{/if}}
			</tr>
		</thead>
		<tbody>
			{{#each model.permissions key="id" as |permissionRel index|}}
			<tr>
				{{#if permissionRel.isNew}}
					<td colspan="3" class="form-group" style="text-align:center; vertical-align:middle;">
						<select id="organization-manager-organization-structure-group-permissions-select-{{permissionRel.id}}" class="form-control" style="width:100%;" />
					</td>
					<td style="text-align:right; vertical-align:middle;">
					    <button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-permission" permissionRel}}>
							<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
					    </button>
					</td>
				{{else}}
					<td style="vertical-align:middle;">{{permissionRel.permission.componentName}}</td>
					<td style="vertical-align:middle;">{{permissionRel.permission.displayName}}</td>
					<td style="vertical-align:middle;">{{permissionRel.permission.description}}</td>
					{{#if model.parent}}
					<td style="text-align:right; vertical-align:middle;">
					    <button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-permission" permissionRel}}>
							<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
					    </button>
					</td>
					{{/if}}
				{{/if}}
			</tr>
			{{/each}}
		</tbody>
		</table>
	</div>
</div>
{{/unless}}
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-group-detail">
<div class="box box-default" style="text-align:left; box-shadow:none; border-radius:0px;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.displayName}} Group</h3>
		{{#if model.parent}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "delete" bubbles=false}}>
		    <button type="button" class="btn btn-danger btn-sm">
				<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
		    </button>
		</div>
		{{/if}}
		{{#unless model.isNew}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-subgroup" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Subgroup</span>
		    </button>
		</div>
		{{/unless}}
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
	<div class="box-body row">
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Group Name</label>
			{{input type="text" value=model.displayName class="form-control" placeholder="Group Name"}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Parent Group</label>
			{{input type="text" value=model.parent.displayName class="form-control" placeholder="Parent Group Name" readonly="readonly"}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Created On</label>
			{{input type="text" value=model.formattedCreatedOn class="form-control" placeholder="Created On" readonly="readonly"}}
		</div>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-groups-tree">
<div class="box box-default" style="text-align:left; box-shadow:none; border-radius:0px;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">{{model.tenant.name}} Groups</h3>
	</div>
	<div class="box-body">
		<div>&nbsp;</div>
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-organization-groups">
<div class="row" style="margin:0px;">
	<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="max-height:320px; overflow:auto; padding:0px;">
		{{organization-manager-organization-structure-groups-tree model=model controller-action="controller-action"}}
	</div>
	<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9" style=" padding:0px;">
		{{organization-manager-organization-structure-group-detail model=currentModel controller-action="controller-action"}}
	</div>
</div>
<div class="row" style="margin:30px 0px 0px 0px;">
	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		{{organization-manager-organization-structure-group-permissions model=currentModel controller-action="controller-action"}}
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-organization-users">
<div class="box box-default" style="text-align:left;">
	<div class="box-header with-border">
		<h3 class="box-title">Create New User</h3>
	</div>
	<div class="box-body">
	<div class="row">
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Email<sup>*</sup></label>
			{{input id="organization-manager-organization-structure-organization-users-input-email" type="text" class="form-control" placeholder="root@twyrportal.com"}}
		</div>
		<div class="form-group col-lg-3 col-md-3 col-sm-3 col-xs-3">
			<label>First Name<sup>*</sup></label>
			{{input id="organization-manager-organization-structure-organization-users-input-first-name" type="text" class="form-control" placeholder="First/Given Name"}}
		</div>
		<div class="form-group col-lg-3 col-md-3 col-sm-3 col-xs-3">
			<label>Last Name<sup>*</sup></label>
			{{input id="organization-manager-organization-structure-organization-users-input-last-name" type="text" class="form-control" placeholder="Family Name / Surname"}}
		</div>
		<div class="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2" style="padding-top:25px; text-align:right;">
		    <button type="button" class="btn btn-success btn-sm" {{action "controller-action" "create" model}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Create New User</span>
		    </button>
		</div>
	</div>
	</div>
</div>

<div class="box box-default" style="text-align:left;">
	<div class="box-header with-border">
		<h3 class="box-title">Current Users</h3>
	</div>
	<div class="box-body no-padding">
		<table class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="text-align:center; vertical-align:middle;">Login</th>
				<th style="text-align:center; vertical-align:middle;">Name</th>
				<th style="text-align:center; vertical-align:middle;">Since</th>
				<th style="text-align:right; vertical-align:middle;">
				    <button type="button" class="btn btn-primary btn-sm" {{action "controller-action" "add"}}>
						<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Registered User</span>
				    </button>
				</th>
			</tr>
		</thead>
		<tbody>
			{{#each model.users key="id" as |userRel index|}}
				{{#if userRel.isNew}}
				<tr>
					<td class="form-group" style="vertical-align:middle;">
						<select class="form-control" id="organization-manager-organization-structure-organization-users-select-new-{{userRel.id}}" style="width:100%;" />
					</td>
					<td style="vertical-align:middle;">{{userRel.user.fullName}}</td>
					<td style="vertical-align:middle;">{{userRel.formattedCreatedOn}}</td>
					<td style="text-align:right; vertical-align:middle;">
					    <button type="button" class="btn btn-warning btn-sm" {{action "controller-action" "delete" userRel bubbles=false}}>
							<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
					    </button>
					</td>
				</tr>
				{{else}}
					{{#if userRel.user.isCurrentlySelected}}
					<tr id="organization-manager-organization-structure-organization-users-tr-{{userRel.user.id}}" style="background-color:#5bc0de; color:white;">
						<td style="vertical-align:middle;">{{userRel.user.email}}</td>
						<td style="vertical-align:middle;">{{userRel.user.fullName}}</td>
						<td style="vertical-align:middle;">{{userRel.formattedCreatedOn}}</td>
						<td style="text-align:right; vertical-align:middle;">
						    <button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete" userRel bubbles=false}}>
								<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
						    </button>
						</td>
					</tr>
					{{else}}
					<tr id="organization-manager-organization-structure-organization-users-tr-{{userRel.user.id}}" {{action "controller-action" "select" userRel bubbles=false}}>
						<td style="vertical-align:middle;">{{userRel.user.email}}</td>
						<td style="vertical-align:middle;">{{userRel.user.fullName}}</td>
						<td style="vertical-align:middle;">{{userRel.formattedCreatedOn}}</td>
						<td style="text-align:right; vertical-align:middle;">
						    <button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete" userRel bubbles=false}}>
								<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
						    </button>
						</td>
					</tr>
					{{/if}}
				{{/if}}
			{{else}}
				<tr>
					<td colspan="4" style="text-align:center; vertical-align:middle;">
						<p>No users assigned to {{model.name}}</p>
					</td>
				</tr>
			{{/each}}
		</tbody>
		</table>
	</div>
</div>

{{#if currentlySelectedUser}}
<div class="box box-default" style="text-align:left; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{currentlySelectedUser.fullName}} Groups</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "add-user-group" currentlySelectedUser bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Group</span>
		    </button>
		</div>
	</div>
	<div class="box-body no-padding">
		<table class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="text-align:center; vertical-align:middle;">Group</th>
				<th style="text-align:center; vertical-align:middle;">Member since</th>
				<th style="text-align:center; vertical-align:middle;">&nbsp;</th>
			</tr>
		</thead>
		<tbody>
		{{#each currentlySelectedUser.groups as |groupRel index|}}
			{{#if groupRel.belongsToTenant}}
				{{#if groupRel.isNew}}
				<tr>
					<td class="form-group" style="vertical-align:middle;">
						<select class="form-control" id="organization-manager-organization-structure-organization-users-select-new-user-group-{{groupRel.id}}" style="width:100%;" />
					</td>
					<td style="vertical-align:middle;">{{groupRel.formattedCreatedOn}}</td>
					<td style="text-align:right; vertical-align:middle;">
					    <button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-user-group" groupRel bubbles=false}}>
							<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
					    </button>
					</td>
				</tr>
				{{else}}
				<tr>
					<td style="vertical-align:middle;">{{groupRel.group.displayName}}</td>
					<td style="vertical-align:middle;">{{groupRel.formattedCreatedOn}}</td>
					<td style="text-align:right; vertical-align:middle;">
					    <button type="button" class="btn btn-danger btn-sm" {{action "controller-action" "delete-user-group" groupRel bubbles=false}}>
							<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
					    </button>
					</td>
				</tr>
				{{/if}}
			{{/if}}
		{{/each}}
		</tbody>
		</table>
	</div>
</div>
{{else}}
<div style="display:none;">
{{#each model.users as |userRel index|}}
	{{#each userRel.user.groups as |groupRel index|}}
		{{#unless groupRel.isNew}}
			<p>{{groupRel.group.displayName}}</p>
		{{/unless}}
	{{/each}}
{{/each}}
</div>
{{/if}}
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-organization">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Organization</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "controller-action" "delete" bubbles=false}}>
		    <button type="button" class="btn btn-danger btn-sm">
				<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
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
	<div class="box-body row">
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Organization Name</label>
			{{input type="text" value=model.name class="form-control" placeholder="Company Name"}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Parent Organization</label>
			{{input type="text" value=model.parent.name class="form-control" placeholder="Parent Name" readonly="readonly"}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Member Since</label>
			{{input type="text" value=model.formattedCreatedOn class="form-control" placeholder="Member since" readonly="readonly"}}
		</div>
	</div>
	{{#unless model.isNew}}
	<div class="box-body row">
		<div class="col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-sm-6 col-sm-offset-6 col-xs-12" style="text-align:right;">
			{{#unless model.isDepartment}}
		    <button type="button" class="btn btn-primary btn-sm" {{action "controller-action" "add" "subsidiary" bubbles=false}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Subsidiary</span>
		    </button>
			{{/unless}}
		    <button type="button" class="btn btn-primary btn-sm" {{action "controller-action" "add" "department" bubbles=false}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Department</span>
		    </button>
		</div>
	</div>
	<div class="box-body no-padding" style="margin-top:20px;">
		<div class="nav-tabs-custom" style="padding:10px; border-top:3px solid #d2d6de;">
			<ul class="nav nav-tabs">
				<li class="active">
					<a href="#organization-manager-organization-structure-organization-groups-tab" data-toggle="tab">Groups</a>
				</li>
				<li>
					<a href="#organization-manager-organization-structure-organization-users-tab" data-toggle="tab">Users</a>
				</li>
			</ul>
			<div class="tab-content" style="padding:0px;">
				<div class="tab-pane active" id="organization-manager-organization-structure-organization-groups-tab" style="padding:0px;">
					{{organization-manager-organization-structure-organization-groups model=model controller-action="controller-action"}}
				</div>
				<div class="tab-pane" id="organization-manager-organization-structure-organization-users-tab" style="padding:0px;">
					{{organization-manager-organization-structure-organization-users model=model controller-action="controller-action"}}
				</div>
			</div>
		</div>
	</div>
	{{/unless}}
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-list-subsidiaries">
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


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-list-departments">
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


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-tree">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border" style="min-height:50px;">
		<h3 class="box-title">Organization Menu</h3>
	</div>
	<div class="box-body">
		<div>&nbsp;</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="organization-manager-organization-structure">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Organization Structure</h3>
	</div>
	<div class="box-body">
		<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="max-height:640px; overflow:auto;">
			{{organization-manager-organization-structure-tree model=currentModel controller-action="controller-action"}}
		</div>
		<div class="col-lg-10 col-md-10 col-sm-10 col-xs-10">
			{{component currentComponent model=currentModel controller-action="controller-action"}}
		</div>
	</div>
</div>
</script>
