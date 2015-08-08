<script type="text/x-handlebars" data-template-name="components/organization-manager-organization-structure-user-manager">
<div class="box box-primary" style="text-align:left;">
<form role="form">
	<div class="box-header with-border" style="height:50px;">
		<h3 class="box-title">{{model.name}} User Manager</h3>
		<div class="pull-right" style="cursor:pointer; margin:0px 5px;" {{action "add" bubbles=false}}>
		    <button class="btn btn-primary btn-sm">
				<i class="fa fa-plus" style="margin-right:5px;" /><span>Add User</span>	
		    </button>
		</div>
	</div>
	<div class="box-body">
	<table class="table table-bordered datatable">
		<thead>
			<tr>
				<th>Login</th>
				<th>First Name</th>
				<th>Last Name</th>
				<th style="width:10%;">&nbsp;</th>
			</tr>
		</thead>
		<tbody>
		{{#each model.users key="id" as |user index|}}
			<tr>
				<td class="form-group" style="vertical-align:middle;">
				{{#if user.isNew}}
					<select id="organization-manager-organization-structure-user-manager-select-{{user.id}}" class="form-control" />
				{{else}}
					{{user.user.email}}
				{{/if}}
				</td>
				<td style="vertical-align:middle;">{{user.user.firstName}}</td>
				<td style="vertical-align:middle;">{{user.user.lastName}}</td>
				<td style="vertical-align:middle; text-align:right;">
				{{#if user.isNew}}
				    <button class="btn btn-danger btn-sm" {{action "delete" user}}>
						<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>	
				    </button>
				{{/if}}
				{{#if isUserRemovable}}
				    <button class="btn btn-danger btn-sm" {{action "delete" user}}>
						<i class="fa fa-remove" style="margin-right:5px;" /><span>Delete</span>	
				    </button>
				{{/if}}
				</td>
			</tr>
		{{/each}}
		</tbody>
	</table>
	</div>
</form>
</div>
</script>
