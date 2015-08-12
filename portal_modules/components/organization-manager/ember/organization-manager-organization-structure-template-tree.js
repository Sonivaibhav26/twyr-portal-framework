<script type="text/x-handlebars" data-template-name="components/organization-manager-sub-organization-structure-tree">
	<div class="box box-solid box-default" style="text-align:left; margin-bottom:0px; border-radius:0px;">
		<div class="box-header with-border">
			{{#if model.isDepartment}}
				<h3 class="box-title">{{model.name}}</h3>
			{{/if}}

			{{#if model.isOrganization}}
				<h3 class="box-title">{{model.name}}</h3>
			{{/if}}

			{{#if model.isPartner}}
				<h3 class="box-title">{{model.partner.name}}</h3>
			{{/if}}
		</div>
		<div class="box-body no-padding">
			<ul class="nav nav-pills nav-stacked">
				<li style="text-align:left;">
					{{#link-to "organization-manager-sub-organization-structure"}}<i class="fa fa-futbol-o" /><span>About {{model.name}}</span>{{/link-to}}
				</li>
				{{#unless model.isNew}}
					{{#if model.isDepartment}}
						<li style="text-align:left;">
							{{#link-to "organization-manager-sub-organization-structure.departments" model}}<i class="fa fa-futbol-o" /><span>Departments</span>{{/link-to}}
						</li>
					{{/if}}

					{{#if model.isOrganization}}
						<li style="text-align:left;">
							{{#link-to "organization-manager-sub-organization-structure.departments" model}}<i class="fa fa-futbol-o" /><span>Departments</span>{{/link-to}}
						</li>
						<li style="text-align:left;">
							{{#link-to "organization-manager-sub-organization-structure.subsidiaries" model}}<i class="fa fa-futbol-o" /><span>Subsidiaries</span>{{/link-to}}
						</li>
						<li style="text-align:left;">
							{{#link-to "organization-manager-sub-organization-structure.partners" model}}<i class="fa fa-futbol-o" /><span>Vendors</span>{{/link-to}}
						</li>
					{{/if}}
				{{/unless}}
			</ul>
		</div>
	</div>
</script>
