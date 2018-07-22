Ext.namespace('Groups');

Groups.sm = new Ext.grid.CheckboxSelectionModel();
Groups.AdministrationGroupWindowFilter = new Ext.ux.grid.GridFilters({
	local: false,
	menuFilterText: Application.app.language('grid.filter.label'),
	filters: [{
		type: 'string',
		dataIndex: 'name',
		phpMode: true
	}, {
		type: 'string',
		dataIndex: 'nome_account',
		phpMode: true
	}]
});
Groups.AdministrationGroupWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: Groups.sm,
	columnLines: true,
	plugins: [Groups.AdministrationGroupWindowFilter],
	listeners:{
		beforerender:function(grid){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto:'btnAdicionar_AdministrationGroupWindow',
					acl:9,
					tipo:'componente'
				},{
					objeto:'btnDelete_AdministrationGroupWindow',
					acl:10,
					tipo:'componente'
				},{
					objeto:'btnPermissions_AdministrationGroupWindow',
					acl:11,
					tipo:'componente'
				},{
					objeto:grid.getColumnModel(),
					acl:14,
					tipo:'coluna',
					columnIndex:3
				},{
					objeto:grid,
					funcao:'_onGridRowDblClick',
					acl:8,
					tipo:'funcao'
				},{
					objeto:grid,
					funcao:'_onCadastroUsuarioSalvarExcluir',
					acl:[8,9,10],
					tipo:'funcao'
				},{
					objeto:grid,
					funcao:'_newForm',
					acl:[8,9],
					tipo:'funcao'
				}]
			});
		}
	},
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: 'group/list',
			root: 'data',
			idProperty: 'id',
			totalProperty: 'total',
			autoLoad: true,
			autoDestroy: true,
			remoteSort: true,
			sortInfo: {
				field: 'id',
				direction: 'ASC'
			},
			baseParams: {
				limit: 30
			},
			fields: [
				{name: 'id', type: 'int'},
				{name: 'name', type: 'string'},
				{name: 'nome_account', type: 'string'}
			]
		});
		var paginator = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30,
			plugins: [Groups.AdministrationGroupWindowFilter]
		});
		paginator.addSeparator();
		var button = new Ext.Toolbar.Button();
		button.text = Application.app.language('grid.bbar.clearfilter');
		button.addListener('click', function(a, b) {
			Groups.AdministrationGroupWindowFilter.clearFilters();
		});
		paginator.addButton(button);
		Ext.apply(this, {
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			bbar: paginator,
			tbar: ['->',
			{
				text: Application.app.language('grid.form.add'),
				iconCls: 'silk-add',
				id:'btnAdicionar_AdministrationGroupWindow',
				scope: this,
				handler: this._onBtnNovoUsuarioClick
			},{
				text: Application.app.language('grid.form.delete'),
				iconCls: 'silk-delete',
				id:'btnDelete_AdministrationGroupWindow',
				scope: this,
				handler: this._onBtnExcluirSelecionadosClick
			},{
				text: Application.app.language('administration.group.permission.label'),
				iconCls: 'silk-key',
				id:'btnPermissions_AdministrationGroupWindow',
				scope: this,
				handler: this._onBntPermissionClick
			}],
			columns: [Groups.sm, {
				dataIndex: 'id',
				header: Application.app.language('administration.group.form.id.text'),
				width: 40,
				sortable: true
			}, {
				dataIndex: 'name',
				header: Application.app.language('administration.group.form.name.text'),
				sortable: true
			}, {
				dataIndex: 'nome_account',
				header: Application.app.language('administration.group.account.text'),
				sortable: true
			}]
		});
		Groups.AdministrationGroupWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		Groups.AdministrationGroupWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			rowdblclick: this._onGridRowDblClick
		});
	},
	onDestroy: function () {
		Groups.AdministrationGroupWindow.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	_onBntPermissionClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();
		if (arrSelecionados.length > 1) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('administration.group.permission.manyerror')});
			return false;
		}
		if (arrSelecionados.length === 0) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('administration.group.permission.oneerror')});
			return false;
		}
		var group = arrSelecionados[0].get('id');
		this.newPermission();
		this.permission.setGroup(group);
		this.permission.show();
		return true;
	},
	newPermission: function () {
		if (!this.permission) {
			this.permission = new Groups.AdministrationGroupPermission({
				renderTo: this.body,
				listeners: {
					scope: this
				}
			});
		}
		return this.permission;
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.setGroup(0);
		this.window.show();
	},
	_onBtnExcluirSelecionadosClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();
		if (arrSelecionados.length === 0) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
			return false;
		}
		Application.app.confirm(Application.app.language('grid.form.confirm.title'), Application.app.language('grid.form.confirm.delete'), function (opt) {
			if (opt === 'no') {
				return;
			}
			var id = [];
			for (var i = 0; i < arrSelecionados.length; i++) {
				id.push(arrSelecionados[i].get('id'));
			}
			//this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				url: 'group/delete',
				params: {
					'id[]': id
				},
				scope: this,
				success: function (a, b) {
					try {
						var c = Ext.decode(a.responseText);
					} catch (e) {};
					this.store.reload();
					if (c.sucess == false) {
						Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: c.errormsg});
						return;
					}
					Application.app.showNotification({
						title:Application.app.language('operation.sucess.title'),
						iconCls:'icon-ok',
						html: Application.app.language('operation.sucess')
					});
					//this.el.unmask();
					
				},
				failure:Application.app.failHandler
			});
		},
		this);
	},
	
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		this._newForm();
		this.window.setGroup(id);
		this.window.show();
	},
	
	_newForm: function () {
		if (!this.window) {
			this.window = new Groups.AdministrationGroupForm({
				renderTo: this.body,
				listeners: {
					scope: this,
					salvar: this._onCadastroUsuarioSalvarExcluir,
					excluir: this._onCadastroUsuarioSalvarExcluir
				}
			});
		}
		return this.window;
	}
});

Ext.reg('administration-group', Groups.AdministrationGroupWindow);