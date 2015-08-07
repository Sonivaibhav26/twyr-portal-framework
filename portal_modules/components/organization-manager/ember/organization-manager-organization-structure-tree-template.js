<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-tree">
	<div class="box box-solid box-default" style="text-align:left; margin-bottom:0px; border-radius:0px;">
		<div class="box-header with-border">
			{{#if model.isDepartment}}
				<h3 class="box-title">{{model.name}}</h3>
			{{/if}}

			{{#if model.isOrganization}}
				<h3 class="box-title">{{model.name}}</h3>
			{{/if}}

			{{#if model.partner}}
				<h3 class="box-title">Business Partner</h3>
			{{/if}}

			{{#if isChild}}
			<div class="box-tools" style="padding:5px; cursor:pointer;">
				{{#if parent.isDepartment}}
					<i class="fa fa-level-up" title="Back to {{parent.name}}" style="font-weight:900;" {{action "setCurrentWidget" "department" parent.parent parent bubbles=false}} />
				{{/if}}

				{{#if parent.isOrganization}}
					<i class="fa fa-level-up" title="Back to {{parent.name}}" style="font-weight:900;" {{action "setCurrentWidget" "subsidiary" parent.parent parent bubbles=false}} />
				{{/if}}
			</div>
			{{/if}}
		</div>

		{{#if model.isDepartment}}
		<div class="box-body no-padding collapse in">
			<ul class="nav nav-pills nav-stacked">
				<li><a href="#" {{action "setCurrentWidget" "about" null model bubbles=false}}>About {{model.name}}</a></li>
			</ul>
		</div>
		{{/if}}

		{{#if model.isOrganization}}
		<div class="box-body no-padding collapse in">
			<ul class="nav nav-pills nav-stacked">
				<li><a href="#" {{action "setCurrentWidget" "about" null model bubbles=false}}>About {{model.name}}</a></li>
			</ul>
		</div>
		{{/if}}
	</div>

	{{#if model.isDepartment}}
	<div class="box box-solid box-default" style="text-align:left; margin-bottom:0px; border-radius:0px;">
		<div class="box-header with-border">
			<h3 class="box-title">Departments</h3>
			<div class="box-tools">
				<button class="btn btn-box-tool" data-widget="collapse">
					<i class="fa fa-minus" />
				</button>
			</div>
		</div>
		<div class="box-body no-padding collapse in">
			<ul class="nav nav-pills nav-stacked">
				<li style="text-align:center; padding:5px;">
					<a href="#" class="label label-primary" {{action "setCurrentWidget" "department" model bubbles=false}}>
						<i class="fa fa-plus" style="margin-right:5px;" />
						<span>Add Department</span>
					</a>
				</li>
				{{#each model.suborganizations key="id" as |suborganization index|}}
				{{#if suborganization.isDepartment}}
					<li>
						<a href="#"{{action "setCurrentWidget" "department" model suborganization bubbles=false}}>
							{{suborganization.name}}
							<span class="label label-danger pull-right" title="Delete {{suborganization.name}}" {{action "deleteOrganization" model suborganization bubbles=false}}>
								<i class="fa fa-remove" />
							</span>
						</a>
					</li>
				{{/if}}
				{{/each}}
			</ul>
		</div>
	</div>
	{{/if}}

	{{#if model.isOrganization}}
	<div class="box box-solid box-default" style="text-align:left; margin-bottom:0px; border-radius:0px;">
		<div class="box-header with-border">
			<h3 class="box-title">Departments</h3>
			<div class="box-tools">
				<button class="btn btn-box-tool" data-widget="collapse">
					<i class="fa fa-minus" />
				</button>
			</div>
		</div>
		<div class="box-body no-padding collapse in">
			<ul class="nav nav-pills nav-stacked">
				<li style="text-align:center; padding:5px;">
					<a href="#" class="label label-primary" {{action "setCurrentWidget" "department" model bubbles=false}}>
						<i class="fa fa-plus" style="margin-right:5px;" />
						<span>Add Department</span>
					</a>
				</li>
				{{#each model.suborganizations key="id" as |suborganization index|}}
				{{#if suborganization.isDepartment}}
					<li>
						<a href="#"{{action "setCurrentWidget" "department" model suborganization bubbles=false}}>
							{{suborganization.name}}
							<span class="label label-danger pull-right" title="Delete {{suborganization.name}}" {{action "deleteOrganization" model suborganization bubbles=false}}>
								<i class="fa fa-remove" />
							</span>
						</a>
					</li>
				{{/if}}
				{{/each}}
			</ul>
		</div>
	</div>

	<div class="box box-solid box-default" style="text-align:left; margin-bottom:0px; border-radius:0px;">
		<div class="box-header with-border">
			<h3 class="box-title">Subsidiaries</h3>
			<div class="box-tools">
				<button class="btn btn-box-tool" data-widget="collapse">
					<i class="fa fa-minus" />
				</button>
			</div>
		</div>
		<div class="box-body no-padding collapse in">
			<ul class="nav nav-pills nav-stacked">
				<li style="text-align:center; padding:5px;">
					<a href="#" class="label label-primary" {{action "setCurrentWidget" "subsidiary" model bubbles=false}}>
						<i class="fa fa-plus" style="margin-right:5px;" />
						<span>Add Subsidiary</span>
					</a>
				</li>
				{{#each model.suborganizations key="id" as |suborganization index|}}
				{{#if suborganization.isOrganization}}
					<li>
						<a href="#"{{action "setCurrentWidget" "subsidiary" model suborganization bubbles=false}}>
							{{suborganization.name}}
							<span class="label label-danger pull-right" title="Delete {{suborganization.name}}" {{action "deleteOrganization" model suborganization bubbles=false}}>
								<i class="fa fa-remove" />
							</span>
						</a>
					</li>
				{{/if}}
				{{/each}}
			</ul>
		</div>
	</div>

	<div class="box box-solid box-default" style="text-align:left; margin-bottom:0px; border-radius:0px;">
		<div class="box-header with-border">
			<h3 class="box-title">Business Partners</h3>
			<div class="box-tools">
				<button class="btn btn-box-tool" data-widget="collapse">
					<i class="fa fa-minus" />
				</button>
			</div>
		</div>
		<div class="box-body no-padding collapse in">
			<ul class="nav nav-pills nav-stacked">
				<li style="text-align:center; padding:5px;">
					<a href="#" class="label label-primary" {{action "setCurrentWidget" "partner" model bubbles=false}}>
						<i class="fa fa-plus" style="margin-right:5px;" />
						<span>Add Partner</span>
					</a>
				</li>
				{{#each model.partners key="id" as |partner index|}}
					<li>
						<a href="#" {{action "setCurrentWidget" "partner" model partner bubbles=false}}>
							{{partner.partner.name}}
							<span class="label label-danger pull-right" title="Delete {{partner.partner.name}}" {{action "deletePartner" model partner bubbles=false}}>
								<i class="fa fa-remove" />
							</span>
						</a>
					</li>
				{{/each}}
			</ul>
		</div>
	</div>
	{{/if}}
</script>
