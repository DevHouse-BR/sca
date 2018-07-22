User.AdministrationUserForm = Ext.extend(Ext.Window, {
	user: 0,
	idCliente:0,
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	iconCls:'icon-user',
	width: 450,
	height: 380,
	title: Application.app.language('administration.user.form.title'),
	layout: 'fit',
	setUser: function(user) {
		this.user = user;
	},
	setIdCliente: function (value) {
		this.idCliente = value;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		User.AdministrationUserForm.superclass.constructor.apply(this, arguments);
	},
	initComponent: function() {
		
		this.on('beforerender',function(janela){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto:'comboAccountG_AdministrationUserForm',
					acl:14,
					tipo:'componente'
				},{
					objeto:this,
					acl:14,
					tipo:'execute',
					funcao: function(objeto){
						objeto.height = 350;
					}
				},{
					objeto:'btnExcluir_AdministrationUserForm',
					acl:6,
					tipo:'componente'
				}]
			});
		});
		
		this.languages = new Ext.form.ComboBox({
			scope: this,
            store: new Ext.data.SimpleStore({
                    fields: ['code', 'name'],
                    data: Application.app.languages
            }),
			hiddenName: 'idioma_usuario',
			allowBlank: true,
			displayField: 'name',
			valueField: 'code',
			mode: 'local',
			triggerAction: 'all',
			emptyText: Application.app.language('administration.user.form.language.helper'),
			fieldLabel: Application.app.language('administration.user.form.language.text')
		});
		
		this.departamentos = new Ext.form.ComboBox({
			scope: this,
			store: new Ext.data.JsonStore({
				scope: this,
				url: 'user/departamentosList',
				root: 'data',
				autoLoad: true,
				autoDestroy: true,
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
			hiddenName: 'departamento',
			allowBlank: 'false',
			displayField: 'name',
			valueField: 'id',
			mode: 'local',
			triggerAction: 'all',
			emptyText: Application.app.language('administration.user.form.departamentos.helper'),
			fieldLabel: Application.app.language('administration.user.form.departamentos.text')
		});
		
		this.departamentos.store.addListener('load', this.carrega_ajax_departamentos, this);
		
		this.accountM = new Ext.form.ComboBox({
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
			id:'comboAccountG_AdministrationUserForm',
			hiddenName: 'accountM',
			allowBlank: 'false',
			displayField: 'name',
			valueField: 'id',
			mode: 'local',
			triggerAction: 'all',
			emptyText: Application.app.language('administration.user.form.account.helper'),
			fieldLabel: Application.app.language('administration.user.form.account.text')
		});
		
		this.recebeMsg = new Ext.form.Checkbox({
			name: 'recebe_msg',
			hiddenName: 'recebe_msg',
			fieldLabel: Application.app.language('administration.user.form.mensagem.text')
		});
		
		this.formUPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			border: false,
			autoScroll: true,
			monitorValid:true,
			defaultType: 'textfield',
			defaults: {anchor: '-19'},
			items:[{
				fieldLabel: Application.app.language('administration.user.form.name.text'), 
				name: 'name',
				id:'fieldName_AdministrationUserForm',
				allowBlank: false, 
				maxLength: 255
			},{
				fieldLabel: Application.app.language('administration.user.form.username.text'), 
				name: 'username', 
				allowBlank: false, 
				maxLength: 255, 
				id: 'login_usuario_edit'
			},{
				fieldLabel: Application.app.language('administration.user.form.email.text'), 
				name: 'email', 
				allowBlank: false, 
				maxLength: 255
			},{
				fieldLabel: Application.app.language('administration.user.form.password.text'), 
				name: 'password', 
				allowBlank: false, 
				maxLength: 64, 
				inputType: 'password', 
				id: 'password', 
				vtype: 'password', 
				initialPassField: 'password2'
			},{
				fieldLabel: Application.app.language('administration.user.form.password2.text'), 
				name: 'password2', 
				allowBlank: false, 
				maxLength: 64, 
				inputType: 'password', 
				id: 'password2', 
				vtype: 'password', 
				initialPassField: 'password'
			},{
				fieldLabel: Application.app.language('administration.user.form.status.text'), 
				xtype: 'radiogroup', 
				name: 'status', 
				items: [{
					boxLabel: Application.app.language('administration.user.form.status.active'), 
					name: 'status', 
					inputValue: '1', 
					checked:true
				},{
					boxLabel: Application.app.language('administration.user.form.status.inactive'), 
					name: 'status', 
					inputValue: '0'
				}]
			},
				this.recebeMsg,
				this.departamentos,
				this.languages,
				this.accountM
			],
			buttons: [{
				text: Application.app.language('grid.form.save'),
				iconCls: 'icon-save',
				scope: this,
				formBind:true,
				handler: this._onBtnSalvarClick
			},{
				id: 'btnExcluir_AdministrationUserForm',
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
			items: this.formUPanel			
		});
		User.AdministrationUserForm.superclass.initComponent.call(this);
	},
	show: function() {
		//this.formUPanel.getForm().reset();
		
		if (this.idCliente != 0) {
			this.departamentos.hide();
			this.setHeight(310);
		}		
		
		User.AdministrationUserForm.superclass.show.apply(this, arguments);
		if(this.user !== 0) {
			this.formUPanel.findById("password").allowBlank = true;
			this.formUPanel.findById("password2").allowBlank = true;
			
			this.formUPanel.getForm().load({
				waitTitle: Application.app.language("auth.alert"),
			    waitMsg: Application.app.language("auth.loading"),
				url: 'user/get',
				params: {
					id: this.user
				},
				scope: this
			});
			this.languages.setValue(this.idiomaGet);
			if(Application.AccessController.hasPermission(6)){
				Ext.getCmp('btnExcluir_AdministrationUserForm').show();
			}
			
			this.formUPanel.findById('login_usuario_edit').disable();

			this.departamentos.store.load();
		} else {
			this.formUPanel.findById('login_usuario_edit').enable();
			this.formUPanel.findById("password").allowBlank = false;
			this.formUPanel.findById("password2").allowBlank = false;
			this.languages.setValue("");
			this.departamentos.store.load();
			Ext.getCmp('btnExcluir_AdministrationUserForm').hide();
		}
		Ext.getCmp('fieldName_AdministrationUserForm').focus(false, 500);
	},
	carrega_ajax_departamentos: function (a, b, c) {
		if(this.user){
			Ext.Ajax.request({
				scope: this,
				url: 'user/userdept',
				params: {
					'id': this.user
				},
				success: function (a, b) {
					try {
						var c = Ext.decode(a.responseText);
					}
					catch (e) {};
					if (c.failure == true) {
						this.departamentos.setValue("");
						return;
					}
					this.departamentos.setValue(c.data);
				}
			});
		}
	},
	setIdiomaGet: function (info){
		this.idiomaGet = info;
	},
	onDestroy: function() {
		User.AdministrationUserForm.superclass.onDestroy.apply(this, arguments);
		this.formUPanel = null;
	},
	_onBtnSalvarClick: function() {
		var form = this.formUPanel.getForm();
		
		form.on('beforeaction', function(form, action) {
			if (action.type == 'submit') {
				Ext.getCmp('password').disable();
				Ext.getCmp('password2').disable();
				action.options.params = action.options.params || {};
				Ext.apply(action.options.params, {
					password: b64_hmac_md5(b64_hmac_md5(Ext.getCmp('password').getValue(), "GB7gj123fLphg7%$g2f"), Ext.getCmp('login_usuario_edit').getValue())
				});
			}
		});
		

		form.submit({
			waitTitle: Application.app.language("auth.alert"),
		    waitMsg: Application.app.language("auth.loading"),
			url: 'user/save',
			params: {
				id: this.user,
				idcliente: this.idCliente
			},
			scope:this,
			success: function() {
				this.fireEvent('salvar', this);
				this.close();
			},
			failure: function(formulario, action){
				Ext.getCmp('password').enable();
				Ext.getCmp('password2').enable();
				Application.app.failHandler(formulario, action);
			} 
			
		});
	},
	_onBtnDeleteClick: function() {
		Application.app.confirm(Application.app.language('grid.form.confirm.title'), Application.app.language('grid.form.confirm.delete'), function(opt) {
			if(opt === 'no') {
				return;
			}
			this.el.mask(Application.app.language('grid.form.deleting'));
			Ext.Ajax.request({
				url: 'user/delete',
				params: {
					id: this.user
				},
				scope: this,
				success: function() {
					this.el.unmask();
					this.hide();
					this.fireEvent('excluir', this);
				}
			});
		}, this);
	},
	_onBtnCancelarClick: function() {
		//this.hide();
		this.close();
	}
});
Ext.apply(Ext.form.VTypes, {
	password: function(value, field) {
		var pwd = Ext.getCmp(field.initialPassField);
		this.passwordText = Application.app.language('administration.user.form.password.error');
		return (value == pwd.getValue());
	}
});
