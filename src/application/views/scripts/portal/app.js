Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/s.gif';
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

Ext.namespace('Application');

Application.changedPassField = false;

Application.app = function() {
	
	var allConfig = [];
	var accountConfig = [];
	var menu;
	var userInfo;
	
	var _syncAjax = function(url, passData) {
		var postString = Ext.isObject(passData) ? Ext.urlEncode(passData) : passData;
		
		if(window.XMLHttpRequest) {            
			AJAX = new XMLHttpRequest();              
		}
		else {                     
			AJAX = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		if(AJAX) {
			AJAX.open("POST", url, false);
			AJAX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			AJAX.send(postString);
			return AJAX.responseText;                                         
		}
		else {
			return false;
		}                                             
	};
	
	var _getServerConfig = function(numbers){
    	var config = Ext.decode(_syncAjax(baseURL + 'config/getmultiple', {'id[]':numbers}));
    	
    	if(Ext.isArray(numbers)){
    		return config;
    	}
    	else return config[numbers];
    };
	
	var _getAccountConfig = function(){
    	return config = Ext.decode(_syncAjax(baseURL + 'config/getaccountcfg', {}));
    };
    
    var _populateLanguage = function(){
		Application.language = Ext.decode(_syncAjax(baseURL + 'portal/language', null));
	};
	
	var _populateConfigs = function(){
		
		var values = _getServerConfig([1,2,3]);
		for(var val in values){
			allConfig[val] = values[val];
		}
		
		var values = _getAccountConfig();
		for(var val in values){
			accountConfig[val] = values[val];
		}
	};
	
	var _populateMenu = function(){
		menu = Ext.decode(_syncAjax(baseURL + 'portal/menu', null));
	};
	
	var _populateUserInfo = function(){
		userInfo = Ext.decode(_syncAjax(baseURL + 'portal/userinfo', null));
	};
	
	var _switchResponseStatus = function(status){
		var mensagem = "";
		
		switch(status){
			case 0:
				mensagem = Application.app.language("failhandler.ErroHTTPComunication");
				break;
			case '404':
				mensagem = Application.app.language("failhandler.ErroHTTP404");
				break;
			case 500:
				mensagem = Application.app.language("failhandler.ErroHTTP500");
				break;
			case '200':
				mensagem = Application.app.language("failhandler.ErroHTTPNotJSON");
				break;
			default:
				mensagem = Application.app.language("failhandler.ErroHTTP");
		}
		return mensagem;
	};
	
	Ext.override(Ext.data.Connection, {
		handleResponse : function(response){
	        this.transId = false;
	        var options = response.argument.options;
	        response.argument = options ? options.argument : null;
	        this.fireEvent("requestcomplete", this, response, options);
	        var contentType = response.getResponseHeader('Content-Type');
			if((contentType != "application/json")){
				Application.app.showMessageBox({msg: Application.app.language("failhandler.ErroHTTPNotJSON") + Application.app.addslashes(response.responseText).replace(/\n/g, '<br />')});
				return;
			}
	        if(options.success){
	            options.success.call(options.scope, response, options);
	        }
	        if(options.callback){
	            options.callback.call(options.scope, options, true, response);
	        }
		}
	});

	_populateConfigs();
	_populateLanguage();
	_populateMenu();
	_populateUserInfo();
	
    return {
       
        init: function() {
		Ext.layout.FormLayout.prototype.trackLabels = true;

		this.uploadPannel = new Ext.form.FormPanel({
			bodyStyle: 'padding:20px; margin-bottom:10px;',
			title: Application.app.language('window.clients.portal.postagem'),
			height: 150,
			layout: 'form',
			defaultType: 'textfield',
			fileUpload: true, //nao usar AJAX para poder mandar arquivos, isto requer resposta com o head text/HTML
			items: [{
				fieldLabel: Application.app.language('main.application.postagem.title'),
				name: 'titulo_postagem',
				id: 'mainApplicationPostagensPannel_title',
				allowBlank: false,
				anchor: "100%",
				maxLength: 255
			},{
				xtype:'fileuploadfield',
				fieldLabel: Application.app.language('administration.setting.form.upload.file'),
				id: 'mainApplicationPostagensPannel_file',
				emptyText: '...',
				anchor: "100%",
				allowBlank: false,
				name: 'fileUpload',
				buttonText: '',
				buttonCfg: {
					iconCls: 'upload-icon'
				}
			},{
				bodyStyle: 'margin-top:10px',
				xtype: 'panel',
				layout: 'hbox',
				border: false,
				items: [{
					xtype: 'spacer',
					flex: 1
				},{
					id: 'mainApplicationMainPannelUpload_saveBtn',
					xtype: 'button',
					text: Application.app.language('grid.form.save'),
					iconCls: 'icon-save',
					scope: this,
					formBind:true,
					handler: function() {
						var form = this.uploadPannel.getForm();
						if(!form.isValid()) {
							Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.invalid')});
							return false;
						}
						
						form.submit({
							waitTitle: Application.app.language("auth.alert"),
							waitMsg: Application.app.language("auth.loading"),
							url: 'ppostagens/fastsave',
							success: function(form, action) {
								Application.app.showInfoBox({title: Application.app.language('main.application.upload.title.sucess'), msg: Application.app.language('main.application.upload.body.sucess')});
								Ext.getCmp('Application.tabPannel.clientes.recents').store.load();
								Ext.getCmp('mainApplicationPostagensPannel_title').reset(); //se tudo ocorreu bem, reseta o form...
								Ext.getCmp('mainApplicationPostagensPannel_file').reset();
							},
							failure: Application.app.failHandler
						});
					}
				},{
					xtype:'panel',
					border:false,
					html: '&nbsp;'
				},{
					id: 'mainApplicationMainPannelUpload_cancelBtn',
					xtype: 'button',
					text: Application.app.language('grid.form.cancel'),
					iconCls: 'silk-cross',
					scope: this,
					handler: function() {
						Ext.getCmp('mainApplicationPostagensPannel_title').reset();
						Ext.getCmp('mainApplicationPostagensPannel_file').reset();
					}
				}]
			}],
		});
		
		this.gridClientsRecents = new Ext.grid.GridPanel({
			bodyStyle: 'margin-bottom:10px',
			title: Application.app.language('window.clients.recents.limit'),
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			xtype: 'grid',
			border: true,
			stripeRows: true,
			loadMask: true,
			columnLines: true,
			height: 180,
			id: 'Application.tabPannel.clientes.recents',
			started: false,
			listeners: {
				celldblclick: function ( thisobject, thisrowIndex, thiscolumnIndex, thisevent ){
					var selecao = this.getSelectionModel().getSelections();

					if (selecao.length === 0) {
						Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
						//se entrar neste if algo esta terrívelmente errado, mesmo...
						return false;
					}

					var id = selecao[0].get('id');
					var titulo_postagem = selecao[0].get('titulo_postagem');
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
			},

			store: new Ext.data.JsonStore({
				url: 'ppostagens/listmyrecents',
				root: 'data',
				idProperty: 'id',
				totalProperty: 'total',
				autoLoad: true,
				autoDestroy: false,
				remoteSort: true,
				baseParams: {
					limit: 5
				},
				sortInfo: {
					field: 'data_postagem',
					direction: 'DESC'
				},
				fields: [
					{name: 'id', type: 'int'},
					{name: "data_postagem", type: "date", dateFormat: "Y-m-d H:i:s"},
					{name: 'titulo_postagem', type: 'string'},
					{name: 'nome_usuario', type: 'string'},
					{name: 'leituras', type: 'int'},
					{name: 'downloads', type: 'int'},
					{name: 'cliente', type: 'string'},
					{name: 'fl_lida', type: 'string'}
				],
				listeners: {
					scope: this,
					load: function(thisobject, thisrecords, thisoprtions){
						if(this.started)
							return;
						this.started = true;
						var task = {
							run: function() {
								Ext.getCmp('Application.tabPannel.clientes.recents').store.load();
							},
							interval: 180000 //180s
						}
						var run = new Ext.util.TaskRunner();
						run.start(task);
					},
					exception: Application.app.failHandler
				}
			}),
			view: new Ext.grid.GridView({

				getRowClass : function (row, index) {
					var cls = '';
					var data = row.data;
					if(data.fl_lida == 'false') {
						cls = 'linha-vermelho-claro';
					}
					return cls;
				}
			}), 
			columns: [{
				dataIndex: 'data_postagem',
				header: Application.app.language('controle.postagens.data.postagem'),
				width: 130,
				sortable: true,
				renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
					return data.format("d/m/Y H:i \\h\\s");
				}
			},{
				dataIndex: 'titulo_postagem',
				header: Application.app.language('controle.postagens.nome.postagem'),
				width: 180,
				sortable: true
			},{
				dataIndex: 'cliente',
				header: Application.app.language('controle.postagens.cliente'),
				width: 90,
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
			},{ 
				dataIndex: 'nome_usuario',
				header: Application.app.language('controle.postagens.postado.por'),
				sortable: true 
			}]  
		});
		
		this.gridClientsMinhas = new Ext.grid.GridPanel({
			bodyStyle: 'margin-bottom:10px',
			title: Application.app.language('window.clients.minhas.portal'),
			viewConfig: {
				emptyText: Application.app.language('grid.empty'),
				deferEmptyText: false
			},
			xtype: 'grid',
			border: true,
			stripeRows: true,
			loadMask: true,
			columnLines: true,
			height: 370,
			id: 'Application.tabPannel.clientes.minhas',
			started_3: false,
			listeners: {
				celldblclick: function ( thisobject, thisrowIndex, thiscolumnIndex, thisevent ){
					var selecao = this.getSelectionModel().getSelections();

					if (selecao.length === 0) {
						Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.select')});
						//se entrar neste if algo esta terrívelmente errado, mesmo...
						return false;
					}

					var id = selecao[0].get('id');
					var titulo_postagem = selecao[0].get('titulo_postagem');
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

			},

			store: new Ext.data.JsonStore({
				url: 'ppostagens/listmypendentes',
				root: 'data',
				idProperty: 'id',
				totalProperty: 'total',
				autoLoad: true,
				autoDestroy: false,
				remoteSort: true,
				baseParams: {
					limit: 50
				},
				sortInfo: {
					field: 'data_postagem',
					direction: 'DESC'
				},
				fields: [
					{name: 'id', type: 'int'},
					{name: "data_postagem", type: "date", dateFormat: "Y-m-d H:i:s"},
					{name: 'titulo_postagem', type: 'string'},
					{name: 'nome_usuario', type: 'string'},
					{name: 'leituras', type: 'int'},
					{name: 'downloads', type: 'int'},
					{name: 'cliente', type: 'string'},
					{name: 'fl_lida', type: 'string'}
				],
				listeners: {
					scope: this,
					load: function(thisobject, thisrecords, thisoprtions){
						if(this.started_3)
							return;
						this.started_3 = true;
						var task = {
							run: function() {
								Ext.getCmp('Application.tabPannel.clientes.minhas').store.load();
							},
							interval: 180000 //180s
						}
						var run = new Ext.util.TaskRunner();
						run.start(task);
					},
					exception: Application.app.failHandler
				}
			}),
			view: new Ext.grid.GridView({

				getRowClass : function (row, index) {
					var cls = '';
					var data = row.data;
					if(data.fl_lida == 'false') {
						cls = 'linha-vermelho-claro';
					}
					return cls;
				}
			}), 
			columns: [{
				dataIndex: 'data_postagem',
				header: Application.app.language('controle.postagens.data.postagem'),
				width: 130,
				sortable: true,
				renderer:  function(data, cell, record, rowIndex, columnIndex, store) {
					return data.format("d/m/Y H:i \\h\\s");
				}
			},{
				dataIndex: 'titulo_postagem',
				header: Application.app.language('controle.postagens.nome.postagem'),
				width: 180,
				sortable: true
			},{
				dataIndex: 'cliente',
				header: Application.app.language('controle.postagens.cliente'),
				width: 90,
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
			},{ 
				dataIndex: 'nome_usuario',
				header: Application.app.language('controle.postagens.postado.por'),
				sortable: true 
			}]  
		});

		this.tabPanel = new Ext.TabPanel({
			enableTabScroll: true,
			region: 'center',
			activeTab: 0,
			defaults: {
				closable: true
			},
			items: [{
				title: Application.app.language('window.title'),
				closable: false,
				xtype: 'panel',
				border:false,
				region: 'center',
				margins: '35 5 5 0',
				layout:'column',
				items: [{
					columnWidth: .5,
					style: 'padding:10px',
					border:false,
					height: 460,
					layout:'vbox',
					layoutConfig:{
						align:'stretch'
					},
					items: [{
						flex: 2,
						xtype: 'panel',
						border: false,
						layout: 'fit',
						layoutConfig: {
							align: 'stretch'
						},
						items: [this.gridClientsRecents]
					},{ 
						flex: 1,
						bodyStyle: 'padding-top:10px;',
						xtype: 'panel',
						border: false,
						layout: 'fit',
						layoutConfig: {
							align: 'stretch'
						},
						items: [this.uploadPannel]
					}] 
				},{
					columnWidth: .5,
					border:false,
					style: 'padding:10px',
					height: 460,
					layout:'fit',
					layoutConfig:{
						align:'stretch'
					},
					items: [this.gridClientsMinhas]
				}] 
			}]
		});
	
		this.viewPort = new Ext.Viewport({
			id: 'viewPort',
			layout: 'border',
			items:[{
				title: 'Menu',
				region: 'west',
				layout: 'accordion',
				defaultType: 'treepanel',
				width: 200,
				split: true,
				collapsible: true,
				layoutConfig: {
					fill: false,
					animate:true
				},
				defaults: {
					border: false,
					rootVisible: false,
					bodyStyle: 'background:white;',
					listeners: {
						scope: this,
						afterrender: function(painel){
							Ext.getCmp('viewPort').layout.west.getCollapsedEl().titleEl.dom.innerHTML = '<img src="images/menu.png" />';
						},
						click: function(node){
							if(!node.attributes.eXtype) {
								return;
							}
							var novaAba = this.tabPanel.items.find(function(aba){
								return aba.title === node.text;
							});
							if(!novaAba) {
								novaAba = this.tabPanel.add({
									title: node.text,
									xtype: node.attributes.eXtype
								});
							}
							this.tabPanel.activate(novaAba);
						}
					}
				},
				items: menu
			},{
				region: 'south',
				split: false,
				id:'rodapeApp',
				height: 34,
				minSize: 34,
				maxSize: 34,
				collapsible: false,
				frame:true,
				margins: '0 0 0 0',
				layout:'hbox',
				items: [{
					unstyled: true,
					height: '100%',
					html: notaDeRodape,
					flex:1
				},{
					height: '100%',
					unstyled: true,
					bodyStyle:'text-align: right;',
					html: allConfig[3],
					flex:1
				}]
			},{
				region:'north',
				split: false,
				height: 90,
				minSize: 90,
				maxSize: 90,
				collapsible: false,
				frame:true,
				baseCls:'x-toolbar',
				layoutConfig: {
					padding:'0',
					align:'middle'
				},
				items: [{
					split: false,
					width: '100%',
					unstyled: true,
					height: 50,
					minSize: 50,
					maxSize: 50,
					collapsible: false,
					frame:true,
					layout:'hbox',
					layoutConfig: {
						align:'middle'
					},
					items: [{
						xtype: 'spacer',
						width:240
					},{
						bodyStyle:'color:#242364; font-size:18px; line-height:18px; text-align: center; height:20px;position:absolute;margin-top: -12px; background: none;border:none',
						html: accountConfig[6],
						flex:1
					},{
						xtype:'spacer',
						width:240
					}]						
				},{
					split: false,
					height: 35,
					minSize: 35,
					maxSize: 35,
					collapsible: false,
					frame:true,
					layout:'hbox',
					width: '100%',
					layoutConfig: {
						padding: '0px'
					},
					items: [{
						unstyled: true,
						html: Application.app.language("window.ola") + ' ' + Application.app.getUserInfo().nome_usuario + '.',
						flex:1
					},{
						xtype:'button',
						text:  Application.app.language("window.profile"),
						iconCls: 'silk-profile',
						handler: function(botao, evento){
							var id = Application.app.getUserInfo().id;
								if(!UserCli.windowPerfil){
									UserCli.windowPerfil = new UserCli.AdministrationUserCliFormEditPerfil({
										///???
									});
								}
								UserCli.windowPerfil.setUserCli(id);
								UserCli.windowPerfil.show();
						}
					},{
						xtype:'button',
						text: Application.app.language("window.exit"),
						iconCls: 'silk-close',
						handler: function(botao, evento){
							window.location = baseURL + 'portal/logout/token/' + accToken;
						}
					}]
				}]
			},
				this.tabPanel
			] 
			
 		}); 
		var logo = document.createElement("img");
		logo.src = accountConfig[2];
		logo.style.zIndex = 5000;
		logo.style.position = "absolute";
		document.getElementsByTagName("body")[0].appendChild(logo);
		
		if(personalCliLogo) {
			var cliLogo = document.createElement("img");
			cliLogo.src = personalCliLogo;
			cliLogo.style.zIndex = 5000;
			cliLogo.style.position = "absolute";
			cliLogo.style.right = "10px";
			cliLogo.style.top = "0px";
			document.getElementsByTagName("body")[0].appendChild(cliLogo);
		}

		var hideMask = function(){
			Ext.get('loading').remove();
			Ext.fly('loading-mask').fadeOut({
				remove:true
			});
		};
		hideMask.defer(250);  
	},
       
	initLogin: function(){
		var hideMask = function () {
			Ext.get('loading').remove();
			Ext.fly('loading-mask').fadeOut({
				remove:true
			});
			
		};
		hideMask.defer(250);

		var login = new Ext.FormPanel({
			url: baseURL + 'portal/auth',
			id:'id-form-login',
			iconCls: 'icon-lock',
			frame:true,
			title: Application.app.language("auth.title"),
			bodyStyle: 'padding:5px;',
			monitorValid:true,
			layout:'hbox',
			buttonAlign: 'center',
			labelWidth: 45,
			anchor: '100%',	
			width: '100%',
			items:[{
				anchor: '100%',
				width: '100%',
				layout: 'column',
				border:false,
				items:[{
					columnWidth: 0.8,

					layout: 'form',
					border:false,
					items:[{
						xtype: 'textfield',
						fieldLabel: Application.app.language("auth.username"),
						width: '85%',
						name: 'login_usuario',
						id: 'loginUsername',
						allowBlank:false,
						listeners:{
							specialkey:function(owner,e){
								if (e.getKey() == 13){
									Ext.getCmp('loginPassword').focus(true);
								}
							}
						}
					},{
						fieldLabel: Application.app.language("auth.password"),
						width: '85%',
						name:'senha_usuario',
						id: 'loginPassword',
						inputType:'password',
						xtype:'passwordfield',
						showCapsWarning:true,
						allowBlank:false,
						listeners:{
							specialkey:function(owner,e){
								if (e.getKey() == 13){
									if(owner.getValue() != '*****'){
										Application.changedPassField = true;
									}
									var valid = true; 
									var f = Ext.getCmp('id-form-login');
									f.form.items.each(function(f){
										if(!f.isValid(true)){
											valid = false;
										}
									});
								}
							if(valid)
								Application.app.doLogin();
							},
							change:function(owner) {
								Application.changedPassField = true;
							}
						}
					}]
				},{
					columnWidth: 0.2,					

					layout: 'form',
					border: false,
					items: [{
						xtype: 'checkbox',  
						name: 'remember_user',
						hiddenName: 'remember_user',
						id: 'remember_user', 
						fieldLabel: Application.app.language('auth.remember'),
						listeners: {
							check: function(owner, statusB){
								if(statusB){
									Ext.getCmp('remember_pass').enable();
								} else {
									Ext.getCmp('remember_pass').disable();
									Ext.getCmp('remember_pass').setValue(false);
								}
							}
						}
					},{
						xtype: 'checkbox', 
						name: 'remember_pass',  
						hiddenName: 'remember_pass',
						id: 'remember_pass',
						fieldLabel: Application.app.language('auth.remember')
					}]
				}]
			}],
			buttons:[{
				id: 'botaoLogin',
				text:'Login',
				type:'submit',
				iconCls: 'silk-key',
				formBind: true,
				handler: Application.app.doLogin
			},{
				xtype:'panel',
				baseCls: 'x-plain',
				width: 13
			}]
		});

		var win = new Ext.Window({
			layout:'fit',
			width:370,
			height:155,
			closable: false,
			resizable: false,
			plain: true,
			border: false,
			items: [login],
			x: 185,
			y: 230,
			draggable: false,
			listeners:{
				show: function(janela){
					Ext.getCmp('loginUsername').focus(false, 500);
	
					if(userPassRemember){
						Ext.getCmp('loginPassword').setValue('*****');
						Ext.getCmp('remember_pass').setValue(true);
					}

					if(userNameRemember){
						Ext.getCmp('loginUsername').setValue(userNameRemember);
						Ext.getCmp('remember_user').setValue(true);
						Ext.getCmp('remember_pass').enable();
					} else {
						Ext.getCmp('remember_pass').disable();
					}
				}
			}
		});

		win.show();

	},
		
        doLogin: function(){
			var formulario = Ext.getCmp('id-form-login').getForm();
			
			formulario.on('beforeaction', function(form, action) {
				if (action.type == 'submit') {
					Ext.getCmp('loginPassword').disable();
					action.options.params = action.options.params || {};

					if(userPassRemember){
						if(!Application.changedPassField){
							Ext.apply(action.options.params, {
								id_account: accID,
								senha_usuario: userPassRemember
							});
						} else {
							Ext.apply(action.options.params, {
								id_account: accID,
								senha_usuario: b64_hmac_md5(b64_hmac_md5(Ext.getCmp('loginPassword').getValue(), "GB7gj123fLphg7%$g2f"), Ext.getCmp('loginUsername').getValue())
							});
						}
					} else {
						Ext.apply(action.options.params, {
							id_account: accID,
							senha_usuario: b64_hmac_md5(b64_hmac_md5(Ext.getCmp('loginPassword').getValue(), "GB7gj123fLphg7%$g2f"), Ext.getCmp('loginUsername').getValue())
						});
					}
				}
			});
			
			formulario.on('actionfailed', function(form, action) {
				if (action.type == 'submit') {
					Ext.getCmp('loginPassword').enable();
				}
			});
			
			formulario.submit({
		        method:'POST', 
		        waitTitle: Application.app.language("auth.alert"),
		        waitMsg: Application.app.language("auth.loading"),
		        
				success:function(form, action){
		    		if(action.result.success){
						window.location = baseURL + 'portal';
		    		}
				},
				failure: Application.app.failHandler
		    }); 
        },
       
	uniqueID: function(){
		if ( typeof this.uniqueID.counter == 'undefined' ) {
			this.uniqueID.counter=0;
		}
		return (++(this.uniqueID.counter))+arguments[0];
	},
 
        failHandler: function(){
        	switch(arguments.length){
				case 2:
					var arg1 = arguments[0];
					var arg2 = arguments[1];
				
					if(((arg1.isAbort != undefined) && (arg2.headers != undefined)) || ((arg1.status != undefined) && (arg2.method != undefined))){
						var response = arg1;
						var options = arg2;
						Application.app.showMessageBox({
							msg: _switchResponseStatus(response.status) + '<br />Status ' + response.status + ': ' + response.statusText + '<br />' + response.responseText 
						});
					}
					else if ((arg1.onSubmit != undefined) && (arg2.response != undefined)) {
							var form = arg1;
							var action = arg2;
							
							if (action.failureType === Ext.form.Action.CONNECT_FAILURE) {
								if (action.response.status == "404") {
									Application.app.showMessageBox({
										msg: Application.app.language("failhandler.ErroHTTP404") + '<br />Status ' + action.response.status + ': ' + action.response.statusText
									});
								}
								else {
									Application.app.showMessageBox({
										msg: Application.app.language("failhandler.ErroHTTPComunication") + '<br />Status ' + action.response.status + ': ' + action.response.statusText
									});
								}
							}
							else 
								if (!action.response.getResponseHeader) {
									if (action.response.responseText.charAt(0) == "{") {
										var obj = Ext.decode(action.response.responseText);
										Application.app.showMessageBox({
											msg: obj.errormsg
										});
									}
									else 
										Application.app.showMessageBox({
											msg: Application.app.language("failhandler.ErroHTTPNotJSON") + '<br />' + action.response.responseText
										});
								}
								else {
									var contentType = action.response.getResponseHeader('Content-Type');
									if (contentType != "application/json") {
										Application.app.showMessageBox({
											msg: Application.app.language("failhandler.ErroHTTPNotJSON") + '<br />' + action.response.responseText
										});
									}
									else {
										var obj = Ext.decode(action.response.responseText);
										Application.app.showMessageBox({
											msg: obj.errormsg
										});
									}
								}
						}
						else {
							Application.app.showMessageBox({
								msg: Application.app.language("failhandler.ErroIndefinido")
							});
						}
					break;
				case 5:
					var DataProxy = arguments[0];
					var type = arguments[1];
					var action = arguments[2];
					var options = arguments[3];
					var response = arguments[4];
					
					if (response.status == 0) {
						Application.app.showMessageBox({msg: Application.app.language("failhandler.ErroHTTPComunication") + '<br />Status '+response.status+': '+ response.statusText});
		            }
					else Application.app.showMessageBox({msg: _switchResponseStatus(response.status)+ '<br />' + response.responseText});
					break;
				case 6:
					var DataProxy = arguments[0];
					var type = arguments[1];
					var action = arguments[2];
					var options = arguments[3];
					var response = arguments[4];
					var arg = arguments[5];
					
					Application.app.showMessageBox({msg: _switchResponseStatus(response.status)+ '<br />' + response.responseText});
					break;
				default:
					Application.app.showMessageBox({msg: Application.app.language("failhandler.ErroIndefinido")});
					break;
			}
        },
        
        showMessageBox: function(config){
    		var defaults = ({
    			title: Application.app.language('grid.form.alert.title'),
    			msg: Application.app.language('failhandler.ErroHTTP'),
    			width: 350,
    			buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
    		});
    		Ext.MessageBox.show(Ext.apply(defaults, config));
    	},
    
	showInfoBox: function(config){
		var defaults = ({
			title: Application.app.language('grid.form.alert.title'),
			msg: Application.app.language('failhandler.ErroHTTP'),
			width: 350,
			buttons: Ext.MessageBox.OK,
		icon: Ext.MessageBox.INFO
		});
		Ext.MessageBox.show(Ext.apply(defaults, config));
	},
	
    	confirm: function(titulo, mensagem, funcao, scope){
			Ext.Msg.show({
				title: titulo,
				msg: mensagem,
				buttons: Ext.Msg.YESNO,
				fn: funcao,
				width: 350,
				icon: Ext.MessageBox.QUESTION,
				scope: scope
			});
		},
		
		showNotification: function(config){
			var win = new Ext.ux.Notification(Ext.apply({
				animateTarget:Ext.get('rodapeApp'),
				autoDestroy:true,
				hideDelay:3000,
				html:Application.app.language('operation.sucess'),
				iconCls:'icon-alerta',
				title: Application.app.language('operation.sucess.title')
			}, config));
			win.show();
			return win;
		},
    	
    	addslashes: function(str) {
    	     return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\u0000/g, "\\0");
    	},
        
        getServerConfig: function(config){
        	return _getServerConfig(config);
        },
        
        getConfig: function(config){
        	return allConfig[config];
        },
		
		getAccountConfig: function(config){
        	return accountConfig[config];
        },
        
        getUserInfo: function(){
        	return userInfo;
        },
        
        language: function(txt){
        	var traducao = Application.language[txt];
        	if(traducao){
        		if(traducao.length == 0) return txt;
        		else return traducao;
        	}
        	else return txt;
        },
        
		languages: [
		    ['', Application.language['administration.user.form.language.helper']],
			['pt_BR', 'Português'],
			['en', 'English'],
			['es', 'Español']
		]
        
    };
}();
