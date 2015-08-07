<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-partner">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">Business Partner</h3>
	</div>
	<div class="box-body row">
		<div class="form-group col-lg-8 col-md-8 col-sm-8 col-xs-8">
			<label>Organization Name</label>
			{{#if model.isNew}}
				<select class="form-control" />
			{{else}}
				{{input type="text" value=model.partner.name class="form-control" placeholder="Partner Name" readonly="readonly"}}
			{{/if}}
		</div>
		<div class="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
			<label>Partner Since</label>
			{{input type="text" value=model.formattedCreatedOn class="form-control" placeholder="Partner since" readonly="readonly"}}
		</div>
	</div>
</form>
</div>
</script>
