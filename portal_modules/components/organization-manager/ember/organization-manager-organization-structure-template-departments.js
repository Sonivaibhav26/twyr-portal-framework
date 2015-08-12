<script type="text/x-handlebars" data-template-name="organization-manager-sub-organization-structure/departments">
<div class="box box-primary" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Departments</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "add" bubbles=false}}>
		    <button type="button" class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add Department</span>
		    </button>
		</div>
	</div>
	<div class="box-body" style="text-align:left;">
		<table id="table-organization-manager-sub-organization-structure-departments-list" class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="vertical-align:middle;">Department Name</th>
				<th style="vertical-align:middle;">Parent Organization</th>
				<th style="vertical-align:middle;">Created On</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
		{{#each model as |department index|}}
			<tr>
				<td style="vertical-align:middle;">{{department.name}}</td>
				<td style="vertical-align:middle;">{{department.parent.name}}</td>
				<td style="vertical-align:middle;">{{department.formattedCreatedOn}}</td>
				<td style="text-align:right; vertical-align:middle;">
					{{#link-to "organization-manager-sub-organization-structure" department}}
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
