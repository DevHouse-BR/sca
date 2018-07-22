Ext.namespace('Settings');

Settings.AdministrationSettings = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	columnLines: true,
	id:'AdministrationSettings',
	viewConfig: {
		autoFill: true,
		forceFit:true
	},
	autoExpandColumn: 'colDesc_AdministrationSettings',
	listeners:{
		beforerender:function(grid){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto: grid,
					acl: 2,
					tipo: 'funcao',
					funcao: '_onGridRowDblClick'
				}]
			});
		}
	},
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: 'settings/list',
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
				{name: 'nome', type: 'string'},
				{name: 'desc', type: 'string'},
				{name: 'parm', type: 'string'},
			]
		});
		var paginator = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30
		});
		Ext.apply(this, {
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			bbar: paginator,
			columns: [{
				dataIndex: 'nome',
				header: Application.app.language('administration.setting.grid.name.text'),
				width: 170,
				sortable: false
			}, {
				dataIndex: 'parm',
				header: Application.app.language('administration.setting.grid.value.text'),
				width: 170,
				sortable: false
			}, {
				id:'colDesc_AdministrationSettings',
				dataIndex: 'desc',
				header: Application.app.language('administration.setting.grid.help.text'),
				width: 300,
				sortable: false
			}]
		});
		Settings.AdministrationSettings.superclass.initComponent.call(this);
	},
	initEvents: function () {
		Settings.AdministrationSettings.superclass.initEvents.call(this);
		this.on({
			scope: this,
			rowdblclick: this._onGridRowDblClick
		});
	},
	onDestroy: function () {
		Settings.AdministrationSettings.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.setid(0);
		this.window.show();
	},
	_onBtnExcluirSelecionadosClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();
		if (arrSelecionados.length === 0) {
			uiHelper.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
			return false;
		}
		uiHelper.confirm(Application.app.language('grid.form.confirm.title'), Application.app.language('grid.form.confirm.delete'), function (opt) {
			if (opt === 'no') {
				return;
			}
			var id = [];
			for (var i = 0; i < arrSelecionados.length; i++) {
				id.push(arrSelecionados[i].get('id'));
			}
			this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				url: 'settings/delete',
				params: {
					'id[]': id
				},
				scope: this,
				success: function () {
					this.el.unmask();
					this.store.reload();
				}
			});
		},
		this);
	},
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		if(id == 2){
			this.newUpForm();
			this.upWindow.show();
		} else {
			this._newForm();
			this.window.setid(id);
			this.window.show();
		}
	},
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	newUpForm: function () {
		if(!this.upWindow) {
			this.upWindow = new Settings.AdministrationSettingsUpForm({
				renderTo: this.body
			});
		}
		return this.upWindow;
	},
	_newForm: function () {
		if (!this.window) {
			this.window = new Settings.AdministrationSettingsForm({
				renderTo: this.body,
				listeners: {
					scope: this,
					salvar: this._onCadastroUsuarioSalvarExcluir
				}
			});
		}
		return this.window;
	}
});
Ext.reg('administration-settings', Settings.AdministrationSettings);
