PortalPostagens.containerID;

PortalPostagens.inputFileButton = Ext.extend(Ext.Button, {
	input_file : null,
	original_handler : null,
	original_scope : null,
	initComponent : function(){
		PortalPostagens.inputFileButton.superclass.initComponent.call(this);
		this.original_handler = this.handler || null;
		this.original_scope = this.scope || window;
		this.handler = null;
		this.scope = null;
	},
	onRender : function(ct, position){
		PortalPostagens.inputFileButton.superclass.onRender.call(this, ct, position);
		this.criarInputFile();
	},
	
	criarInputFile: function(){
		
		var btn_box, inp_box, adj;
		var button_container = this.el.child('.x-btn-small');
		var width_ajust = 0;
		PortalPostagens.containerID = Ext.id();
		
		if(this.iconCls) width_ajust = 16;
		
		this.div_input_file = button_container.createChild({
			tag: 'div',
			id: PortalPostagens.containerID,
			style: 'position:absolute; overflow:hidden;'
		});
		
		this.div_input_file = Ext.get(PortalPostagens.containerID);
		
		this.input_file = this.div_input_file.createChild({
			tag: 'input',
			type: 'file',
			size: 1,
			name: Ext.id(),
			style: 'display: block; border: none; cursor: pointer !important;font-size:100px; right:0px; position:absolute;'
		});
		
		this.input_file.setOpacity(0.0);
		
		if (this.el && this.div_input_file) {
			btn_box = button_container.getBox();
			
			this.div_input_file.setStyle('width', (btn_box.width + width_ajust) + 'px');
			this.div_input_file.setStyle('height', (btn_box.height + 0) + 'px');
			
			if(!Ext.isIE){
				this.div_input_file.applyStyles('margin-top: -' + btn_box.height + 'px');
			}
		}
		this.input_file.on('mouseover', this.onMouseOver, this);
		this.input_file.on('mousedown', this.onMouseDown, this);
		this.input_file.on('click', function(e) { e.stopPropagation(); });
		this.input_file.on('change', this.executaHandler, this);
	},
	
	destacaInputFile : function(create){
		var result = this.input_file;
		
		create = create || true;
		
		this.input_file.removeAllListeners();
		this.input_file = null;
		
		if (create) {
			this.criarInputFile();
		}
		return result;
	},
	
	executaHandler:function(evento){
		if (this.original_handler) {
			this.original_handler.call(this.original_scope, this);
		}
	}
});
Ext.reg('inputfilebutton', PortalPostagens.inputFileButton);

PortalPostagens.ControlePortalPostagensForm = Ext.extend(Ext.Window, {
	id:'window_ControlePortalPostagensForm',
	maximized: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	title: Application.app.language('controle.postagens.postagem'),
	layout: 'fit',
	layoutConfig:{
		align: 'stretch'
	},
	
	listeners:{
		beforeclose: function(janela){
			if (this.oneUploadSuccess) {
				Application.app.confirm(Application.app.language('grid.form.alert.title'), Application.app.language('controle.postagens.confirma.sair'), function(opt){
					if (opt == "no") {
						return false;
					}
					else {
						Ext.Ajax.request({
							method: 'GET',
							params: {
								'UPLOAD_IDENTIFIER': Ext.getCmp('window_ControlePortalPostagensForm').uploadIdentifier
							},
							url: 'ppostagens/cleantemp',
							success: function(response, opts){
								Ext.getCmp('window_ControlePortalPostagensForm').destroy();
							},
							failure: Application.app.failHandler
						});
					}
				}, this);
				return false;
			}
			else{
				var store = this.gridAnexos.getStore().getRange();
				for(var j = 0; j < store.length; j++){
					if(store[j].data.status == 3) {
						var iframe = null;
					
						var iframes = document.body.getElementsByTagName("iframe");
						if(iframes){
							for(var i = 0; i < iframes.length; i++)	{
								if(iframes[i].className == 'x-hidden'){
									iframe = iframes[i];
									break;
								}
							}
						}
						
						Ext.removeNode(iframe);
						
						break;
					}
				}
			}
		}
	},
	
	uploadIdentifier: null,
	lastUploadIndex: -1,
	oneUploadSuccess: false,
	
	keepAlive: function(){
		Ext.Ajax.request({
			method:'GET',
			scope:this,
			url: 'ppostagens/keepalive',
			success: function (response, opts) {
				try{
					var keep = new Ext.util.DelayedTask(Ext.getCmp('window_ControlePortalPostagensForm').keepAlive).delay(300000);
				}
				catch(e){}
			},
			failure: function(){}
		});
	},
	
	getProgress: function(){
		if (Application.app.getAccountConfig(18) == "SIM") {
			Ext.Ajax.request({
				method: 'GET',
				scope: this,
				url: 'ppostagens/progress',
				params: {
					'progress_key': Ext.getCmp('window_ControlePortalPostagensForm').uploadIdentifier,
					'upload_index': Ext.getCmp('window_ControlePortalPostagensForm').lastUploadIndex
				},
				success: function(response, opts){
				
					try {
						eval('var data = ' + response.responseText);
					} 
					catch (e) {
						Application.app.showMessageBox({
							msg: e.message
						});
					}
					try {
						var progressBar = Ext.getCmp('progress_ControlePortalPostagensForm_' + PortalPostagens.containerID);
						
						if (data.done) {
						/*if(progressBar && (data.upload_index == Ext.getCmp('window_ControlePostagensForm').lastUploadIndex))
					 progressBar.updateProgress(1,  Application.app.language('controle.postagens.completado'), true);*/
						}
						else {
							if (data.upload_index == Ext.getCmp('window_ControlePortalPostagensForm').lastUploadIndex) {
								var progress = data.current / data.total;
								progressBar.updateProgress(progress, data.message, true);
								var task = new Ext.util.DelayedTask(Ext.getCmp('window_ControlePortalPostagensForm').getProgress, Ext.getCmp('window_ControlePortalPostagensForm')).delay(1000);
							}
						}
					} 
					catch (e) {
					}
				},
				failure: Application.app.failHandler
			});
		}
		else{
			var progressBar = Ext.getCmp('progress_ControlePortalPostagensForm_' + PortalPostagens.containerID);
			progressBar.wait({
				animate:true,
				text: Application.app.language('i18n.loading')
			});
		}
	},
	
	removeFileTag: function(){
		try{
			var formEl = this.formUpload.getForm().getEl();
			var inputf = formEl.child("input[type='file']");
			inputf.remove();
			if(!Ext.isIE){
				var div = formEl.child("div");
				div.remove();
			}
			this.formUpload.removeAll();
		}
		catch(e){
			
		}
	},
	
	executaUpload: function(botao, evento){
		var store = Ext.getCmp('gridAnexos_ControlePortalPostagensForm').getStore();
		var janela = Ext.getCmp('window_ControlePortalPostagensForm');
		
		if(janela.lastUploadIndex > -1){
			janela.removeFileTag();
		}
		
		var flagNaFila = false;
		
		janela.oneUploadSuccess = false;
		for (i = 0; i < store.data.length; i++) {
						
			var record = store.getAt(i);
			if(record.get('status') == 0){
				
				flagNaFila = true;
				Ext.getCmp('btnAnexar_ControlePortalPostagensForm').disable();
				//Ext.getCmp('btnRemover_ControlePostagensForm').disable();
				
				var divBotaoUpload = Ext.get(PortalPostagens.containerID);
				divBotaoUpload.setStyle('display', 'none');
				
				Ext.getCmp('btnEnviar_ControlePortalPostagensForm').disable();
				Ext.getCmp('btnSalvar_ControlePortalPostagensForm').disable();
				
				janela.lastUploadIndex = i;
				record.set('status', 3);
				var identifier = new Ext.form.Hidden({
					name: 'UPLOAD_IDENTIFIER',
					id:'UPLOAD_IDENTIFIER',
					value: janela.uploadIdentifier
				});
				
				this.formUpload.add(identifier);
				this.formUpload.doLayout();
				
				this.formUpload.getForm().getEl().appendChild(record.get('input_element'));
				
				this.formUpload.getForm().submit({
					success:function(form, action){
						if(action.result.success){
							//Ext.getCmp('ControlePostagensForm_oneUploadSuccess').setValue('true');
							Ext.getCmp('window_ControlePortalPostagensForm').oneUploadSuccess = true;
							
							var store = Ext.getCmp('gridAnexos_ControlePortalPostagensForm').getStore();
							var record = store.getAt(Ext.getCmp('window_ControlePortalPostagensForm').lastUploadIndex);
							record.set('status', 1);
							record.set('tmp_name', action.result.tmp_name);
							record.set('log', Application.app.language('controle.postagens.completado'));
							record.commit();
							var keep = new Ext.util.DelayedTask(Ext.getCmp('window_ControlePortalPostagensForm').keepAlive).delay(300000);
						}
						Ext.getCmp('window_ControlePortalPostagensForm').executaUpload();
					},
					failure: function(form, action){
						if(action.result.success != undefined){
							if (!action.result.success) {
								var store = Ext.getCmp('gridAnexos_ControlePortalPostagensForm').getStore();
								var record = store.getAt(Ext.getCmp('window_ControlePortalPostagensForm').lastUploadIndex);
								record.set('status', 2);
								record.set('log', action.result.errormsg);
								record.commit();
								Ext.getCmp('window_ControlePortalPostagensForm').executaUpload();
							}
						}
						else{
							Application.app.failhandler(form, action);
						}
					}
				});
				break;
			}
			else if(record.get('status') == 1){
				janela.oneUploadSuccess = true;
			}
		}
		if(!flagNaFila){
			Ext.getCmp('btnAnexar_ControlePortalPostagensForm').enable();
			//Ext.getCmp('btnRemover_ControlePostagensForm').enable();
			Ext.getCmp('btnEnviar_ControlePortalPostagensForm').enable();
			if(janela.oneUploadSuccess){
				Ext.getCmp('btnSalvar_ControlePortalPostagensForm').enable();
			}
			var divBotaoUpload = Ext.get(PortalPostagens.containerID);
			divBotaoUpload.setStyle('display', '');
		}
		var task = new Ext.util.DelayedTask(this.getProgress).delay(1500);
	},
		
	initComponent: function(){
		this.uploadIdentifier = new Date().getTime();
				
		this.formUpload = new  Ext.form.FormPanel({
			fileUpload: true,
			method:'POST',
			url:'ppostagens/upload'
		});
		
		this.gridAnexos = new Ext.grid.GridPanel({
			stripeRows:true,
			id:'gridAnexos_ControlePortalPostagensForm',
			width:400,
			height:200,
			anchor:'-15 -154',
			bodyStyle:'margin-bottom:5px',
			loadMask: true,
			selModel: new Ext.grid.RowSelectionModel({singleSelect:false}),
			store: new Ext.data.Store({
				proxy: new Ext.data.MemoryProxy([]),
				reader: new Ext.data.JsonReader({}, Ext.data.Record.create([
					{name: 'id', type:'string'},
					{name: 'status', type: 'int'},
					{name: 'filename'},
					{name: 'log'},
					{name: 'input_element'},
					{name: 'tmp_name', type: 'string'}
				]))
			}),
			colModel: new Ext.grid.ColumnModel({
				defaults: {
					width: 120,
					sortable: false
				},
				columns: [{
					header: Application.app.language('controle.postagens.status'),
					dataIndex: 'status',
					sortable: false,
					width:60,
					renderer: function(data, cell, record, row_index, column_index, store){
						return '<div class="controle-postagens-status controle-postagens-status-' + data + '">&#160;</div>';
					}
				},{
					header: Application.app.language('controle.postagens.nome.arquivo'),
					dataIndex: 'filename',
					width:300
				},{
					header: Application.app.language('controle.postagens.info'),
					dataIndex: 'log',
					width:200,
					renderer: function(data, cell, record, row_index, column_index, store){
						if(record.get('status') == 3){
							 (function(){
							 	new Ext.ProgressBar({
									renderTo: 'progress_ControlePortalPostagensForm_' + row_index + "_box",
									id: 'progress_ControlePortalPostagensForm_' + PortalPostagens.containerID,
									value: 0
								});
							}).defer(25);
							return '<span id="progress_ControlePortalPostagensForm_' + row_index + '_box"></span>';
						}
						else{
							return data;
						}
					}					
				}]
			}),
			tbar:[{
				text:Application.app.language('controle.postagens.anexar'),
				id:'btnAnexar_ControlePortalPostagensForm',
				xtype:'inputfilebutton',
				iconCls: 'silk-add',
				scope:this,
				handler:function(botao, evento){
					var arquivo = botao.destacaInputFile(true);
					var store = this.gridAnexos.getStore();
					
					if(Ext.isIE){
						store.add( new Ext.data.Record({
							id: arquivo.dom.name,
							status: 0,
							filename: arquivo.dom.value,
							log: Application.app.language('controle.postagens.na.fila'),
							input_element: arquivo
						}));
					}
					else {
						store.add( new Ext.data.Record({
							id: arquivo.dom.firstChild.name,
							status: 0,
							filename: arquivo.dom.firstChild.value,
							log: Application.app.language('controle.postagens.na.fila'),
							input_element: arquivo
						}));
					}
				}
			},{
				text:Application.app.language('controle.postagens.remover'),
				iconCls: 'silk-delete',
				id:'btnRemover_ControlePortalPostagensForm',
				scope:this,
				handler:function(botao, evento){
					var file_records = this.gridAnexos.getSelectionModel().getSelections();
					var store = this.gridAnexos.getStore();
					var form = this.formUpload.getForm().getEl();
					var iframe = null;
					
					var iframes = document.body.getElementsByTagName("iframe");
					if(iframes){
						for(var i = 0; i < iframes.length; i++)	{
							if(iframes[i].className == 'x-hidden'){
								iframe = iframes[i];
								break;
							}
						}
					}
					for (var i = 0; i < file_records.length; i++) {
						var r = file_records[i];
						var status = r.get('status');
						if(status == 3){
							Ext.removeNode(iframe);
							//this.removeFileTag();
							//Ext.getCmp('window_ControlePostagensForm').lastUploadIndex = -1;
						}
						if(status == 1){
							Ext.Ajax.request({
								method:'GET',
								params: {
									'UPLOAD_IDENTIFIER': Ext.getCmp('window_ControlePostagensForm').uploadIdentifier,
									'tmp_name': r.get('tmp_name')
								},
								url: 'ppostagens/cleanonefile',
								success: function (response, opts) {
									
								},
								failure: Application.app.failHandler
							});
						}
						r.get('input_element').remove();
						store.remove(r);
						if (status == 3) {
							var task = new Ext.util.DelayedTask(this.executaUpload, this).delay(1500);
						}
					}
					
					Ext.getCmp('window_ControlePortalPostagensForm').oneUploadSuccess = false;
					for (i = 0; i < store.data.length; i++) {
						var record = store.getAt(i);
						if (record.get('status') == 1) {
							Ext.getCmp('window_ControlePortalPostagensForm').oneUploadSuccess = true;
						}
					}
					if(Ext.getCmp('window_ControlePortalPostagensForm').oneUploadSuccess == false){
						Ext.getCmp('btnSalvar_ControlePortalPostagensForm').disable();
					}
				}
			},{
				text:Application.app.language('controle.postagens.enviar'),
				iconCls: 'icon-upload',
				id:'btnEnviar_ControlePortalPostagensForm',
				scope:this,
				handler: this.executaUpload
			},
				'->',
				Application.app.language('controle.postagens.max.upload.size') + Application.app.getAccountConfig(14) + ' MB'
			]
		});	
		
		this.formPanel = new Ext.form.FormPanel({
			flex:1,
			//monitorValid:true,
			border: false,
			bodyStyle: 'padding: 5px',
			defaultType:'textfield',
			labelWidth: 150,
			items:[{
				fieldLabel: Application.app.language('controle.postagens.nome.postagem'),
				name: 'titulo_postagem',
				allowBlank: false,
				width:300,
				maxLength: 255
			},{
				fieldLabel: Application.app.language('controle.postagens.observacao'),
				name: 'texto_postagem',
				xtype:'textarea',
				allowBlank: true,
				width:300,
				maxLength: 1000
			},
				this.gridAnexos
			],
			buttons:[{
				text: Application.app.language('grid.form.save'),
				scope:this,
				iconCls:'icon-save',
				id:'btnSalvar_ControlePortalPostagensForm',
				disabled:true,
				handler:function(){
					var anexos = [];
					var store = Ext.getCmp('gridAnexos_ControlePortalPostagensForm').getStore().getRange();
					
					for(var i = 0; i < store.length; i++){
						if(store[i].data.status == 1) anexos.push(store[i].data.tmp_name);
					}
					
					this.formPanel.getForm().on('beforeaction', function(form, action) {
						if (action.type == 'submit') {
							action.options.params = action.options.params || {};
							Ext.apply(action.options.params, {
								UPLOAD_IDENTIFIER: Ext.getCmp('window_ControlePortalPostagensForm').uploadIdentifier,
								'anexos[]': anexos
							});
						}
					});
					
					this.formPanel.getForm().submit({
						method:'POST', 
						url:'ppostagens/save',
						waitTitle: Application.app.language("auth.alert"),
						waitMsg: Application.app.language("auth.loading"),
						
						success:function(form, action){
							if(action.result.success){
								Ext.getCmp('ControlePortalPostagensWindow').getStore().reload();
								Ext.getCmp('window_ControlePortalPostagensForm').destroy();
							}
							else{
								Application.app.showMessageBox({msg: action.result.errormsg});
							}
						},
						failure: Application.app.failHandler
					});
				}
			},{
				text: Application.app.language('grid.form.cancel'),
				scope:this,
				iconCls:'silk-cross',
				handler:function(){
					this.close();
				}
			}]
		});
				
				
		Ext.apply(this, {
			items: [this.formPanel, this.formUpload]
		});
		
		PortalPostagens.ControlePortalPostagensForm.superclass.initComponent.call(this);
	}
});
