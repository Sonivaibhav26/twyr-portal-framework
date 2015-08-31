<script type="text/x-handlebars" data-template-name="components/machine-manager-realtime-data-default-display">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-body" style="margin-bottom:15px;">
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Instance Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Machine Name</td>
					<td style="vertical-align:middle;">{{model.name}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Active From</td>
					<td style="vertical-align:middle;">{{model.formattedCreatedOn}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Machine Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Manufacturer</td>
					<td style="vertical-align:middle;">{{model.machineManufacturer}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Model</td>
					<td style="vertical-align:middle;">{{model.machineModel}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">PLC Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Manufacturer</td>
					<td style="vertical-align:middle;">{{model.plcManufacturer}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Model</td>
					<td style="vertical-align:middle;">{{model.plcModel}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
		<div class="box box-primary">
			<div class="box-header with-border">
				<h3 class="box-title">Protocol Details</h3>
			</div>
			<div class="box-body no-padding">
				<table id="table-machine-list" class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Name</td>
					<td style="vertical-align:middle;">{{model.protocolName}}</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Version</td>
					<td style="vertical-align:middle;">{{model.protocolVersion}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
	</div>
	<div class="box-body">
		<table class="table table-bordered table-hover table-striped">
		<thead>
			<tr>
				<th style="text-align:center; vertical-align:middle;">Tag Name</th>
				<th style="text-align:center; vertical-align:middle;">Tag Value</th>
				<th style="text-align:center; vertical-align:middle;">Alert Status</th>
			</tr>
		</thead>
		<tbody>
		{{#each model.tags key="id" as |tag index|}}
		<tr>
			<td style="vertical-align:middle;">{{tag.displayName}}</td>
			<td style="vertical-align:middle;">{{tag.value}}</td>
			<td style="vertical-align:middle;">
			{{#if tag.lowlowalert}}
				<div class="alert alert-danger" style="margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if tag.lowalert}}
				<div class="alert alert-warning" style="position:relative; left:20%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if tag.noalert}}
				<div class="alert alert-success" style="position:relative; left:40%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if tag.highalert}}
				<div class="alert alert-warning" style="position:relative; left:60%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if tag.highhighalert}}
				<div class="alert alert-danger" style="position:relative; left:80%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}
			</td>
		</tr>
		{{/each}}
		{{#each model.computed key="id" as |computedTag index|}}
		<tr>
			<td style="vertical-align:middle;">{{computedTag.displayName}}</td>
			<td style="vertical-align:middle;">{{computedTag.value}}</td>
			<td style="vertical-align:middle;">
			{{#if computedTag.lowlowalert}}
				<div class="alert alert-danger" style="margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if computedTag.lowalert}}
				<div class="alert alert-warning" style="position:relative; left:20%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if computedTag.noalert}}
				<div class="alert alert-success" style="position:relative; left:40%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if computedTag.highalert}}
				<div class="alert alert-warning" style="position:relative; left:60%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}

			{{#if computedTag.highhighalert}}
				<div class="alert alert-danger" style="position:relative; left:80%; margin:0px; padding:0px; width:20%; display:inline-block;">&nbsp;</div>
			{{/if}}
			</td>
		</tr>
		{{/each}}
		</tbody>
		</table>
	</div>
</div>
</script>
