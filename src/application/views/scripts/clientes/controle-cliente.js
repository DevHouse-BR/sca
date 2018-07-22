Ext.namespace('Clientes');
Clientes.smGridPrincipal = new Ext.grid.CheckboxSelectionModel();

Clientes.ControleClientesWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: Clientes.smGridPrincipal,
	columnLines: true,
	listeners:{
		beforerender:function(grid){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto:'btnAdicionar_ControleClientesWindow',
					acl:18,
					tipo:'componente'
				},{
					objeto:'btnDelete_ControleClientesWindow',
					acl:18,
					tipo:'componente'
				},{
					objeto:'btnAddUser_ControleClientesWindow',
					acl:19,
					tipo:'componente'
				},{
					objeto:grid.getColumnModel(),
					acl:14,
					tipo:'coluna',
					columnIndex:8
				},{
					objeto:grid,
					funcao:'_onGridRowDblClick',
					acl:18,
					tipo:'funcao'
				}]
			});
		}
	},
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: 'clientes/list',
			root: 'data',
			idProperty: 'id',
			totalProperty: 'total',
			autoLoad: true,
			autoDestroy: false,
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
				{name: 'nome_cliente', type: 'string'},
				{name: 'cod_cliente', type: 'string'},
				{name: 'responsavel', type: 'string'},
				{name: 'fl_acesso_portal', type: 'boolean'},
                {name: 'nm_criador', type: 'string'},
                {name: 'data_criacao', type: 'string'},
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
				id:'btnAdicionar_ControleClientesWindow',
				iconCls: 'silk-add',
				scope: this,
				handler: this._onBtnNovoUsuarioClick
			},{
				text: Application.app.language('grid.form.delete'),
				id:'btnDelete_ControleClientesWindow',
				iconCls: 'silk-delete',
				scope: this,
				handler: this._onBtnExcluirSelecionadosClick
			},{
                text: Application.app.language('controle.cliente.addUser.text'),
                id:'btnAddUser_ControleClientesWindow',
                iconCls: 'silk-group',
                scope: this,
                handler: this._onBtnAddUserClick
			}],
			columns: [Clientes.smGridPrincipal, {
				dataIndex: 'id',
				header: Application.app.language('controle.clientes.id.text'),
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nome_cliente',
				header: Application.app.language('controle.clientes.nome.text'),
				sortable: true
            }, {
                dataIndex: 'cod_cliente',
                header: Application.app.language('controle.clientes.cod.text'),
                sortable: true
            }, {
                dataIndex: 'responsavel',
                header: Application.app.language('controle.clientes.responsavel.text'),
                sortable: true
            }, {
                dataIndex: 'nm_criador',
                header: Application.app.language('departamento.columns.nm_criador.text'),
                sortable: true
            }, {
                dataIndex: 'data_criacao',
                header: Application.app.language('departamento.columns.data_criacao.text'),
                sortable: true
            }, {
                dataIndex: 'fl_acesso_portal',
                header: Application.app.language('controle.clientes.portal.text'),
                sortable: true,
                renderer: function (e) {
                        if(e == true) {
                                return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="' + Application.app.language('administration.user.form.status.active') + '" title="' + Application.app.language('administration.user.form.status.active') + '" /></center>';
                        } else {
                                return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="' + Application.app.language('administration.user.form.status.inactive') + '" title="' + Application.app.language('administration.user.form.status.inactive') + '" /></center>';
                        }
                }
			}, {
				dataIndex: 'nome_account',
				header: Application.app.language('administration.group.account.text'),
				sortable: true
			}]
		});
		Clientes.ControleClientesWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		Clientes.ControleClientesWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			rowdblclick: this._onGridRowDblClick
		});
	},
	onDestroy: function () {
		Clientes.ControleClientesWindow.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm(0);
		//this.window.setGroup(0);
		this.window.show();
	},
	_onBtnAddUserClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();

		if(arrSelecionados.length === 0){
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
			return false;
		}
		
		if(arrSelecionados.length > 1){
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.selectless')});
			return false;
		}
		this.idGet = arrSelecionados[0].get('id');
		this.nameGet = arrSelecionados[0].get('nome_cliente');
        var titulo = Application.app.language('grid.form.user.name') + ' ' + this.nameGet;
        var novaAba = Application.app.tabPanel.items.find(function(aba){
			return aba.title == titulo;
        });
		if(!novaAba) {
	    	novaAba = Application.app.tabPanel.add({
            	title: titulo,
                xtype: 'tab_user_cli_create',
				clienteId:this.idGet
        	});
			//novaAba._setClienteId(this.idGet);
		}
        Application.app.tabPanel.activate(novaAba);
		novaAba.store.load();
		//novaAba._forceReload();
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
			this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				url: 'clientes/delete',
				params: {
					'id[]': id
				},
				scope: this,
				success: function (a, b) {
					try {
						var c = Ext.decode(a.responseText);
					} catch (e) {};
					if (c.failure == true) {
						Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: c.message});
					}
					this.el.unmask();
					this.store.reload();
				}
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
		this._newForm(id);
		//this.window.setGroup(id);
		this.window.show();
	},
	_newAddUserWindow: function () {
        if (!this.windowAddUser) {
           this.windowAddUser = new ControleClienteUserForm({ });
        }                       
		return this.windowAddUser;     
 	},

	_newForm: function (id) {
		//if (!this.window) {
			this.window = new Clientes.ControleClientesForm({
				renderTo: this.body,
				group:id,
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
Ext.reg('controle-clientes', Clientes.ControleClientesWindow);
