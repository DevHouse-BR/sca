Clientes.ControleClienteUserTab = Ext.extend(Ext.grid.GridPanel, {
	clienteId: 0,
	border: false,
	stripeRows: true,
	loadMask: true,
	columnLines: true,
	viewConfig: {
		emptyText: Application.app.language('grid.empty'),
		deferEmptyText: false
	},
	listeners:{
		beforerender:function(grid){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto:'btnNovoUsuario_ControleClienteUserTab' + this.clienteId,
					acl:20,
					tipo:'componente'
				},{
					objeto:'btnExcluirUsuario_ControleClienteUserTab' + this.clienteId,
					acl:20,
					tipo:'componente'
				},{
					objeto:grid,
					funcao:'_onGridRowDblClick',
					acl:20,
					tipo:'funcao'
				}]
			});
		}
	},
	initComponent: function() {
		var selectionModel = new Ext.grid.CheckboxSelectionModel();
		this.selModel = selectionModel;
		this.store = new Ext.data.JsonStore({
			url: 'clientes/list_cli_user',
			root: 'data',
			idProperty: 'id',
			totalProperty: 'total',
			remoteSort: true,
			sortInfo: {
				field: 'id',
				direction: 'ASC'
			},
			baseParams: {
				limit: 30,
				id: this.clienteId
			},
			listeners:{
				scope:this,
				exception: Application.app.failHandler,
				beforeload: function(store, options){
					store.baseParams.id = this.clienteId;
				}
			},
			fields: [
				{name: 'id', type: 'string'},
				{name: 'nome_usuario', type: 'string'},
				{name: 'login_usuario', type: 'string'},
				{name: 'email', type: 'string'},
				{name: 'idioma_usuario', type: 'string'},
				{name: 'recebe_mensagem', type: 'boolean'}
			]
		});
		
		this.colModel = new Ext.grid.ColumnModel({
			 defaults: {
			 	sortable:true
			 },
			 columns:[selectionModel, {
				dataIndex: 'id',
				header: Application.app.language('controle.clientes.usuarios.id.text'),
				width: 40
			},{
				dataIndex: 'nome_usuario',
				header: Application.app.language('controle.clientes.usuarios.nome.text'),
				width: 120
			},{
				dataIndex: 'login_usuario',
				header: Application.app.language('controle.clientes.usuarios.login.text'),
				width: 120
			},{
				dataIndex: 'email',
				header: Application.app.language('controle.clientes.usuarios.email.text'),
				width: 120
			},{
				dataIndex: 'idioma_usuario',
				header: Application.app.language('controle.clientes.usuarios.idioma.text'),
				width: 120,
				renderer: function (e) {
					for (i = 0; i < Application.app.languages.length; i++) {
						if (Application.app.languages[i][0] == e) {
							return Application.app.languages[i][1];
						}
					}
				}
			},{
				dataIndex: 'recebe_mensagem',
				header: Application.app.language('controle.clientes.usuarios.mensagem.text'),
				width: 90,
				renderer: function (e) {
					if(e == true) {
						return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="' + Application.app.language('administration.user.form.status.active') + '" title="' + Application.app.language('administration.user.form.status.active') + '" /></center>';
					}
					else {
						return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="' + Application.app.language('administration.user.form.status.inactive') + '" title="' + Application.app.language('administration.user.form.status.inactive') + '" /></center>';
					}
				}
			}]
		});
		
		this.tbar = new Ext.Toolbar({
			items:['->', {
				text: Application.app.language('grid.form.add'),
				id:'btnNovoUsuario_ControleClienteUserTab' + this.clienteId,
				iconCls: 'silk-add',
				scope: this,
				handler: this._onBtnNovoUsuarioClick
			},{
				text: Application.app.language('grid.form.delete'),
				iconCls: 'silk-delete',
				id:'btnExcluirUsuario_ControleClienteUserTab' + this.clienteId,
				scope: this,
				handler: this._onBtnExcluirSelecionadosClick
			}]
		});
		
		this.bbar = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30,
			animate: true
		});

		this.on({
			scope: this,
			rowdblclick: this._onRowDoubleClick
		});
		
		
		Clientes.ControleClienteUserTab.superclass.initComponent.call(this);
	},
	
	_setClienteId: function (cliente){
		this.clienteId = cliente;
	},
	
	_onRowDoubleClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var idUsrSelec = record.get('id');
		this._newAddForm();
		this.window.setIdCliente(this.clienteId);
		this.window.setUser(idUsrSelec);
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
			var id_user_cliente = [];
			for (var i = 0; i < arrSelecionados.length; i++) {
				id_user_cliente.push(arrSelecionados[i].get('id'));
			}
			
			this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				scope: this,
				url: 'clientes/deleteusercliente',
				params: {
				'id[]': id_user_cliente
				},
				scope: this,
				success: function (a, b) {
					try {
						var c = Ext.decode(a.responseText);
					}
					catch (e) {};
					if (c.failure == true) {
						Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: c.message});
					}
					this.el.unmask();
					this.store.reload();
				}
			});
		}, this);	
	},

	_onUserCliSaveForm: function(){
		Ext.getCmp('btnNovoUsuario_ControleClienteUserTab' + this.clienteId).enable();
		Ext.getCmp('btnExcluirUsuario_ControleClienteUserTab' + this.clienteId).enable();
	},	
	_newAddForm: function () {
		Ext.getCmp('btnExcluirUsuario_ControleClienteUserTab' + this.clienteId).disable();
		Ext.getCmp('btnNovoUsuario_ControleClienteUserTab' + this.clienteId).disable();
		this.window = new User.AdministrationUserForm({
			renderTo: this.body,
			listeners: {
				scope: this,
				salvar: this._forceReload,
				excluir: this._forceReload,
				beforeclose: this._onUserCliSaveForm
			}
		});
		return this.window;
	},
	
	_forceReload: function(){
		this.store.reload();
	},
	
	_onBtnNovoUsuarioClick: function () {
		this._newAddForm();
		this.window.setIdCliente(this.clienteId);
		this.window.show();
	}
});

Ext.reg('tab_user_cli_create', Clientes.ControleClienteUserTab );
