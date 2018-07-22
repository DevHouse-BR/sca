Ext.namespace('User');
User.sm = new Ext.grid.CheckboxSelectionModel();
User.AdministrationUserWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: User.sm,
	columnLines: true,
	listeners:{
		beforerender:function(grid){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto:'btnNovoUsuario_AdministrationUserWindow',
					acl:5,
					tipo:'componente'
				},{
					objeto:'btnExcluirUsuario_AdministrationUserWindow',
					acl:6,
					tipo:'componente'
				},{
					objeto:'btnGrupoUsuario_AdministrationUserWindow',
					acl:12,
					tipo:'componente'
				},{
					objeto:grid.getColumnModel(),
					acl:14,
					tipo:'coluna',
					columnIndex:9
				},{
					objeto:grid,
					funcao:'_onGridRowDblClick',
					acl:4,
					tipo:'funcao'
				}]
			});
		}
	},
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: 'user/list',
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
				{name: 'nome_usuario', type: 'string'},
				{name: 'login_usuario', type: 'string'},
				{name: 'email', type: 'string'},
				{name: 'nome_departamento', type: 'string'},
				{name: 'idioma_usuario', type: 'string'},
				{name: 'recebe_mensagem', type: 'string'},
				{name: 'fl_status', type: 'string'},
				{name: 'nome_account', type: 'string'}
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
			tbar: ['->',
			{
				text: Application.app.language('grid.form.add'),
				iconCls: 'silk-add',
				id:'btnNovoUsuario_AdministrationUserWindow',
				scope: this,
				handler: this._onBtnNovoUsuarioClick
			},{
				text: Application.app.language('grid.form.delete'),
				iconCls: 'silk-delete',
				id:'btnExcluirUsuario_AdministrationUserWindow',
				scope: this,
				handler: this._onBtnExcluirSelecionadosClick
			},{
				text: Application.app.language('administration.user.group.label'),
				iconCls: 'silk-group',
				scope: this,
				id:'btnGrupoUsuario_AdministrationUserWindow',
				handler: this._onBntGroupClick
			}],
			columns: [User.sm, {
				dataIndex: 'id',
				header: Application.app.language('administration.user.form.id.text'),
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nome_usuario',
				header: Application.app.language('administration.user.form.name.text'),
				sortable: true
			}, {
				dataIndex: 'login_usuario',
				header: Application.app.language('administration.user.form.username.text'),
				sortable: true
			}, {
				dataIndex: 'email',
				header: Application.app.language('administration.user.form.email.text'),
				sortable: true
			}, {
				dataIndex: 'nome_departamento',
				header: Application.app.language('administration.user.form.departamentos.text'),
				sortable: true
	
			}, {
				dataIndex: 'idioma_usuario',
				header: Application.app.language('administration.user.form.language.text'),
				sortable: true,
				renderer: function (e) {
					for (i = 0; i < Application.app.languages.length; i++) {
						if (Application.app.languages[i][0] == e) {
							return Application.app.languages[i][1];
						}
					}
				}
			}, {
				dataIndex: 'recebe_mensagem',
				header: Application.app.language('administration.user.form.mensagem'),
				sortable: true,
				width: 80,
				renderer: function (e) {
					if(e == 'true') { 
						return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="' + Application.app.language('administration.user.form.status.active') + '" title="' + Application.app.language('administration.user.form.status.active') + '" /></center>';
					} else {
						return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="' + Application.app.language('administration.user.form.status.inactive') + '" title="' + Application.app.language('administration.user.form.status.inactive') + '" /></center>';
					}
				}
			}, {

				dataIndex: 'fl_status',
				header: Application.app.language('administration.user.form.status.text'),
				sortable: true,
				width: 40,
				renderer: function (e) {
					if (e == 'true') {
						return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="' + Application.app.language('administration.user.form.status.active') + '" title="' + Application.app.language('administration.user.form.status.active') + '" /></center>';
					} else {
						return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="' + Application.app.language('administration.user.form.status.inactive') + '" title="' + Application.app.language('administration.user.form.status.inactive') + '" /></center>';
					}
				}
			}, {
				dataIndex: 'nome_account',
				header: Application.app.language('administration.user.form.account.text'),
				sortable: false,
				width: 120
			}]
		});
		User.AdministrationUserWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		User.AdministrationUserWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			rowdblclick: this._onGridRowDblClick
		});
	},
	onDestroy: function () {
		User.AdministrationUserWindow.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	_onBntGroupClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();
		if (arrSelecionados.length > 1) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('administration.user.group.manyerror')});
			return false;
		}
		if (arrSelecionados.length === 0) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('administration.user.group.oneerror')});
			return false;
		}
		var id = arrSelecionados[0].get('id');
		this.newGroup();
		this.group.setUser(id);
		this.group.show();
		return true;
	},
	newGroup: function () {
		if (!this.group) {
			this.group = new User.AdministrationUserGroup({
				renderTo: this.body,
				listeners: {
					scope: this
				}
			});
		}
		return this.group;
	},
	_onBtnExcluirSelecionadosClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();
		if (arrSelecionados.length === 0) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
			return false;
		}
		Application.app.confirm(Application.app.language('grid.form.confirm.title'), Application.app.language( 'grid.form.confirm.delete') , function (opt) {
			if (opt === 'no') {
				return;
			}
			var id = [];
			for (var i = 0; i < arrSelecionados.length; i++) {
				id.push(arrSelecionados[i].get('id'));
			}
			//this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				url: 'user/delete',
				params: {
					'id[]': id
				},
				scope: this,
				success: function (a, b) {
					try {
						var c = Ext.decode(a.responseText);
					} catch (e) {};
					this.store.reload();
					if (c.success == false) {
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
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		var idiomaDoCaboclo = record.get('idioma_usuario');
		this._newForm();
		this.window.setUser(id);
		this.window.setIdiomaGet(idiomaDoCaboclo);
		this.window.show();
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.setUser(0);
		this.window.show();
	},
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	_newForm: function () {
		//if (!this.window) {
			this.window = new User.AdministrationUserForm({
				renderTo: this.body,
				listeners: {
					scope: this,
					salvar: this._onCadastroUsuarioSalvarExcluir,
					excluir: this._onCadastroUsuarioSalvarExcluir
				}
			});
		//}
		return this.window;
	}
});
Ext.reg('administration-user', User.AdministrationUserWindow);
