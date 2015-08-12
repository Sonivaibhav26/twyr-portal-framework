<script type="text/x-handlebars" data-template-name="organization-manager-sub-organization-structure/subsidiaries">
<div class="box box-primary" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Subsidiaries</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "add" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Subsidiary</span>
		    </button>
		</div>
	</div>
	<div class="box-body" style="text-align:left;">
		<table id="table-organization-manager-sub-organization-structure-subsidiaries-list" class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="vertical-align:middle;">Subsidiary Name</th>
				<th style="vertical-align:middle;">Parent Organization</th>
				<th style="vertical-align:middle;">Created On</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
		{{#each model as |subsidiary index|}}
			<tr>
				<td style="vertical-align:middle;">{{subsidiary.name}}</td>
				<td style="vertical-align:middle;">{{subsidiary.parent.name}}</td>
				<td style="vertical-align:middle;">{{subsidiary.formattedCreatedOn}}</td>
				<td style="text-align:right; vertical-align:middle;">
					{{#link-to "organization-manager-sub-organization-structure" subsidiary}}
				    <button type="button" class="btn btn-primary btn-sm">
						<i class="fa fa-edit" style="margin-right:5px;" /><span>Edit</span>
				    </button>
					{{/link-to}}
				</td>
			</tr>
		{{/each}}
		</tbody>
		</table>
	</div>
</div>
</script>
