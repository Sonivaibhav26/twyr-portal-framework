<script type="text/x-handlebars" data-template-name="components/nutron-systems-flatbed-printing-machine">

<div class="row">
<div class="col-md-3">
	<div class="box box-primary">
	<div class="box-header">
		<h3 class="box-title">Current Batch Time</h3>
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-12">
				<table class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Uptime</td>
					<td style="vertical-align:middle;">{{P04.value}}</td>
					<td style="vertical-align:middle;">min</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Downtime</td>
					<td style="vertical-align:middle;">{{P05.value}}</td>
					<td style="vertical-align:middle;">min</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12" style="margin-top:10px;text-align:center;">
				<div id="div-nutron-systems-flatbed-printing-machine-current-batch-chart"></div>
			</div>
		</div>
	</div>
	</div>
</div>
<div class="col-md-3">
	<div class="box box-primary">
	<div class="box-header">
		<h3 class="box-title">Total Time</h3>
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-12">
				<table class="table table-bordered">
				<tbody>
				<tr>
					<td style="vertical-align:middle;">Uptime</td>
					<td style="vertical-align:middle;">{{P06.value}}</td>
					<td style="vertical-align:middle;">min</td>
				</tr>
				<tr>
					<td style="vertical-align:middle;">Downtime</td>
					<td style="vertical-align:middle;">{{P07.value}}</td>
					<td style="vertical-align:middle;">min</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12" style="margin-top:10px;text-align:center;">
				<div id="div-nutron-systems-flatbed-printing-machine-total-batch-chart"></div>
			</div>
		</div>
	</div>
	</div>
</div>
<div class="col-md-3">
	<div class="box box-primary">
	<div class="box-header">
		<h3 class="box-title">Current Batch Statistics</h3>
	</div>
	<div class="box-body">
		<table class="table table-bordered">
		<tbody>
		<tr>
			<td style="vertical-align:middle;">Repeat / Min</td>
			<td style="vertical-align:middle;">{{P01.value}}</td>
			<td style="vertical-align:middle;">nos</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">Length</td>
			<td style="vertical-align:middle;">{{P02.value}}</td>
			<td style="vertical-align:middle;">mtr</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">Production Speed</td>
			<td style="vertical-align:middle;">{{BatchProductionSpeed}}</td>
			<td style="vertical-align:middle;">mtr/min</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">Average Productivity</td>
			<td style="vertical-align:middle;">{{BatchAverageProductivity}}</td>
			<td style="vertical-align:middle;">mtr/min</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">{{P09.displayName}}</td>
			<td style="vertical-align:middle;">{{P09.value}}</td>
			<td rowspan="2" style="text-align:center;">{{P10.displayName}}<br />{{P10.value}}</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">{{P08.displayName}}</td>
			<td style="vertical-align:middle;">{{P08.value}}</td>
		</tr>
		</tbody>
		</table>
	</div>
	</div>
</div>
<div class="col-md-3">
	<div class="box box-primary">
	<div class="box-header">
		<h3 class="box-title">Total Statistics</h3>
	</div>
	<div class="box-body">
		<table class="table table-bordered">
		<tbody>
		<tr>
			<td style="vertical-align:middle;">Length</td>
			<td style="vertical-align:middle;">{{P03.value}}</td>
			<td style="vertical-align:middle;">mtr</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">Average Production Speed</td>
			<td style="vertical-align:middle;">{{TotalProductionSpeed}}</td>
			<td style="vertical-align:middle;">mtr/min</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">Average Productivity</td>
			<td style="vertical-align:middle;">{{TotalAverageProductivity}}</td>
			<td style="vertical-align:middle;">mtr/min</td>
		</tr>
		<tr>
			<td style="vertical-align:middle;">Equipment Utility</td>
			<td style="vertical-align:middle;">{{TotalEquipmentUtility}}</td>
			<td style="vertical-align:middle;">%age</td>
		</tr>
		</tbody>
		</table>
	</div>
	</div>
</div>
</div>
<div class="row" style="margin-top:15px;">
	<div class="col-md-7">
		<div class="box box-primary">
		<div class="box-header">
			<h3 class="box-title">Hourly Production - Graphical</h3>
		</div>
		<div class="box-body">
			<div id="div-nutron-systems-flatbed-printing-machine-hourly-production-chart"></div>
		</div>
		</div>
	</div>
	<div class="col-md-5">
		<div class="box box-primary">
		<div class="box-header">
			<h3 class="box-title">Hourly Production - Tabular</h3>
		</div>
		<div class="box-body">
		<div class="row">
			<div class="col-md-3">
				<table class="table table-bordered" style="font-size:10px;">
				<thead>
				<tr>
					<th>Hour</th>
					<th>Mtr</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>{{HourlyTime0}}</td>
					<td>{{HourlyProductivity0}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime1}}</td>
					<td>{{HourlyProductivity1}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime2}}</td>
					<td>{{HourlyProductivity2}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime3}}</td>
					<td>{{HourlyProductivity3}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime4}}</td>
					<td>{{HourlyProductivity4}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime5}}</td>
					<td>{{HourlyProductivity5}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime6}}</td>
					<td>{{HourlyProductivity6}}</td>
				</tr>
				</tbody>
				</table>
			</div>
			<div class="col-md-3">
				<table class="table table-bordered" style="font-size:10px;">
				<thead>
				<tr>
					<th>Hour</th>
					<th>Mtr</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>{{HourlyTime7}}</td>
					<td>{{HourlyProductivity7}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime8}}</td>
					<td>{{HourlyProductivity8}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime9}}</td>
					<td>{{HourlyProductivity9}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime10}}</td>
					<td>{{HourlyProductivity10}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime11}}</td>
					<td>{{HourlyProductivity11}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime12}}</td>
					<td>{{HourlyProductivity12}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime13}}</td>
					<td>{{HourlyProductivity13}}</td>
				</tr>
				</tbody>
				</table>
			</div>
			<div class="col-md-3">
				<table class="table table-bordered" style="font-size:10px;">
				<thead>
				<tr>
					<th>Hour</th>
					<th>Mtr</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>{{HourlyTime14}}</td>
					<td>{{HourlyProductivity14}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime15}}</td>
					<td>{{HourlyProductivity15}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime16}}</td>
					<td>{{HourlyProductivity16}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime17}}</td>
					<td>{{HourlyProductivity17}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime18}}</td>
					<td>{{HourlyProductivity18}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime19}}</td>
					<td>{{HourlyProductivity19}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime20}}</td>
					<td>{{HourlyProductivity20}}</td>
				</tr>
				</tbody>
				</table>
			</div>
			<div class="col-md-3">
				<table class="table table-bordered" style="font-size:10px;">
				<thead>
				<tr>
					<th>Hour</th>
					<th>Mtr</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>{{HourlyTime21}}</td>
					<td>{{HourlyProductivity21}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime22}}</td>
					<td>{{HourlyProductivity22}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime23}}</td>
					<td>{{HourlyProductivity23}}</td>
				</tr>
				<tr>
					<td>{{HourlyTime24}}</td>
					<td>{{HourlyProductivity24}}</td>
				</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		</div>
	</div>
</div>
<div class="row" style="margin-top:15px;">
	<div class="col-md-7">
		<div class="box box-primary">
		<div class="box-header">
			<h3 class="box-title">Daily Production - Graphical</h3>
		</div>
		<div class="box-body">
			<div id="div-nutron-systems-flatbed-printing-machine-daily-production-chart"></div>
		</div>
		</div>
	</div>
	<div class="col-md-5">
		<div class="box box-primary">
		<div class="box-header">
			<h3 class="box-title">Daily Production - Tabular</h3>
		</div>
		<div class="box-body">
			<div class="row">
				<div class="col-md-3">
					<table class="table table-bordered" style="font-size:10px;">
					<thead>
					<tr>
						<th>Day</th>
						<th>Mtr</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>{{DailyTime0}}</td>
						<td>{{DailyProductivity0}}</td>
					</tr>
					<tr>
						<td>{{DailyTime1}}</td>
						<td>{{DailyProductivity1}}</td>
					</tr>
					<tr>
						<td>{{DailyTime2}}</td>
						<td>{{DailyProductivity2}}</td>
					</tr>
					<tr>
						<td>{{DailyTime3}}</td>
						<td>{{DailyProductivity3}}</td>
					</tr>
					<tr>
						<td>{{DailyTime4}}</td>
						<td>{{DailyProductivity4}}</td>
					</tr>
					<tr>
						<td>{{DailyTime5}}</td>
						<td>{{DailyProductivity5}}</td>
					</tr>
					<tr>
						<td>{{DailyTime6}}</td>
						<td>{{DailyProductivity6}}</td>
					</tr>
					<tr>
						<td>{{DailyTime7}}</td>
						<td>{{DailyProductivity7}}</td>
					</tr>
					</tbody>
					</table>
				</div>
				<div class="col-md-3">
					<table class="table table-bordered" style="font-size:10px;">
					<thead>
					<tr>
						<th>Day</th>
						<th>Mtr</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>{{DailyTime8}}</td>
						<td>{{DailyProductivity8}}</td>
					</tr>
					<tr>
						<td>{{DailyTime9}}</td>
						<td>{{DailyProductivity9}}</td>
					</tr>
					<tr>
						<td>{{DailyTime10}}</td>
						<td>{{DailyProductivity10}}</td>
					</tr>
					<tr>
						<td>{{DailyTime11}}</td>
						<td>{{DailyProductivity11}}</td>
					</tr>
					<tr>
						<td>{{DailyTime12}}</td>
						<td>{{DailyProductivity12}}</td>
					</tr>
					<tr>
						<td>{{DailyTime13}}</td>
						<td>{{DailyProductivity13}}</td>
					</tr>
					<tr>
						<td>{{DailyTime14}}</td>
						<td>{{DailyProductivity14}}</td>
					</tr>
					<tr>
						<td>{{DailyTime15}}</td>
						<td>{{DailyProductivity15}}</td>
					</tr>
					</tbody>
					</table>
				</div>
				<div class="col-md-3">
					<table class="table table-bordered" style="font-size:10px;">
					<thead>
					<tr>
						<th>Day</th>
						<th>Mtr</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>{{DailyTime16}}</td>
						<td>{{DailyProductivity16}}</td>
					</tr>
					<tr>
						<td>{{DailyTime17}}</td>
						<td>{{DailyProductivity17}}</td>
					</tr>
					<tr>
						<td>{{DailyTime18}}</td>
						<td>{{DailyProductivity18}}</td>
					</tr>
					<tr>
						<td>{{DailyTime19}}</td>
						<td>{{DailyProductivity19}}</td>
					</tr>
					<tr>
						<td>{{DailyTime20}}</td>
						<td>{{DailyProductivity20}}</td>
					</tr>
					<tr>
						<td>{{DailyTime21}}</td>
						<td>{{DailyProductivity21}}</td>
					</tr>
					<tr>
						<td>{{DailyTime22}}</td>
						<td>{{DailyProductivity22}}</td>
					</tr>
					<tr>
						<td>{{DailyTime23}}</td>
						<td>{{DailyProductivity23}}</td>
					</tr>
					</tbody>
					</table>
				</div>
				<div class="col-md-3">
					<table class="table table-bordered" style="font-size:10px;">
					<thead>
					<tr>
						<th>Day</th>
						<th>Mtr</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>{{DailyTime24}}</td>
						<td>{{DailyProductivity24}}</td>
					</tr>
					<tr>
						<td>{{DailyTime25}}</td>
						<td>{{DailyProductivity25}}</td>
					</tr>
					<tr>
						<td>{{DailyTime26}}</td>
						<td>{{DailyProductivity26}}</td>
					</tr>
					<tr>
						<td>{{DailyTime27}}</td>
						<td>{{DailyProductivity27}}</td>
					</tr>
					<tr>
						<td>{{DailyTime28}}</td>
						<td>{{DailyProductivity28}}</td>
					</tr>
					<tr>
						<td>{{DailyTime29}}</td>
						<td>{{DailyProductivity29}}</td>
					</tr>
					<tr>
						<td>{{DailyTime30}}</td>
						<td>{{DailyProductivity30}}</td>
					</tr>
					<tr>
						<td>{{DailyTime31}}</td>
						<td>{{DailyProductivity31}}</td>
					</tr>
					</tbody>
					</table>
				</div>
			</div>
	</div>
		</div>
	</div>
</div>
</script>
