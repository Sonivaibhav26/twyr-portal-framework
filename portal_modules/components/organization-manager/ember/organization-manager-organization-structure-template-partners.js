<script type="text/x-handlebars" data-template-name="organization-manager-sub-organization-structure/partners">
<div class="box box-primary" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Vendors</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "add" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Vendor</span>
		    </button>
		</div>
	</div>
	<div class="box-body" style="text-align:left;">
	<form role="form">
		<table id="table-organization-manager-sub-organization-structure-partners-list" class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="vertical-align:middle;">Vendor Name</th>
				<th style="vertical-align:middle;">Affiliated With</th>
				<th style="vertical-align:middle;">Created On</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
		{{#each model as |vendor index|}}
			<tr>
				<td class="form-group" style="vertical-align:middle;">{{vendor.partner.name}}</td>
				<td style="vertical-align:middle;">{{vendor.tenant.name}}</td>
				<td style="vertical-align:middle;">{{vendor.formattedCreatedOn}}</td>
				<td style="text-align:right; vertical-align:middle;">
				    <button type="button" class="btn btn-danger btn-sm" {{action "delete" vendor bubbles=false}}>
						<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>
				    </button>
				</td>
			</tr>
		{{/each}}
		</tbody>
		</table>
	</form>
	</div>
</div>
</script>
