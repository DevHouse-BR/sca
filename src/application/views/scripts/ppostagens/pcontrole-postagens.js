Ext.namespace('PortalPostagens');

PortalPostagens.sm = new Ext.grid.CheckboxSelectionModel();

PortalPostagens.ControlePortalPostagensWindowFilter = new Ext.ux.grid.GridFilters({
	local: false,
	menuFilterText: Application.app.language('grid.filter.label'),
	filters: [{
		type: 'string',
		dataIndex: 'titulo_postagem',
		phpMode: true
	},{
		type: 'date',  
		dataIndex: 'data_postagem',
		phpMode: true,
		dateFormat: 'd/m/Y',
        beforeText: Application.app.language('controle.postagens.filtros.depois'),
        afterText: Application.app.language('controle.postagens.filtros.antes'),
        onText: Application.app.language('controle.postagens.filtros.precisamente')
	}]
});

PortalPostagens.ControlePortalPostagensWindow = Ext.extend(Ext.grid.GridPanel, {
	id: 'ControlePortalPostagensWindow',
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: PortalPostagens.sm,
	columnLines: true,
	plugins: [PortalPostagens.ControlePortalPostagensWindowFilter],
	listeners:{
		click:function(evento){
			var painel = Ext.getCmp('filterPanel_ControlePortalPostagensWindow');
			if(painel){
				if(painel.isVisible()){
					painel.hide();
					Ext.getCmp('filterButton_ControlePortalPostagensWindow').toggle(false);
				}
			}
		}
	},	
	initComponent: function(){
		
		this.store = new Ext.data.JsonStore({
			url: 'ppostagens/list',
			root: 'data',
			idProperty: 'id',
			totalProperty: 'total',
			autoLoad: true,
			autoDestroy: false,
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
				{name: 'titulo_postagem', type: 'string'},
				{name: "data_postagem", type: "date", dateFormat: "Y-m-d H:i:s"},
				{name: 'fl_lida', type: 'boolean'},
				{name: 'fl_publicado', type: 'boolean'},
	        	{name: 'nome_usuario', type: 'string'},
        	    {name: 'cliente', type: 'string'},
				{name: 'leituras', type: 'int'},
				{name: 'downloads', type: 'int'}
			]
		});
		
		Ext.apply(Ext.form.VTypes, {
			daterangeText: Application.app.language('controle.postagens.periodo.erro'),
			daterange : function(val, field) {
				var date = field.parseDate(val);
				
				if(!date){
					this.daterangeText = String.format(field.invalidText, val);
					return false;
				}
				if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
					var start = Ext.getCmp(field.startDateField);
					start.setMaxValue(date);
					start.validate();
					this.dateRangeMax = date;
				}
				else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
					var end = Ext.getCmp(field.endDateField);
					end.setMinValue(date);
					end.validate();
					this.dateRangeMin = date;
				}
				/*
				* Always return true since we're only using this vtype to set the
				* min/max allowed values (these are tested for after the vtype test)
				*/
				return true;
			}
		});
		Ext.apply(this, {
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			bbar: new Ext.PagingToolbar({
				store: this.store,
				pageSize: 30,
				plugins: [PortalPostagens.ControlePortalPostagensWindowFilter]
			}),
			tbar: [{
				text: Application.app.language('controle.postagens.filtro'),
				id:'filterButton_ControlePortalPostagensWindow',
				iconCls: 'icon-addfilter',
				enableToggle:true,
				handler: function(botao, evento){
					var painel = Ext.getCmp('filterPanel_ControlePortalPostagensWindow');
					if(painel){
						if(painel.isVisible()) painel.hide();
						else painel.show();
					}
					else{
						painel = new Ext.FormPanel({
							id:'filterPanel_ControlePortalPostagensWindow',
							width:390,
							height:98,
							monitorValid:true,
							labelWidth:70,
							labelAlign:'top',
							frame: true,
							border: false,
							bodyBorder: false,
							baseCls: 'floatfiltro',
							renderTo: Ext.getCmp('ControlePortalPostagensWindow').getGridEl(),
							listeners: {
								'render': function(cmp){cmp.getEl().on('click', function(e){
									e.stopPropagation();
								}); }
							},
							items:[{
								layout: 'column',
								bodyStyle: 'background:none',
								border:false,
								defaults: {
									border: false,
									bodyStyle:'padding:5px;background:none;'
								},
								items: [{
									columnWidth: 0.39,
									layout: 'form',
									items:[{
										fieldLabel: Application.app.language('controle.postagens.pesquisa'),
										xtype:'textfield',
										id:'filtro_ControlePortalPostagensWindow',
										name:'filtro',
										listeners:{
											specialkey:function(owner,e){
												if (e.getKey() == 13){
													Ext.getCmp('btnexecfiltro_ControlePortalPostagensWindow').execFiltro();
												}
											}
										}
									}]
								},{
									columnWidth: 0.31,
									layout: 'form',
									items:[{
										fieldLabel: Application.app.language('controle.postagens.filtros.depois'),
										xtype: 'datefield',
										name: 'startdt',
										id: 'startdt_ControlePortalPostagensWindow',
										vtype: 'daterange',
										format: 'd/m/Y',
										endDateField: 'enddt_ControlePortalPostagensWindow',
										listeners:{
											specialkey:function(owner,e){
												if (e.getKey() == 13){
													Ext.getCmp('btnexecfiltro_ControlePortalPostagensWindow').execFiltro();
												}
											}
										}
									}]
								},{
									columnWidth: 0.3,
									layout: 'form',
									items:[{
										fieldLabel: Application.app.language('controle.postagens.filtros.antes'),
										xtype: 'datefield',
										name: 'enddt',
										id: 'enddt_ControlePortalPostagensWindow',
										format: 'd/m/Y',
										vtype: 'daterange',
										startDateField: 'startdt_ControlePortalPostagensWindow',
										listeners:{
											specialkey:function(owner,e){
												if (e.getKey() == 13){
													Ext.getCmp('btnexecfiltro_ControlePortalPostagensWindow').execFiltro();
												}
											}
										}
									}]
								}]
							}],
							buttons:[{
								text: Application.app.language('controle.postagens.filtrar'),
								id:'btnexecfiltro_ControlePortalPostagensWindow',
								iconCls: 'ux-gridfilter-text-icon',
								formBind:true,
								execFiltro:function(){
									var busca = Ext.getCmp('filtro_ControlePortalPostagensWindow');
									var dtInicial = Ext.getCmp('startdt_ControlePortalPostagensWindow');
									var dtFinal = Ext.getCmp('enddt_ControlePortalPostagensWindow');
									var meBtn = Ext.getCmp('filterButton_ControlePortalPostagensWindow');
														
									if((busca.getValue().length > 0) || (dtInicial.isValid() && (dtInicial.getValue() != "")) || (dtFinal.isValid() && (dtFinal.getValue() !=""))){
										meBtn.setIconClass('icon-filtered');
									} else {
										meBtn.setIconClass('icon-addfilter');
									}

									Ext.getCmp('ControlePortalPostagensWindow').store.on('beforeload', function(store, options) {
										options.params = options.params || {};
										
										if(busca.getValue().length > 0){
											Ext.apply(options.params, {
												'filter[0][data][type]': 'string',
												'filter[0][data][value]': busca.getValue(),
												'filter[0][field]': 'titulo_postagem'
											});
										}
										
										if (dtInicial.isValid() && (dtInicial.getValue() != "")) {
											Ext.apply(options.params, {
												'filter[1][data][comparison]': 'gt',
												'filter[1][data][type]': 'date',
												'filter[1][data][value]': dtInicial.getValue().format(dtInicial.format),
												'filter[1][field]': 'data_postagem'
											});
										}
										
										if (dtFinal.isValid() && (dtFinal.getValue() != "")) {
											Ext.apply(options.params, {
												'filter[2][data][comparison]': 'lt',
												'filter[2][data][type]': 'date',
												'filter[2][data][value]': dtFinal.getValue().format(dtFinal.format),
												'filter[2][field]': 'data_postagem'
											});
										}
									});
								
									Ext.getCmp('filterPanel_ControlePortalPostagensWindow').hide();
									Ext.getCmp('filterButton_ControlePortalPostagensWindow').toggle();
	
									Ext.getCmp('ControlePortalPostagensWindow').store.load();
								},
								handler: function(botao, evento){
									botao.execFiltro();
								}
							},{
								text: Application.app.language('grid.form.cancel'),
								handler:function(){
									Ext.getCmp('filterPanel_ControlePortalPostagensWindow').hide();
									Ext.getCmp('filterButton_ControlePortalPostagensWindow').toggle(false);
								}
							}]
						});
					}
					Ext.getCmp('filtro_ControlePortalPostagensWindow').focus();
				}
			},{
				text: Application.app.language('grid.bbar.clearfilter'),
				iconCls:'icon-removefilter',
				handler: function(botao, evento){
					Ext.getCmp('filtro_ControlePortalPostagensWindow').reset();
					Ext.getCmp('startdt_ControlePortalPostagensWindow').reset();
					Ext.getCmp('enddt_ControlePortalPostagensWindow').reset();
					Ext.getCmp('ControlePortalPostagensWindow').store.reload();
					PortalPostagens.ControlePortalPostagensWindowFilter.clearFilters();
					var painel = Ext.getCmp('filterPanel_ControlePortalPostagensWindow');
					if(painel){
						if(painel.isVisible()) painel.hide();
						meBtn = Ext.getCmp('filterButton_ControlePortalPostagensWindow');
						meBtn.toggle(false);
						meBtn.setIconClass('icon-addfilter');
					}
				}
			},
			'->',
			{
				text: Application.app.language('grid.form.add'),
				id:'btnAdicionar_ControlePortalPostagensWindow',
				iconCls: 'silk-add',
				scope: this,
				handler: this.novoRegistro
			},{
				text: Application.app.language('controle.postagens.ver.postagem'),
				iconCls: 'icon-postagens',
				scope: this,
				handler: function(evento, botao){
					var selecao = this.getSelectionModel().getSelections();
					if (selecao.length === 0) {
						Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
						return false;
					}
					for(var i = 0; i < selecao.length; i++){
						var id = selecao[i].get('id');
						var titulo_postagem = selecao[i].get('titulo_postagem');
						var novaAba = Application.app.tabPanel.items.find(function(aba){
							return aba.id == 'ControleViewPostagemWindow_' + id;
						});
						if(!novaAba) {
							novaAba = Application.app.tabPanel.add({
								title: titulo_postagem,
								xtype: 'view_postagens_window',
								id: 'ControleViewPostagemWindow_' + id,
								id_postagem: id
							});
						}
						Application.app.tabPanel.activate(novaAba);
					}					
				}
			}],
			view: new Ext.grid.GridView({ 
				getRowClass : function (row, index) {
					var cls = '';
					var data = row.data; 
					if(data.fl_publicado == false) {
						cls = 'linha-cinza-claro';
					}
					else if((data.fl_publicado == true) && (data.fl_lida == false)){
						cls = 'linha-vermelho-claro';
					}
					return cls; 
				} 
			}),
			defaults: {
				width: 150
			},
			columns: [PortalPostagens.sm, {
				dataIndex: 'id',
				header: Application.app.language('controle.clientes.id.text'),
				width: 40,
				sortable: false
			},{
				dataIndex: 'titulo_postagem',
				header: Application.app.language('controle.postagens.nome.postagem'),
				width: 180,
				sortable: true
			},{
				dataIndex: 'data_postagem',
				header: Application.app.language('controle.postagens.data.postagem'),
				width: 130,
				sortable: true,
				renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
    				return data.format("d/m/Y H:i \\h\\s");
    			}
			},{
				dataIndex: 'fl_lida',
				header: Application.app.language('controle.postagens.lida.empresa'),
				width: 110,
				align:'center',
				sortable: true,
				renderer: function(data, cell, record, rowIndex, columnIndex, store) {
    				if(data === true){
						return '<img ext:qtitle="Status" ext:qtip="' + Application.app.language('controle.postagens.lida') + '" src="images/icons/tick.png" />';
					}
					else return '<img ext:qtitle="Status" ext:qtip="' + Application.app.language('controle.postagens.nao.lida') + '" src="images/icons/cross.png" />';
    			}
			},{
				dataIndex: 'nome_usuario',
				header: Application.app.language('controle.postagens.postado.por'),
				sortable: true
			},{
				dataIndex: 'leituras',
				header: Application.app.language('controle.postagens.qtd.leituras'),
				width: 70,
				sortable: true,
				align:'right'
			},{
				dataIndex: 'downloads',
				header: Application.app.language('controle.postagens.qtd.downloads'),
				width: 80,
				align:'right',
				sortable: true
            }]
		});
		
		PortalPostagens.ControlePortalPostagensWindow.superclass.initComponent.call(this);
	},
	
	novoRegistro: function(){
		this.recordWindow = new PortalPostagens.ControlePortalPostagensForm({
			renderTo: this.body
		});
		this.recordWindow.show();
		document.getElementById('window_ControlePortalPostagensForm').style.zIndex = 50;
	}
});
Ext.reg('pcontrole-postagens', PortalPostagens.ControlePortalPostagensWindow);
