<script type="text/x-handlebars" data-template-name="components/machine-manager-realtime-data-machine-tabs">
<div class="nav-tabs-custom" style="padding:0px; padding-top:10px; border-top:3px solid #d2d6de;">
	<ul class="nav nav-tabs">
	{{#each model key="id" as |machine index|}}
		{{#if machine.isWatched}}
			<li>
				<a href="#machine-manager-realtime-data-tab-{{machine.id}}" data-toggle="tab">
					{{machine.name}}
					<i class="fa fa-close" style="margin-left:5px; color:red; cursor:pointer;" {{action "controller-action" "unwatch" machine bubbles=false}} />
				</a>
			</li>
		{{/if}}
	{{/each}}
	</ul>
	<div class="tab-content" style="padding:0px;">
	{{#each model key="id" as |machine index|}}
		{{#if machine.isWatched}}
			<div class="tab-pane" id="machine-manager-realtime-data-tab-{{machine.id}}" style="padding:0px;">
				{{log 'Component' machine.emberComponent 'Layout' machine.emberTemplate}}
				{{component machine.emberComponent model=machine streamer=streamer layoutName=machine.emberTemplate controller-action="controller-action"}}
			</div>
		{{/if}}
	{{/each}}
	</div>
</div>
</script>

<script type="text/x-handlebars" data-template-name="components/machine-manager-realtime-data-machine-list">
<table class="table table-bordered table-hover table-striped">
<thead>
	<tr>
		<th style="text-align:center; vertical-align:middle;">Machine Name</th>
		<th style="text-align:center; vertical-align:middle;">Organization</th>
		<th style="text-align:center; vertical-align:middle;">Manufacturer Details</th>
		<th style="text-align:center; vertical-align:middle;">PLC Details</th>
		<th style="text-align:center; vertical-align:middle;">Protocol Details</th>
		<th style="text-align:center; vertical-align:middle;">Active From</th>
	</tr>
</thead>
<tbody>
{{#each model key="id" as |machine index|}}
<tr {{action "controller-action" "watch" machine bubbles=false}}>
	<td style="vertical-align:middle;">{{machine.name}}</td>
	<td style="vertical-align:middle;">{{machine.tenantName}}</td>
	<td style="vertical-align:middle;">{{machine.machineManufacturer}}<br />{{machine.machineModel}}</td>
	<td style="vertical-align:middle;">{{machine.plcManufacturer}}<br />{{machine.plcModel}}</td>
	<td style="vertical-align:middle;">{{machine.protocolName}}<br />Version: {{machine.protocolVersion}}</td>
	<td style="vertical-align:middle;">{{machine.formattedCreatedOn}}</td>
</tr>
{{/each}}
</tbody>
</table>
</script>

<script type="text/x-handlebars" data-template-name="machine-manager-realtime-data">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Machine Data</h3>
	</div>
	<div class="box-body">
		{{machine-manager-realtime-data-machine-list model=model controller-action="controller-action"}}
	</div>
	{{#if watchedCount}}
	<div class="box-body" style="margin-top:20px;">
		{{machine-manager-realtime-data-machine-tabs model=model controller-action="controller-action"}}
	</div>
	{{/if}}
</div>
</script>
