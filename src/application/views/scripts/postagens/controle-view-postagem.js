Postagens.ControleViewPostagemWindow = Ext.extend(Ext.Panel, {
	layout: {
		type:'vbox',
		align:'stretch'
	},
	initComponent: function(){
		this.mineUID = Application.app.uniqueID('imgPublicado_ControleV');
		this.infoPanel = new Ext.form.FormPanel({
			height:174,
			bodyStyle:'padding:6px',
			labelWidth: 120,
			scope: this,
			items:[{
				scope: this,
				layout: 'column',
				border:false,
				defaults: {
					columnWidth: 0.5
				},
				items: [{
					scope: this,
					layout: 'form',
					defaultType: 'textfield',
					defaults:{
						fieldClass: 'plain-text-field',
						disabledClass: 'plain-text-field'
					},
					border:false,
					items:[{
						fieldLabel: Application.app.language('controle.postagens.nome.postagem'),
						disabled: true,
						name: 'titulo_postagem'
					},{
						fieldLabel: Application.app.language('controle.postagens.postado.por'),
						disabled: true,
						name: 'nome_usuario'
					},{
						scope: this,
						fieldLabel: Application.app.language('controle.postagens.lida'),
						xtype:'box',
						id:'imgLida_ControleViewPostagemWindow'+this.mineUID,
						isFormField:true,
						autoEl:{
							tag:'div'
						}
					},{
						scope: this,
						fieldLabel: Application.app.language('controle.postagens.publicada'),
						xtype:'box',
						id:'imgPublicado_ControleViewPostagemWindow'+this.mineUID,
						isFormField:true,
						autoEl:{
							tag:'div'
						}
					}]
				},{
					layout: 'form',
					defaultType: 'textfield',
					defaults:{
						fieldClass: 'plain-text-field',
						disabledClass: 'plain-text-field'
					},
					border:false,
					items:[{
						fieldLabel: Application.app.language('controle.postagens.data.postagem'),
						disabled: true,
						name: 'data_postagem'
					},{
						fieldLabel: Application.app.language('controle.postagens.cliente'),
						disabled: true,
						name: 'cliente'
					},{
						fieldLabel: Application.app.language('controle.postagens.qtd.leituras'),
						disabled: true,
						name: 'leituras'
					},{
						fieldLabel: Application.app.language('controle.postagens.qtd.downloads'),
						disabled: true,
						name: 'downloads'
					}]
				}]
			},{
				fieldLabel: Application.app.language('controle.postagens.observacao'),
				name: 'texto_postagem',
				xtype:'textarea',
				allowBlank: true,
				anchor:'98%',
				maxLength: 1000
			}]
		});
		
		this.infoPanel.getForm().load({
			waitTitle: Application.app.language("auth.alert"),
			waitMsg: Application.app.language("auth.loading"),
			url: 'postagens/get',
			params: {
				id: this.id_postagem
			},
			scope: this,
			success: function(form, action){				
				try{
					var dados = Ext.decode(action.response.responseText);
					var divLida = Ext.get('imgLida_ControleViewPostagemWindow'+this.mineUID);
					var divPublicado = Ext.get('imgPublicado_ControleViewPostagemWindow'+this.mineUID);
					var imgSrc = "";
					
					if(dados.data.fl_lida){
						imgSrc = 'images/icons/tick.png';
					}
					else{
						imgSrc = 'images/icons/delete.png';
					}
					
					divLida.createChild({
						tag:'img',
						src: imgSrc
					});
					
					if(dados.data.fl_publicado){
						imgSrc = 'images/icons/tick.png';
					}
					else{
						imgSrc = 'images/icons/delete.png';
					}
					
					divPublicado.createChild({
						tag:'img',
						src: imgSrc
					});
				}
				catch(e){}
			},
			failure: Application.app.failHandler
		});

		this.gridAnexos = new Ext.grid.GridPanel({
			flex:1,
			title: Application.app.language('controle.postagens.anexos'),
			closable: false,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			border: false,
			stripeRows: true,
			loadMask: true,
			columnLines: true,
			autoExpandColumn:'colNomeAnexo_ControleViewPostagemWindow',
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store: gridAnexosStore = new Ext.data.JsonStore({
				url: 'anexos/list',
				root: 'data',
				idProperty: 'id',
				totalProperty: 'total',
				autoLoad:true,
				remoteSort: true,
				listeners:{
					exception: Application.app.failHandler
				},
				sortInfo: {
					field: 'id',
					direction: 'ASC'
				},
				baseParams: {
					limit: 30,
					postagem: this.id_postagem
				},
				fields: [
					{name: 'id', type: 'int'},
					{name: 'nome_anexo', type: 'string'},
					{name: 'tipo_anexo', type: 'string'},
					{name: 'tamanho_anexo', type: 'string'}
				]
			}),
			colModel: new Ext.grid.ColumnModel({
				defaults: {
					sortable:true
				},
				columns:[{
					dataIndex: 'id',
					header: Application.app.language('controle.postagens.anexos.download'),
					width: 60,
					renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
						return '<a target="_blank" href="anexos/download/anexo/' + data + '"><img align="left" src="images/icons/download-now.png" ext:qwidth="156" ext:qtitle="Download" ext:qtip="' + Application.app.language('controle.postagens.anexos.download.tip') + '" /></a>';
					}
				},{
					dataIndex: 'nome_anexo',
					id:'colNomeAnexo_ControleViewPostagemWindow',
					header: Application.app.language('controle.postagens.anexos'),
					width: 120
				},{
					dataIndex: 'tamanho_anexo',
					header: Application.app.language('controle.postagens.tamanho.anexo'),
					align:'right',
					width: 80
				}]
			}),
			bbar: new Ext.PagingToolbar({
				store: gridAnexosStore,
				pageSize: 30,
				animate: true
			})
		});
					
		this.gridLeituras = new Ext.grid.GridPanel({
			flex:1,
			border: false,
			title: Application.app.language('controle.postagens.leituras'),
			closable: false,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			stripeRows: true,
			loadMask: true,
			columnLines: true,
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store: gridLeiturasStore = new Ext.data.JsonStore({
				url: 'postagens/leituras',
				root: 'data',
				idProperty: 'id',
				totalProperty: 'total',
				autoLoad:true,
				remoteSort: true,
				listeners:{
					exception: Application.app.failHandler
				},
				sortInfo: {
					field: 'id',
					direction: 'ASC'
				},
				baseParams: {
					limit: 30,
					postagem: this.id_postagem
				},
				fields: [
					{name: 'id', type: 'int'},
					{name: "data_leitura", type: "date", dateFormat: "Y-m-d H:i:s"},
					{name: 'nome_usuario', type: 'string'}
				]
			}),
			colModel: new Ext.grid.ColumnModel({
				defaults: {
					sortable:true
				},
				columns:[{
					dataIndex: 'data_leitura',
					header: Application.app.language('controle.postagens.data.leitura'),
					width: 120,
					renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
	    				return data.format("d/m/Y H:i \\h\\s");
	    			}
				},{
					dataIndex: 'nome_usuario',
					header: Application.app.language('controle.postagens.postado.por'),
					width: 200
				}]
			}),
			bbar: new Ext.PagingToolbar({
				store: gridLeiturasStore,
				pageSize: 30,
				animate: true
			})
		});
		
		this.gridDownloads = new Ext.grid.GridPanel({
			flex:1,
			title: Application.app.language('controle.postagens.qtd.downloads'),
			closable: false,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			border: false,
			stripeRows: true,
			loadMask: true,
			columnLines: true,
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store: gridLeiturasStore = new Ext.data.JsonStore({
				url: 'postagens/downloads',
				root: 'data',
				idProperty: 'id',
				totalProperty: 'total',
				autoLoad:true,
				remoteSort: true,
				listeners:{
					exception: Application.app.failHandler
				},
				sortInfo: {
					field: 'id',
					direction: 'ASC'
				},
				baseParams: {
					limit: 30,
					postagem: this.id_postagem
				},
				fields: [
					{name: 'id', type: 'int'},
					{name: "data_download", type: "date", dateFormat: "Y-m-d H:i:s"},
					{name: "nome_anexo", type: "string"},
					{name: 'nome_usuario', type: 'string'}
				]
			}),
			colModel: new Ext.grid.ColumnModel({
				defaults: {
					sortable:true
				},
				columns:[{
					dataIndex: 'data_download',
					header: Application.app.language('controle.postagens.data.leitura'),
					width: 120,
					renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
	    				return data.format("d/m/Y H:i \\h\\s");
	    			}
				},{
					dataIndex: 'nome_anexo',
					header: Application.app.language('controle.postagens.nome.arquivo'),
					width: 200
				},{
					dataIndex: 'nome_usuario',
					header: Application.app.language('controle.postagens.baixado.por'),
					width: 150
				}]
			}),
			bbar: new Ext.PagingToolbar({
				store: gridLeiturasStore,
				pageSize: 30,
				animate: true
			})
		});
		
		this.gridMensagens = new Ext.grid.GridPanel({
			flex:1,
			title: Application.app.language('controle.postagens.mensagens'),
			closable: false,
			layout: {
				type:'vbox',
				align:'stretch'
			},
			border: false,
			stripeRows: true,
			loadMask: true,
			columnLines: true,
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store: gridLeiturasStore = new Ext.data.JsonStore({
				url: 'mensagens/list',
				root: 'data',
				idProperty: 'id',
				totalProperty: 'total',
				autoLoad:true,
				remoteSort: true,
				listeners:{
					exception: Application.app.failHandler
				},
				sortInfo: {
					field: 'id',
					direction: 'ASC'
				},
				baseParams: {
					limit: 30,
					postagem: this.id_postagem
				},
				fields: [
					{name: 'id', type: 'int'},
					{name: "data_mensagem", type: "date", dateFormat: "Y-m-d H:i:s"},
					{name: "sca_tipo_mensagem_id", type: "int"},
					{name: 'sca_status_mensagem_id', type: 'int'},
					{name: "remetente", type: "string"},
					{name: "destinatarios", type: "string"},
					{name: "assunto", type: "string"},
					{name: "nome_status", type: "string"},
					{name: "nome_tipo_mensagem", type: "string"}
				]
			}),
			colModel: new Ext.grid.ColumnModel({
				defaults: {
					sortable:true
				},
				columns:[{
					dataIndex: 'remetente',
					header: Application.app.language('controle.postagens.mensagens.remetente'),
					width: 200
				},{
					dataIndex: 'destinatarios',
					header: Application.app.language('controle.postagens.mensagens.destinatarios'),
					width: 200
				},{
					dataIndex: 'assunto',
					header: Application.app.language('controle.postagens.mensagens.assunto'),
					width: 150
				},{
					dataIndex: 'nome_status',
					header: Application.app.language('controle.postagens.mensagens.status'),
					width: 80
				},{
					dataIndex: 'nome_tipo_mensagem',
					header: Application.app.language('controle.postagens.mensagens.tipo'),
					width: 100
				},{
					dataIndex: 'data_mensagem',
					header: Application.app.language('controle.postagens.data.leitura'),
					width: 120,
					renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
	    				return data.format("d/m/Y H:i \\h\\s");
	    			}
				}]
			}),
			bbar: new Ext.PagingToolbar({
				store: gridLeiturasStore,
				pageSize: 30,
				animate: true
			})
		});
		
		this.tabPanel = new Ext.TabPanel({
			flex: 3,
			activeTab: 0,
			defaults: {
				closable: false
			},
			items: [this.gridAnexos, this.gridLeituras, this.gridDownloads, this.gridMensagens]
		});
		
				
		Ext.apply(this, {
			items: [this.infoPanel, this.tabPanel]
		});
		
		Postagens.ControleViewPostagemWindow.superclass.initComponent.call(this);
	}
});
Ext.reg('view_postagens_window', Postagens.ControleViewPostagemWindow);
