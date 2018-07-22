Clientes.ControleClientesForm = Ext.extend(Ext.Window, {
	group: 0,
	id: 'ControleClientesFormwindow',
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	width: 450,
	height: 324,
	iconCls:'icon-cliente',
	title: Application.app.language('controle.clientes.form.title'),
	layout: 'fit',
	//closeAction: 'hide',
	setGroup: function(group) {
		this.group = group;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		Clientes.ControleClientesForm.superclass.constructor.apply(this, arguments);
	},
	initComponent: function() {
			this.on('beforerender',function(janela){
				Application.AccessController.applyPermission({
					defaultAction:'hide',
					items:[{
						objeto:'comboAccountX_ControleClientesForm',
						acl:14,
						tipo:'componente'
					},{
						objeto:this,
						acl:14,
						tipo:'execute',
						funcao: function(objeto){
							objeto.height = 304;
						}
					},{
						objeto: 'comboUserResponsavel_ControleClientesForm',
						acl:3,
						tipo:'componente'
					},{
						objeto:'btnExcluir_ControleClientesForm',
						acl:10,
						tipo:'componente'
					}]
				});
			});
			
              this.accountX = new Ext.form.ComboBox({
            	  		id:'comboAccountX_ControleClientesForm',
                        store: new Ext.data.JsonStore({
                                url: 'user/accountsList',
                                root: 'data',
                                autoLoad: true,
                                remoteSort: true,
								listeners:{
									exception: Application.app.failHandler
								},
                                sortInfo: {
                                        field: 'name',
                                        direction: 'ASC'
                                },
                                fields: [
                                        {name: 'id', type: 'int'},
                                        {name: 'name', type: 'string'}
                                ]
                        }),
                        hiddenName: 'accountX',
                        allowBlank: 'false',
                        displayField: 'name',
                        valueField: 'id',
                        mode: 'local',
                        triggerAction: 'all',
                        emptyText: Application.app.language('administration.user.form.account.helper'),
                        fieldLabel: Application.app.language('administration.user.form.account.text')
                });
              
                this.usersStore = new Ext.data.JsonStore({
                    url: 'clientes/listusers',
                    root: 'data',
                    autoLoad: false,
                    autoDestroy: false,
                    remoteSort: true,
					listeners:{
						exception: Application.app.failHandler
					},
                    sortInfo: {
                            field: 'name',
                            direction: 'ASC'
                    },
                    fields: [
                            {name: 'id', type: 'int'},
                            {name: 'name', type: 'string'}
                    ]
                });

				this.usersStore.addListener('load', function (a, b, c){
					if(this.group != 0){
		                Ext.Ajax.request({
	                        scope: this,
	                        url: 'clientes/mostraresponsavel',
	                        params: {
	                                'id': this.group
	                        },
	                        success: function (a, b) {
                                try {
                                        var c = Ext.decode(a.responseText);
                                } catch (e) {
                                        return;
                                };
                                if (c.failure == true) {
                                        this.listUserResponsavel.setValue("");
                                        return;
                                }
                                if (c.data == 0)
                                        this.listUserResponsavel.setValue("");
                                else
                                        this.listUserResponsavel.setValue(c.data);
	                        }
		                });
					}
				}, this);

        this.listUserResponsavel = new Ext.form.ComboBox({
    		id:'comboUserResponsavel_ControleClientesForm',
            scope: this,
            store: this.usersStore,
            hiddenName: 'responsavel',
            allowBlank: true,
            displayField: 'name',
            valueField: 'id',
            triggerAction: 'all',
            mode: 'local',
            fieldLabel: Application.app.language('controle.clientes.form.responsavel.text'),
            emptyText: Application.app.language('controle.clientes.form.resposnsavel.helper')
        });
                
		this.formPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			monitorValid:true,
			fileUpload: true,
			border: false,
			autoScroll: true,
			defaultType: 'textfield',
			defaults: {
				anchor: '-19'
			},
			items:[{
				fieldLabel: Application.app.language('controle.clientes.nome.text'), 
				name: 'nome_cliente',
				id:'fieldNomeCliente_ControleClientesForm',
				allowBlank: false, 
				maxLength: 255
			},{
				fieldLabel: Application.app.language('controle.clientes.cod.text'), 
				name: 'cod_cliente', 
				allowBlank: true, 
				maxLength: 255
			},
			this.listUserResponsavel,
			{
				fieldLabel: Application.app.language('controle.clientes.form.portal.text'), 
				xtype: 'radiogroup', 
				name: 'portal', 
				items: [{
					boxLabel: Application.app.language('administration.user.form.status.active'), 
					name: 'portal', 
					inputValue: '1'
				},{
					boxLabel: Application.app.language('administration.user.form.status.inactive'), 
					name: 'portal', 
					inputValue: '0',
					checked:true
				}]
			},{
	            xtype:'fieldset',
	            title: Application.app.language('controle.clientes.imagem'),
	            collapsible: true,
				collapsed:true,
	            autoHeight:true,
	            items :[{
					layout:'column',
					border:false,
					defaults:{border:false},
					items:[{
						columnWidth:.6,
						layout: 'form',
						items: [{
							id: 'client_form_upload_image_baseForm',
							border:false,
							bodyStyle:'width:220px;height:52px;',
							html:'<img src="clientes/imgshow?id='+this.group+'&x='+new Date()+'" id="client_form_upload_image" />'
						}]
					},{
						columnWidth:.4,
						layout: 'form',
						labelAlign:'top',
						id: 'client_form_upload_select_field',
						items: [{
							xtype:'fileuploadfield',
							fieldLabel: Application.app.language('administration.setting.form.upload.file'),
							name: 'logo',
							buttonText: '',
							buttonCfg: {
								iconCls: 'upload-icon'
							},
							listeners: {
								fileselected: function(owner, what) {
									Ext.getCmp('ControleClientesFormwindow')._forceReload();																	}
							}
						}]
					}]
				}]
			},{
				xtype:'panel',
				border:false,
				bodyStyle:'padding-left:56px',
				html:Application.app.language('administration.setting.form.upload.instrucoes')
			},
				this.accountX
			],
			buttons: [{
				text: Application.app.language('grid.form.save'),
				iconCls: 'icon-save',
				scope: this,
				formBind:true,
				handler: this._onBtnSalvarClick
			},{
				id:'btnExcluir_ControleClientesForm',
				text: Application.app.language('grid.form.delete'),
				iconCls: 'silk-delete',
				scope: this,
				handler: this._onBtnDeleteClick
			},{
				text: Application.app.language('grid.form.cancel'), 
				iconCls: 'silk-cross', 
				scope: this, 
				handler: this._onBtnCancelarClick
			}]
		});
		Ext.apply(this, {
			items: this.formPanel
		});
		Clientes.ControleClientesForm.superclass.initComponent.call(this);
	},
	_forceReload: function(){
		var form = this.formPanel.getForm();

		Ext.getCmp('fieldNomeCliente_ControleClientesForm').allowBlank = true;

		form.submit({
			waitTitle: Application.app.language("auth.alert"),
			waitMsg: Application.app.language("auth.loading"),
			url: 'clientes/imgupload',
			scope:this,
			success: function(form, action) {
				var response = Ext.decode(action.response.responseText);
				if(!response.success){
					Ext.getCmp('fieldNomeCliente_ControleClientesForm').allowBlank = false;
					Application.app.showMessageBox({msg:response.errormsg})
				} else {
					Ext.getCmp('fieldNomeCliente_ControleClientesForm').allowBlank = false;
					Ext.getDom('client_form_upload_image').src = 'clientes/imgshow?id='+this.group+'&d=' + new Date();
				}
			},
			failure: function () {
				Ext.getCmp('fieldNomeCliente_ControleClientesForm').allowBlank = false;
				Application.app.failHandler(arguments[0], arguments[1]);
			}
		});

	},
	show: function() {
		//this.formPanel.getForm().reset();
		Clientes.ControleClientesForm.superclass.show.apply(this, arguments);
        this.usersStore.load({
            url: 'clientes/listusers',
                scope: this
        });
		if(this.group !== 0) {
			this.formPanel.getForm().load({
				waitTitle: Application.app.language("auth.alert"),
			    waitMsg: Application.app.language("auth.loading"),
				url: 'clientes/get',
				params: {
					id: this.group
				},
				scope: this
			});
			
			if(Application.AccessController.hasPermission(18)){
				Ext.getCmp('btnExcluir_ControleClientesForm').show();
			}
			
			
		} else {
			Ext.getCmp('btnExcluir_ControleClientesForm').hide();
		}
		Ext.getCmp('fieldNomeCliente_ControleClientesForm').focus(false, 500);
	},
	onDestroy: function() {
		Clientes.ControleClientesForm.superclass.onDestroy.apply(this, arguments);
		this.formPanel = null;
	},
	_onBtnSalvarClick: function() {
		var form = this.formPanel.getForm();
		if(!form.isValid()) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.invalid')});
			return false;
		}

		form.submit({
			waitTitle: Application.app.language("auth.alert"),
			waitMsg: Application.app.language("auth.loading"),
			url: 'clientes/save',
			params: {
				id: this.group
			},
			scope:this,
			success: function(form, action) {
				try {
					var response = Ext.decode(action.response.responseText);
					if(!resonse.sucess){
						Application.app.showMessageBox({msg:response.errormsg})
					}
				}
				catch(e){}
				//this.hide();
				this.fireEvent('salvar', this);
				this.close();
			},
			failure: Application.app.failHandler
		});
	},
	_onBtnDeleteClick: function() {
		Application.app.confirm(Application.app.language('grid.form.confirm.title'), Application.app.language('grid.form.confirm.delete'), function(opt) {
			if(opt === 'no') {
				return;
			}
			this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				url: 'clientes/delete',
				params: {
					id: this.group
				},
				scope: this,
				success: function(form, action) {
					try {
						var response = Ext.decode(action.response.responseText);
						if(!resonse.sucess){
							Application.app.showMessageBox({msg:response.errormsg})
						}
					}
					catch(e){}
					this.el.unmask();
					//this.hide();
					this.fireEvent('excluir', this);
					this.close();
				},
				failure: function(a,b){
					this.el.unmask();
					Application.app.failHandler(a,b);
				}
			});
		}, this);
	},
	_onBtnCancelarClick: function() {
		//this.hide();
		this.close();
	}
});
