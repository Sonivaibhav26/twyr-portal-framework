<script type="text/x-handlebars" data-template-name="organization-manager-sub-organization-structure">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Organization Structure: {{model.name}}</h3>
		{{#if isChild}}
		<div class="box-tools" style="padding:5px; cursor:pointer;">
			{{#if model.isDepartment}}
				{{#link-to "organization-manager-sub-organization-structure" model.parent}}<span style="margin-right:5px;">Back to {{model.parent.name}}</span><i class="fa fa-level-up" />{{/link-to}}
			{{/if}}
			{{#if model.isOrganization}}
				{{#link-to "organization-manager-sub-organization-structure" model.parent}}<span style="margin-right:5px;">Back to {{model.parent.name}}</span><i class="fa fa-level-up" />{{/link-to}}
			{{/if}}
			{{#if model.tenant}}
				{{#link-to "organization-manager-sub-organization-structure" model.tenant}}<span style="margin-right:5px;">Back to {{model.tenant.name}}</span><i class="fa fa-level-up" />{{/link-to}}
			{{/if}}
		</div>
		{{/if}}
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
	<div class="box-body" style="text-align:center;">
		<div class="row">
			<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
				{{organization-manager-sub-organization-structure-tree model=model controller-action="controller-action"}}
			</div>
			<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
				{{organization-manager-sub-organization-structure-about model=model controller-action="controller-action"}}
				{{outlet}}
			</div>
		</div>
	</div>
</div>
</script>


<script type="text/x-handlebars" data-template-name="organization-manager-sub-organization-partner">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">About {{model.partner.name}}</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "delete" bubbles=false}}>
		    <button type="button" class="btn btn-danger btn-sm">
				<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
		    </button>
		</div>
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
				{{organization-manager-sub-organization-structure-tree model=model controller-action="controller-action"}}
			</div>
			<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
			<div class="row">
				<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
					<label>Vendor Name</label>
						{{#if model.isNew}}
							<select id="select-organization-manager-sub-organization-structure-partners-new-{{model.id}}" class="form-control" />
						{{else}}
							{{input type="text" value=model.partner.name class="form-control" placeholder="Organization Name" readonly="readonly"}}
						{{/if}}
				</div>
				<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
					<label>Affiliated To</label>
					{{input type="text" value=model.tenant.name class="form-control" placeholder="Organization Name" readonly="readonly"}}
				</div>
				<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
					<label>Member Since</label>
					{{input type="text" value=model.formattedCreatedOn class="form-control" placeholder="Member since" readonly="readonly"}}
				</div>
			</div>
			</div>
		</div>
	</div>
</form>
</div>
</script>
