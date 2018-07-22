Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/s.gif';
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

Ext.namespace('Application');

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
		Application.language = Ext.decode(_syncAjax(baseURL + 'index/language', null));
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
		menu = Ext.decode(_syncAjax(baseURL + 'index/menu', null));
	};
	
	var _populateUserInfo = function(){
		userInfo = Ext.decode(_syncAjax(baseURL + 'index/userinfo', null));
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
	
	
	/*Ext.override(Ext.form.Action.Submit, {
		handleResponse : function(response){
			
			if(this.form.errorReader){
	            var rs = this.form.errorReader.read(response);
	            var errors = [];
	            if(rs.records){
	                for(var i = 0, len = rs.records.length; i < len; i++) {
	                    var r = rs.records[i];
	                    errors[i] = r.data;
	                }
	            }
	            if(errors.length < 1){
	                errors = null;
	            }
	            return {
	                success : rs.success,
	                errors : errors
	            };
	        }
	
			var contentType = response.getResponseHeader('Content-Type');
			if((contentType != "application/json")&& (response.responseText.charAt(0) != "{")){
				return Ext.decode('{success:false, errormsg:"' + Application.app.language("failhandler.ErroHTTPNotJSON") + Application.app.addslashes(response.responseText).replace(/\n/g, '<br />') +'"}');
			}
	        else{
		        return Ext.decode(response.responseText);
			}
	    }
	});
	
	Ext.override(Ext.form.Action.Load, {
		success : function(response){
			var contentType = response.getResponseHeader('Content-Type');
			if((contentType != "application/json")&& (response.responseText.charAt(0) != "{")){
				Application.app.showMessageBox({msg: Application.app.language("failhandler.ErroHTTPNotJSON") + Application.app.addslashes(response.responseText).replace(/\n/g, '<br />')});
			}
			else{
				var result = this.processResponse(response);
				if(result === true || !result.success || !result.data){
					this.failureType = Ext.form.Action.LOAD_FAILURE;
					this.form.afterAction(this, false);
					return;
				}
				this.form.clearInvalid();
				this.form.setValues(result.data);
				this.form.afterAction(this, true);
			}
		}
	}); */
	
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
    					
			var PortalTools = [{
				id:'close',
				handler: function(e, target, panel){
					panel.ownerCt.remove(panel, true);
				}
			}];
			
			Ext.apply(Ext.form.VTypes, {
				password: function(value, field) {
					if(value == "") return false;
					var pwd = Ext.getCmp(field.initialPassField);
					this.passwordText = Application.app.language('administration.user.form.password.error');
					if(value == pwd.getValue()){
						pwd.clearInvalid();
						return true;
					}
					else return false;
				}
			});
			
			this.tabPanel = new Ext.TabPanel({
				region: 'center',
				activeTab: 0,
				defaults: {
					closable: true
				},
				items: [{
					title: Application.app.language('window.title'),
					bodyStyle: 'padding: 20px;',
					closable: false,
					xtype: 'portal',
					region: 'center',
					margins: '35 5 5 0',
					items: [{
						columnWidth: .5,
						style: 'padding:10px',
						items: [{
							title: Application.app.language('window.welcome'),
							bodyStyle: 'padding:10px',
							tools:PortalTools,
							html: Application.app.language('window.saudacao')
						}]
					}]
				}]
			});			
			
    		this.viewPort = new Ext.Viewport({
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
							click: function(node){
								if(!node.attributes.eXtype) {
									return;
								}
								this.tabPanel.el.mask('<img src="' + baseURL + 'images/icons/loading.gif" align="absmiddle" /> ' + Application.app.language('i18n.loading'));
								if(!Application.AccessController.hasPermission(node.attributes.permissao)){
									Application.app.showMessageBox({msg: Application.app.language("administration.group.permission.denied")});
									this.tabPanel.el.unmask();
									return;
								}
								this.tabPanel.el.unmask();
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
				    bodyStyle: 'text-align:right',
				    html: allConfig[3]
			    },{
			    	region: 'north',
				    split: false,
				    height: 60,
				    minSize: 60,
				    maxSize: 60,
				    collapsible: false,
				    frame:true,
				    baseCls:'x-toolbar',
				    layout:'hbox',
				    layoutConfig: {
		                padding:'5',
		                align:'middle'
		            },
				    items: [{
				    	xtype:'spacer',
				    	width:240
				    },{
				    	unstyled: true,
				    	bodyStyle:'color:#242364; font-size:18px; line-height:18px',
				    	html: allConfig[2],
				    	flex:1
				    },{
				    	xtype:'spacer',
				    	flex:1
				    },{
				    	unstyled: true,
				    	html: Application.app.language("window.ola") + ' ' + Application.app.getUserInfo().nome_usuario + '.'
				    },{
				    	xtype:'spacer',
				    	width:10
				    }, {
						xtype:'button',
						text:  Application.app.language("window.profile"),
						iconCls: 'silk-profile',
						handler: function(botao, evento){
					    	var id = Application.app.getUserInfo().id;
							if(!User.windowPerfil){
								User.windowPerfil = new User.AdministrationUserFormEditPerfil({
									
								});
							}
							User.windowPerfil.setUser(id);
							User.windowPerfil.show();
				    	}
				    }, {
						xtype:'button',
						text: Application.app.language("window.exit"),
						iconCls: 'silk-close',
						handler: function(botao, evento){
				    		window.location = baseURL + 'index/logout/token/' + accToken;
				    	}
				    }]
			    },
			    this.tabPanel
			    ]
			});
	
	  
			var logo = document.createElement("img");
	    	logo.src = accountConfig[2];
	    	logo.style.zIndex = 10000;
	    	logo.style.position = "absolute";
	    	
			document.getElementsByTagName("body")[0].appendChild(logo);
			
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
				url: baseURL + 'index/auth',
				id:'id-form-login',
				iconCls: 'icon-lock',
			    frame:true,
			    title: Application.app.language("auth.title"),
			    bodyStyle: 'padding:10px;',
				monitorValid:true,
				layout:'hbox',
				items:[{
			    	html: '<img src="' + baseURL + 'images/login.png" width="48" height="48" />',
			        flex: 1
				},{
					flex:4,
					layout:'form',
					labelAlign:'left',
					labelWidth: 50,
					height:100,						
					defaultType:'textfield',
					items:[{
						fieldLabel: Application.app.language("auth.username"),
						name: 'login_usuario',
						id: 'loginUsername',
						allowBlank:false,
						width: '85%',
						listeners:{
							specialkey:function(owner,e){
								if (e.getKey() == 13){
									Ext.getCmp('loginPassword').focus(true);
								}
							}
						}
					},{
						fieldLabel: Application.app.language("auth.password"),
						name:'senha_usuario',
						id: 'loginPassword',
						inputType:'password',
						xtype:'passwordfield',
						showCapsWarning:true,
						allowBlank:false,
						width: '85%',
						listeners:{
							specialkey:function(owner,e){
								if (e.getKey() == 13){
									var valid = true;
									var f = Ext.getCmp('id-form-login');
									f.form.items.each(function(f){
										if(!f.isValid(true)){
											valid = false;
											return false;
										}
									});
								}
								if(valid) Application.app.doLogin();
							}
						}
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
		        width:356,
		        height:165,
		        closable: false,
		        resizable: false,
		        plain: true,
		        border: false,
		        items: [login],
		        listeners:{
					show: function(janela){
						Ext.getCmp('loginUsername').focus(false, 500);
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
					Ext.apply(action.options.params, {
						id_account: accID,
						senha_usuario: b64_hmac_md5(b64_hmac_md5(Ext.getCmp('loginPassword').getValue(), "GB7gj123fLphg7%$g2f"), Ext.getCmp('loginUsername').getValue())
					});
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
						window.location = baseURL;
		    		}
				},
				failure: Application.app.failHandler
		    }); 
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
