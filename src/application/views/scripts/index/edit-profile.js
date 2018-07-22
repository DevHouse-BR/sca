Ext.namespace('UserCli');

UserCli.AdministrationUserCliFormEditPerfil = Ext.extend(Ext.Window, {
	user: 0,
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	iconCls:'icon-user',
	width: 450,
	height: 230,
	title: Application.app.language('administration.user.form.editPerfil.title'),
	layout: 'fit',
	closeAction: 'hide',
	setUserCli: function(user) {
		this.user = user;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		UserCli.AdministrationUserCliFormEditPerfil.superclass.constructor.apply(this, arguments);
	},
	initComponent: function() {
		this.languages = new Ext.form.ComboBox({
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
		this.formPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			border: false,
			monitorValid:true,
			autoScroll: true,
			defaultType: 'textfield',
			defaults: {
				anchor: '-19'
			},
			items:[{
				fieldLabel: Application.app.language('administration.user.form.name.text'),
				name: 'nome_usuario',
				allowBlank: false,
				maxLength: 255
			},{
				fieldLabel: Application.app.language('administration.user.form.email.text'),
				name: 'email', 
				allowBlank: false, 
				maxLength: 255
			},{
				fieldLabel: Application.app.language('administration.user.form.password.text'), 
				name: 'password_cli', 
				allowBlank: false,
				maxLength: 64, 
				inputType: 'password',
				xtype:'passwordfield',
				id: 'password_cli',
				showCapsWarning:true,
				vtype: 'password', 
				initialPassField: 'password2_cli'
			},{
				fieldLabel: Application.app.language('administration.user.form.password2.text'), 
				name: 'password2_cli', 
				allowBlank: false,
				maxLength: 64, 
				inputType: 'password',
				xtype:'passwordfield',
				id: 'password2_cli',
				showCapsWarning:true,
				vtype: 'password',
				initialPassField: 'password_cli'
			},{
				name: 'login_usuario',
				id: 'login_usuario_profile_clientes',
				hidden: true 
			},
				this.languages
			],
			buttons: [{
				text: Application.app.language('grid.form.save'),
				iconCls: 'icon-save',
				type:'submit',
	            formBind: true,
				scope: this,
				handler: this._onBtnSalvarClick
			},{
				text: Application.app.language('grid.form.cancel'), 
				iconCls: 'silk-cross', 
				scope: this, 
				handler: function(){
					this.hide();
				}
			}]
		});
		Ext.apply(this, {
			items: this.formPanel
		});
		UserCli.AdministrationUserCliFormEditPerfil.superclass.initComponent.call(this);
	},
	show: function() {
		this.formPanel.getForm().reset();
		UserCli.AdministrationUserCliFormEditPerfil.superclass.show.apply(this, arguments);
		if(this.user !== 0) {
			this.formPanel.findById("password_cli").allowBlank = true;
			this.formPanel.findById("password2_cli").allowBlank = true;
			this.formPanel.getForm().load({
				waitTitle: Application.app.language("auth.alert"),
			        waitMsg: Application.app.language("auth.loading"),
				url: 'index/user/do/get',
				params: {
					id: this.user
				},
				scope: this
			});
		} else {
			this.formPanel.findById("password_cli").allowBlank = false;
			this.formPanel.findById("password2_cli").allowBlank = false;
		}
	},
	onDestroy: function() {
		UserCli.AdministrationUserCliFormEditPerfil.superclass.onDestroy.apply(this, arguments);
		this.formPanel = null;
	},
	_onBtnSalvarClick: function() {
		var form = this.formPanel.getForm();
		var pass = Ext.getCmp('password_cli').getValue();
		
		if(pass != ""){
			form.on('beforeaction', function(form, action) {
				if (action.type == 'submit') {
					Ext.getCmp('password_cli').disable();
					Ext.getCmp('password2_cli').disable();
					action.options.params = action.options.params || {};
					Ext.apply(action.options.params, {
						password_cli: b64_hmac_md5(b64_hmac_md5(Ext.getCmp('password_cli').getValue(), "GB7gj123fLphg7%$g2f"), Ext.getCmp('login_usuario_profile_clientes').getValue()),
						password2_cli: b64_hmac_md5(b64_hmac_md5(Ext.getCmp('password2_cli').getValue(), "GB7gj123fLphg7%$g2f"), Ext.getCmp('login_usuario_profile_clientes').getValue())
					});
				}
			});
			
			form.on('actionfailed', function(form, action) {
				if (action.type == 'submit') {
					Ext.getCmp('password_cli').enable();
					Ext.getCmp('password2_cli').enable();
				}
			});
		}
		
		form.submit({
			waitTitle: Application.app.language("auth.alert"),
	        waitMsg: Application.app.language("auth.loading"),
			url: 'index/user/do/update',
			params: {
				id: this.user,
				status: 1
			},
			scope: this,
			success: function() {
				this.hide();
				this.fireEvent('salvar', this);

				Ext.getCmp('password_cli').enable();
				Ext.getCmp('password2_cli').enable();
			},
			failure: Application.app.failHandler
		});
	}
});

Ext.apply(Ext.form.VTypes, {
	password: function(value, field) {
		var pwd = Ext.getCmp(field.initialPassField);
		this.passwordText = Application.app.language('administration.user.form.password.error');
		return (value == pwd.getValue());
	}
});

