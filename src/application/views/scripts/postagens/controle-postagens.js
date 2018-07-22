Ext.namespace('Postagens');

Postagens.sm = new Ext.grid.CheckboxSelectionModel();

Postagens.ControlePostagensWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: Postagens.sm,
	columnLines: true,
	listeners:{
		beforerender:function(grid){
			/*Application.AccessController.applyPermission({
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
			});*/
		}
	},
	
	initComponent: function(){
		
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
		
		Ext.apply(this, {
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			bbar: new Ext.PagingToolbar({
				store: this.store,
				pageSize: 30
			}),
			tbar: ['->',
			{
				text: Application.app.language('grid.form.add'),
				//id:'btnAdicionar_ControleClientesWindow',
				iconCls: 'silk-add',
				scope: this,
				handler: this.novoRegistro
			}],
			columns: [Postagens.sm, {
				dataIndex: 'id',
				header: Application.app.language('controle.clientes.id.text'),
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nome_cliente',
				header: Application.app.language('controle.clientes.nome.text'),
				sortable: true
            }]
		});
		
		Postagens.ControlePostagensWindow.superclass.initComponent.call(this);
	},
	
	novoRegistro: function(){
		this.recordWindow = new Postagens.ControlePostagensForm({
			renderTo: this.body
		});
		this.recordWindow.show();
	}
});
Ext.reg('controle-postagens', Postagens.ControlePostagensWindow);