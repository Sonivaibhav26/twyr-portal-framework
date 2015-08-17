<script type="text/x-handlebars" data-template-name="components/organization-manager-group-management-organization">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">{{model.name}} Organization</h3>
	</div>
	<div class="box-body row">
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Organization Name</label>
			{{input type="text" value=model.name class="form-control" placeholder="Company Name" readonly="readonly"}}
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
		    <button type="button" class="btn btn-primary btn-sm" {{action "add" "group" bubbles=false}}>
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Group</span>
		    </button>
		</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="components/organization-manager-group-management-tree">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Organization Menu</h3>
	</div>
	<div class="box-body">
		<div>&nbsp;</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="organization-manager-group-management">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Group Management</h3>
	</div>
	<div id="div-organization-manager-group-management-failure-message" class="box-body callout callout-danger" style="display:none; border-radius:0px;">
		{{#each model.errors.id as |error|}}
			<span id="organization-manager-group-management-failed-message">{{error.message}}</span>
		{{/each}}
	</div>
	<div id="div-organization-manager-group-management-alert-message" class="box-body callout callout-danger" style="display:none; border-radius:0px;">
		<i class="fa fa-ban"></i>
		<span id="organization-manager-group-management-alert-message">Alert!</span>
	</div>
	<div id="div-organization-manager-group-management-progress-message" class="box-body callout callout-info" style="display:none; border-radius:0px;">
		<i class="fa fa-spinner fa-spin"></i>
		<span id="organization-manager-group-management-progress-message">Progress...</span>
	</div>
	<div id="div-organization-manager-group-management-success-message" class="box-body callout callout-success" style="display:none; border-radius:0px;">
		<span id="organization-manager-group-management-success-message">Success!</span>
	</div>
	<div class="box-body">
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3" style="max-height:640px; overflow:auto;">
			{{organization-manager-group-management-tree model=currentModel controller-action="controller-action"}}
		</div>
		<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
			{{component currentComponent model=currentModel controller-action="controller-action"}}
		</div>
	</div>
</div>
</script>
