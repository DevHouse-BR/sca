Groups.AdministrationGroupForm = Ext.extend(Ext.Window, {
	group: 0,
	modal: true,
	constrain: true,
	maximizable: false,
	iconCls:'silk-group',
	resizable: false,
	width: 450,
	height: 140,
	title: Application.app.language('administration.group.form.title'),
	layout: 'fit',
	closeAction: 'hide',
	setGroup: function(group) {
		this.group = group;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		Groups.AdministrationGroupForm.superclass.constructor.apply(this, arguments);
	},
	initComponent: function() {
				this.on('beforerender',function(janela){
					Application.AccessController.applyPermission({
						defaultAction:'hide',
						items:[{
							objeto:'comboAccountG_AdministrationGroupForm',
							acl:14,
							tipo:'componente'
						},{
							objeto:this,
							acl:14,
							tipo:'execute',
							funcao: function(objeto){
								objeto.height = 110;
							}
						},{
							objeto:'btnExcluir_AdministrationGroupForm',
							acl:10,
							tipo:'componente'
						}]
					});
				});
		

                this.accountG = new Ext.form.ComboBox({
                		id:'comboAccountG_AdministrationGroupForm',
                        store: new Ext.data.JsonStore({
                                url: 'user/accountsList',
                                root: 'data',
                                autoLoad: true,
                                remoteSort: true,
                                sortInfo: {
                                        field: 'name',
                                        direction: 'ASC'
                                },
                                fields: [
                                        {name: 'id', type: 'int'},
                                        {name: 'name', type: 'string'}
                                ]
                        }),
                        hiddenName: 'accountG',
                        allowBlank: 'false',
                        displayField: 'name',
                        valueField: 'id',
                        mode: 'local',
                        triggerAction: 'all',
                        emptyText: Application.app.language('administration.user.form.account.helper'),
                        fieldLabel: Application.app.language('administration.user.form.account.text')
                });

		this.formPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			border: false,
			autoScroll: true,
			monitorValid:true,
			defaultType: 'textfield',
			defaults: {anchor: '-19'},
			items:[{
				fieldLabel: Application.app.language('administration.group.form.name.text'), 
				name: 'name',
				id:'fieldName_AdministrationGroupForm',
				allowBlank: false, 
				maxLength: 255
			},
				this.accountG
			],
			buttons: [{
				text: Application.app.language('grid.form.save'),
				iconCls: 'icon-save',
				formBind:true,
				scope: this,
				handler: this._onBtnSalvarClick
			},{
				id:'btnExcluir_AdministrationGroupForm',
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
		
		Groups.AdministrationGroupForm.superclass.initComponent.call(this);
	},
	show: function() {
		this.formPanel.getForm().reset();
		
		if(this.group !== 0) {			
			this.formPanel.getForm().load({
				waitTitle: Application.app.language("auth.alert"),
			    waitMsg: Application.app.language("auth.loading"),
				url: 'group/get',
				params: {
					id: this.group
				},
				scope: this
			});
			if(Application.AccessController.hasPermission(10)){
				Ext.getCmp('btnExcluir_AdministrationGroupForm').show();
			}
		} else {
			Ext.getCmp('btnExcluir_AdministrationGroupForm').hide();
		}
		
		Groups.AdministrationGroupForm.superclass.show.apply(this, arguments);
		
		Ext.getCmp('fieldName_AdministrationGroupForm').focus(false, 500);
	},
	onDestroy: function() {
		Groups.AdministrationGroupForm.superclass.onDestroy.apply(this, arguments);
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
			url: 'group/save',
			params: {
				id: this.group
			},
			scope:this,
			success: function() {
				this.hide();
				this.fireEvent('salvar', this);
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
				url: 'group/delete',
				params: {
					id: this.group
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
		this.hide();
	}
});
