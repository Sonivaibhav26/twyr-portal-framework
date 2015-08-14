<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-organization">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Organization</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "delete" bubbles=false}}>
		    <button type="button" class="btn btn-danger btn-sm">
				<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
		    </button>
		</div>
		{{#if model.hasDirtyAttributes}}
		{{#unless model.isNew}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "cancel" bubbles=false}}>
		    <button type="button" class="btn btn-warning btn-sm">
				<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
		    </button>
		</div>
		{{/unless}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "save" bubbles=false}}>
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
	<div class="box-body row">
		<div class="col-lg-6 col-lg-offset-6 col-md-6 col-md-offset-6 col-sm-6 col-sm-offset-6 col-xs-12" style="text-align:right;">
			{{#unless model.isDepartment}}
		    <button type="button" class="btn btn-primary btn-sm" {{action "add" "subsidiary" bubbles=false}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Subsidiary</span>
		    </button>
			{{/unless}}
		    <button type="button" class="btn btn-primary btn-sm" {{action "add" "department" bubbles=false}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Department</span>
		    </button>
			{{#unless model.tenant}}
		    <button type="button" class="btn btn-primary btn-sm" {{action "add" "vendor" bubbles=false}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Vendor</span>
		    </button>
			{{/unless}}
		</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-list-subsidiaries">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Subsidiaries</h3>
	</div>
	<div class="box-body row">
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
		{{#if suborganization.isOrganization}}
		<tr>
			<td style="vertical-align:middle;">{{suborganization.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.parent.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.formattedCreatedOn}}</td>
			<td style="vertical-align:middle;">&nbsp;</td>
		</tr>
		{{/if}}
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
	<div class="box-body row">
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
	{{#each model.suborganizations key="id" as |suborganization index|}}
		{{#if suborganization.isDepartment}}
		<tr>
			<td style="vertical-align:middle;">{{suborganization.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.parent.name}}</td>
			<td style="vertical-align:middle;">{{suborganization.formattedCreatedOn}}</td>
			<td style="vertical-align:middle;">&nbsp;</td>
		</tr>
		{{/if}}
	{{/each}}
	</tbody>
	</table>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-vendors">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Vendor: {{model.partner.name}}</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "delete" bubbles=false}}>
		    <button type="button" class="btn btn-danger btn-sm">
				<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
		    </button>
		</div>
	</div>
	<div class="box-body row">
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Vendor Name</label>
			{{#if model.isNew}}
				<select id="select-vendor-new-{{model.id}}" class="form-control" />
			{{else}}
				{{input type="text" value=model.partner.name class="form-control" placeholder="Organization Name" readonly="readonly"}}
			{{/if}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Affiliated To</label>
			{{input type="text" value=model.tenant.name class="form-control" placeholder="Parent Name" readonly="readonly"}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Vendor Since</label>
			{{input type="text" value=model.formattedCreatedOn class="form-control" placeholder="Member since" readonly="readonly"}}
		</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-list-vendors">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Vendors</h3>
	</div>
	<div class="box-body row">
	<table class="table table-bordered table-striped table-hover">
	<thead>
		<tr>
			<th style="vertical-align:middle;">Name</th>
			<th style="vertical-align:middle;">Affiliated To</th>
			<th style="vertical-align:middle;">Vendor Since</th>
			<th style="vertical-align:middle;">&nbsp;</th>
		</tr>
	</thead>
	<tbody>
	{{#each model.partners key="id" as |partner index|}}
		<tr>
			<td style="vertical-align:middle;">{{partner.partner.name}}</td>
			<td style="vertical-align:middle;">{{partner.tenant.name}}</td>
			<td style="vertical-align:middle;">{{partner.formattedCreatedOn}}</td>
			<td style="vertical-align:middle;">&nbsp;</td>
		</tr>
	{{/each}}
	</tbody>
	</table>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-tree">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
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
	<div id="div-organization-manager-organization-structure-failure-message" class="box-body callout callout-danger" style="display:none; border-radius:0px;">
		{{#each model.errors.id as |error|}}
			<span id="organization-manager-organization-structure-failed-message">{{error.message}}</span>
		{{/each}}
	</div>
	<div id="div-organization-manager-organization-structure-alert-message" class="box-body callout callout-danger" style="display:none; border-radius:0px;">
		<i class="fa fa-ban"></i>
		<span id="organization-manager-organization-structure-alert-message">Alert!</span>
	</div>
	<div id="div-organization-manager-organization-structure-progress-message" class="box-body callout callout-info" style="display:none; border-radius:0px;">
		<i class="fa fa-spinner fa-spin"></i>
		<span id="organization-manager-organization-structure-progress-message">Progress...</span>
	</div>
	<div id="div-organization-manager-organization-structure-success-message" class="box-body callout callout-success" style="display:none; border-radius:0px;">
		<span id="organization-manager-organization-structure-success-message">Success!</span>
	</div>
	<div class="box-body">
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="max-height:640px; overflow:auto;">
			{{organization-manager-organization-structure-tree model=currentModel controller-action="controller-action"}}
		</div>
		<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
			{{component currentComponent model=currentModel controller-action="controller-action"}}
		</div>
	</div>
</div>
</script>
