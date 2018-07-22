Settings.AdministrationSettingsUpForm = Ext.extend(Ext.Window, {
	id:'AdministrationSettingsUpForm',
	id_settings: 0,
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	width: 450,
	height: 130,
	title: Application.app.language('administration.config.form.title'),
	layout: 'fit',
	closeAction: 'hide',
	initComponent: function() {
		this.formSettings = new Ext.form.FormPanel({
			url:'settings/logo',
			bodyStyle: 'padding:10px;',
			fileUpload: true,
			border: false,
			monitorValid:true,
			autoScroll: false,
			defaultType: 'textfield',
			labelWidth: 50,
			defaults: {anchor: '-19'},
			items:[{
				xtype:'fileuploadfield',
				fieldLabel: Application.app.language('administration.setting.form.upload.file'),
				name: 'logo',
				allowBlank:false,
				buttonText: '',
				buttonCfg: {
					iconCls: 'upload-icon'
				}
			},{
				xtype:'panel',
				border:false,
				bodyStyle:'padding-left:56px',
				html:Application.app.language('administration.setting.form.upload.instrucoes')
			}],
			buttons: [{
				text: Application.app.language('grid.form.save'),
				iconCls: 'icon-save',
				formBind:true,
				scope: this,
				handler: function(botao, evento){
					this.formSettings.getForm().submit({
						method:'POST', 
						waitTitle: Application.app.language("auth.alert"),
						waitMsg: Application.app.language("auth.loading"),
						
						success:function(form, action){
							Ext.getCmp('AdministrationSettings').store.reload();
							Ext.getCmp('AdministrationSettingsUpForm').hide();
						},
						failure: Application.app.failHandler
					}); 
				}
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
			items: this.formSettings
		});
		
		Settings.AdministrationSettingsForm.superclass.initComponent.call(this);
	}
});
