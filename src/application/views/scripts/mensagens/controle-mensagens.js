Ext.namespace('Mensagens');

Mensagens.infoStore = new Ext.data.JsonStore({
	url: 'mensagens/alllist',
	root: 'data',
	idProperty: 'id',
	totalProperty: 'total',
	autoLoad: false,
	autoDestroy: false,
	remoteSort: true,
	listeners:{
		exception: Application.app.failHandler
	},
	sortInfo: {
		field: 'data',
		direction: 'DESC'
	},
	baseParams: {
		limit: 30
	},
	fields: [
		{name: 'id', type: 'interger'},
		{name: 'tipo', type: 'string'},
		{name: 'assunto', type: 'string'},
		{name: 'data', type: 'string'},
		{name: 'status', type: 'string'},
		{name: 'remetente', type: 'string'},
		{name: 'destinatario', type: 'string'}
	]
});

Mensagens.logStore = new Ext.data.JsonStore({
	url: 'mensagens/loginfo',
	root: 'data',
	idProperty: 'id',
	totalProperty: 'total',
	autoLoad: false,
	autoDestroy: false,
	remoteSort: true,
	listeners:{
		exception: Application.app.failHandler
	},
	sortInfo: {
		field: 'data_log',
		direction: 'DESC'
	},
	baseParams: {
		limit: 30
	},
	fields: [
		{name: 'data_log', type: 'string'},
		{name: 'texto_log', type: 'string'}
	]
});

Mensagens.AdministrationMensagensMainGrid = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	columnLines: true,
	id:'AdministrationMensagensMainGrid',
	viewConfig: {
		autoFill: true,
		forceFit:true,
		emptyText: Application.app.language('grid.empty'),
		deferEmptyText: false
	},
	store: Mensagens.infoStore,
	initComponent: function () {
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
				dataIndex: 'tipo',
				header: Application.app.language('controle.mensagens.grid.tipo'),
				width: 130,
				sortable: true
			},{
				dataIndex: 'assunto',
				header: Application.app.language('controle.mensagens.grid.assunto'),
				width: 170,
				sortable: true
			},{
				dataIndex: 'data', 
				header: Application.app.language('controle.mensagens.grid.data'),
				width: 130,
				sortable: true
			},{ 
				dataIndex: 'status',
				header: Application.app.language('controle.mensagens.grid.status'),
				width: 80,
				sortable: true
			},{
				dataIndex: 'remetente',
				header: Application.app.language('controle.mensagens.grid.remetente'),
				width: 150,
				sortable: true
			},{
				dataIndex: 'destinatario',
				header: Application.app.language('controle.mensagens.grid.destinatario'),
				width: 350,
				sortable: true
			}]
		});
		Mensagens.AdministrationMensagensMainGrid.superclass.initComponent.call(this);
	},
	initEvents: function () {
		this.on({
			scope: this,
			rowclick: this._onRowClick
		});
		Mensagens.AdministrationMensagensMainGrid.superclass.initEvents.call(this);
	},
	listeners: {
		beforerender: function(grid){
			Application.AccessController.applyPermission({
				defaultAction: 'hide',
				items:[{
					objeto: grid,
					funcao: '_onRowClick',
					tipo: 'funcao',
					acl: 26
				}]
			});
		},
		afterrender: function(grid){
			grid.store.load();
		}
	},
	_onRowClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		this.IDcarregar = record.get('id');
		
		Mensagens.logStore.load({
			waitTitle: Application.app.language("auth.alert"),
			waitMsg: Application.app.language("auth.loading"),
			fail: Application.app.faiHandler,
			params: {
				id: this.IDcarregar
			},
			scope: this,
			faliure: function(obj1, obj2){
				Application.app.failHandler(obj1, obj2);
			}
		});
	}
});

Ext.reg('MensagensPanelAdministrationMensagensMainGrid', Mensagens.AdministrationMensagensMainGrid);

Mensagens.AdministrationMensagensLogsGrid = Ext.extend(Ext.grid.GridPanel, {
	border: false,          
	stripeRows: true,       
	loadMask: true,         
	columnLines: true,      
	id:'AdministrationMensagensLogsGrid',
	store: Mensagens.logStore, 
	viewConfig: {           
		autoFill: true, 
		forceFit:true,
		emptyText: Application.app.language('grid.empty'),
		deferEmptyText: false
	},
	initComponent: function () {
		Ext.apply(this, {
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			columns: [{
				dataIndex: 'data_log',
				header: Application.app.language('controle.mensagens.grid.data'),
				width: 130,
				sortable: true
			},{
				dataIndex: 'texto_log',
				header: Application.app.language('controle.mensagens.log.texto'),
				width: 250,
				sortable: true
			}],
			tbar: [{
				text: Application.app.language('controle.mensagens.log.helper'),
				id: "MensagensPanelAdministrationMensagensLogsGridTbarText",
				unstyled: true
			}]
		});
		Mensagens.AdministrationMensagensMainGrid.superclass.initComponent.call(this);
	},
	initEvents: function () {
		Mensagens.AdministrationMensagensMainGrid.superclass.initEvents.call(this);
	}
});

Ext.reg('MensagensPanelAdministrationMensagensLogsGrid', Mensagens.AdministrationMensagensLogsGrid);

Mensagens.AdministrationMensagens = Ext.extend(Ext.Panel, {
	listeners: {
		beforerender: function(grid){
			Application.AccessController.applyPermission({
				defaultAction: 'hide',
				items:[{
					objeto: 'MensagensPanelAdministrationMensagensLogsGrid',
					acl: 26,
					tipo: 'componente',
					setHeightZero: true,
					setFlexZero: true
				}]
			});
		}
	},
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	initComponent: function () {
		Ext.applyIf(this, {
			frame: true,
			title: 'Book List',
			items: [{
				xtype: 'MensagensPanelAdministrationMensagensMainGrid',
				itemId: 'MensagensPanelAdministrationMensagensMainGrid',
				region: 'north',
				flex: 2
			},{
				id: 'MensagensPanelAdministrationMensagensLogsGrid',
				xtype: 'MensagensPanelAdministrationMensagensLogsGrid',
				region: 'center',
				flex: 1
			}]
		});
		Mensagens.AdministrationMensagens.superclass.initComponent.call(this);
	},
	initEvents: function () {
		Mensagens.AdministrationMensagens.superclass.initEvents.call(this);
	}
	
});

Ext.reg('controle-mensagens', Mensagens.AdministrationMensagens);


