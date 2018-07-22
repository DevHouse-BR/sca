Ext.namespace('dpto');
dpto.sm = new Ext.grid.CheckboxSelectionModel();

dpto.ControleDepartamentosWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: dpto.sm,
	columnLines: true,
	listeners:{
		beforerender: function (cmp) {
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
                    objeto:cmp.getColumnModel(),
                    acl:14,
                    tipo:'coluna',
                    columnIndex:7
				}, {
					objeto:'btnAddDepartamento_ControleDepartamentosWindow',
					acl:16,
					tipo:'componente'
				}, {
					objeto: 'btnExcluirDepartamento_ControleDepartamentosWindow',
					acl:16,
					tipo:'componente' 
				}, {
					objeto:cmp,
					funcao:'_onGridRowDblClick',
					acl:16,
					tipo:'funcao'
				}]
			});
		}
	},
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: 'departamentos/list',
			root: 'data',
			idProperty: 'id',
			totalProperty: 'total',
			autoLoad: true,
			autoDestroy: true,
			remoteSort: true,
			listeners:{
				exception: Application.app.failHandler
			},
			sortInfo: {
				field: 'id',
				direction: 'ASC'
			},
			baseParams: {
				limit: 30
			},
			fields: [
				{name: 'id', type: 'int'},
				{name: 'nm_dpto', type: 'string'},
				{name: 'cod_dpto', type: 'string'},
				{name: 'nm_gerente', type: 'string'},
				{name: 'nm_criador', type: 'string'},
				{name: 'data_criacao', type: "date", dateFormat: "Y-m-d H:i:s"},
				{name: 'nm_account', type: 'string'}
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
                    scope: this,
                    handler: this._onBtnNovoUsuarioClick,
					id: 'btnAddDepartamento_ControleDepartamentosWindow'
            },
            {
                    text: Application.app.language('grid.form.delete'),
                    iconCls: 'silk-delete',
                    scope: this,
                    handler: this._onBtnExcluirSelecionadosClick,
					id: 'btnExcluirDepartamento_ControleDepartamentosWindow'
            }
                        ],
			columns: [dpto.sm, {
				dataIndex: 'id',
				header: Application.app.language('departamento.columns.id.text'),
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nm_dpto',
				header: Application.app.language('departamento.columns.nm_departamento.text'),
				sortable: true
			}, {
				dataIndex: 'cod_dpto',
				header: Application.app.language('departamento.columns.cod.text'),
				sortable: true
			}, {
				dataIndex: 'nm_gerente',
				header: Application.app.language('departamento.columns.nm_gerente.text'),
				sortable: true
			}, {
				dataIndex: 'nm_criador',
				header: Application.app.language('departamento.columns.nm_criador.text'),
				sortable: true
			}, {
				dataIndex: 'data_criacao',
				header: Application.app.language('departamento.columns.data_criacao.text'),
				sortable: true,
				width:130,
				renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
    				return data.format("d/m/Y H:i \\h\\s");
    			}
			}, {
				dataIndex: 'nm_account',
				header: Application.app.language('administration.user.form.account.text'),
				sortable: false,
				width: 120
			}]
		});
		dpto.ControleDepartamentosWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		dpto.ControleDepartamentosWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			rowdblclick: this._onGridRowDblClick
		});
	},
	onDestroy: function () {
		dpto.ControleDepartamentosWindow.superclass.onDestroy.apply(this, arguments);
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
			this.group = new ControleDepartamentosGroup({
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
                                url: 'departamentos/delete',
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
	_load_preSelected_gerente: function (a, b, c) {

	},
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		this._newForm();
		this.window.setUser(id);
		this.window.show();
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.forceReload(0);
		this.window.show();
	},
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	_newForm: function () {
		if (!this.window) {
			this.window = new departamentos.ControleDepartamentosForm({
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
Ext.reg('controle-departamentos', dpto.ControleDepartamentosWindow);
