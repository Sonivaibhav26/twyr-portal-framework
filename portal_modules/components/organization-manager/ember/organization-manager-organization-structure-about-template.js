<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-about">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">About</h3>
		{{#if model.hasDirtyAttributes}}
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "cancel" bubbles=false}}>
		    <button class="btn btn-warning btn-sm">
				<i class="fa fa-undo" style="margin-right:5px;" /><span>Cancel</span>
		    </button>
		</div>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "save" bubbles=false}}>
		    <button class="btn btn-primary btn-sm">
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
</form>
</div>
</script>
