<script type="text/x-handlebars" data-template-name="organization-manager-organization-structure">
<div class="box box-default" style="text-align:left; margin-bottom:0px; box-shadow:none;">
	<div class="box-header with-border">
		<h3 class="box-title">Organization Structure</h3>
	</div>
	<div class="box-body" style="text-align:center;">
	<div class="row">
		<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
			{{organization-manager-organization-structure-tree parent=displayParentModel model=displayModel setCurrentWidget="setCurrentWidget"}}
		</div>
		<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
			{{component displayComponent parent=displayParentModel model=displayModel}}
		</div>
	</div>
	</div>
</div>
</script>
