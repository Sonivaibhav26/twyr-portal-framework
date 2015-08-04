<script type="text/x-handlebars" data-template-name="components/organization-manager-about">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">About</h3>
		{{#if model.hasDirtyAttributes}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "save" bubbles=false}}>
		    <button class="btn btn-primary btn-sm">
				<i class="fa fa-save" style="margin-right:5px;" /><span>Save</span>	
		    </button>
		</div>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "cancel" bubbles=false}}>
		    <button class="btn btn-warning btn-sm">
				<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
		    </button>
		</div>
		{{/if}}
	</div>
	<div class="box-body">
		<div class="form-group">
			<label>Organization Name</label>
			{{input id="organization-manager-about-input-name" type="text" value=model.name class="form-control" placeholder="Company Name"}}
		</div>
		<div class="form-group">
			<label>Parent Organization</label>
			{{input id="organization-manager-about-input-parent" type="text" value=model.parent.name class="form-control" placeholder="Parent Name" readonly="readonly"}}
		</div>
		<div class="form-group">
			<label>Member Since</label>
			{{input id="organization-manager-about-input-created-on" type="text" value=model.formattedCreatedOn class="form-control" placeholder="Member since" readonly="readonly"}}
		</div>
	</div>
</form>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-departments">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">Departments</h3>
		<div class="pull-right" style="cursor:pointer;" {{action "addDepartment" bubbles=false}}>
		    <button class="btn btn-primary btn-sm" title="Add Department">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add</span>
		    </button>
		</div>
	</div>
	<div class="box-body" style="padding:0px;">
		<table class="table">
		<tbody>
		{{#each model.departments key="id" as |department index|}}
		<tr>
			<td style="vertical-align:middle;">
				{{#if department.isNew}}
					{{input class="form-control" value=department.name placeholder="Department Name"}}
				{{else}}
					<span style="font-weight:800;">{{department.name}}</span><br />
				{{/if}}
				<i style="color:#bababa;">(Added on {{department.formattedCreatedOn}})</i>
			</td>
			<td style="text-align:right; vertical-align:middle;">
				{{#if department.isNew}}
				<button type="button" class="btn btn-success btn-sm" title="Save" {{action "saveDepartment" department}}>
					<i class="fa fa-check" />
				</button>
				{{/if}}
				<button type="button" class="btn btn-warning btn-sm" title="Delete" {{action "deleteDepartment" department}}>
					<i class="fa fa-remove" />
				</button>
			</td>
		</tr>
		{{else}}
		<tr>
			<td colspan="2" style="vertical-align:middle;">
				No departments found
			</td>
		</tr>
		{{/each}}
		</tbody>
		</table>
	</div>
</form>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/organization-manager-partners">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">Partners</h3>
		<div class="pull-right" style="cursor:pointer;" {{action "addPartner" bubbles=false}}>
		    <button class="btn btn-primary btn-sm" title="Add Partner">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add</span>
		    </button>
		</div>
	</div>
	<div class="box-body" style="padding:0px;">
		<table class="table">
		<tbody>
		{{#each model.partners key="id" as |partner index|}}
		<tr>
			<td class="form-group" style="vertical-align:middle;">
				{{#if partner.isNew}}
					<select id="organization-manager-partners-select-partner-{{partner.id}}" class="form-control" />
				{{else}}
					<span style="font-weight:800;">{{partner.partnerName}}</span>
				{{/if}}
				<br />
				<i style="color:#bababa;">(Added on {{partner.formattedCreatedOn}})</i>
			</td>
			<td style="text-align:right; vertical-align:middle;">
				{{#if partner.isNew}}
				<button type="button" class="btn btn-success btn-sm" title="Save" {{action "savePartner" partner}}>
					<i class="fa fa-check" />
				</button>
				{{/if}}
				<button type="button" class="btn btn-warning btn-sm" title="Delete" {{action "deletePartner" partner}}>
					<i class="fa fa-remove" />
				</button>
			</td>
		</tr>
		{{else}}
		<tr>
			<td colspan="2" style="vertical-align:middle;">
				No partners found
			</td>
		</tr>
		{{/each}}
		</tbody>
		</table>
	</div>
</form>
</div>
</script>

<script type="text/x-handlebars" data-template-name="organization-manager-basic-information">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Basic Information</h3>
	</div>
	<div class="box-body" style="text-align:center;">
		<div class="row">
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
				{{organization-manager-about model=model}}
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
				{{organization-manager-departments model=model}}
			</div>
			<div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
				{{organization-manager-partners model=model}}
			</div>
		</div>
	</div>
</div>
</script>
