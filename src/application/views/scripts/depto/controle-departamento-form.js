Ext.namespace('departamentos');
departamentos.ControleDepartamentosForm = Ext.extend(Ext.Window, {
	user: 0,
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	width: 450,
	height: 160,
	title: Application.app.language('menu.controle.departamentos'),
	layout: 'fit',
	closeAction: 'hide',
	forceReload: function(id) {
		this.iddpto = id;
                this.comboStore.load({
			waitTitle: Application.app.language("auth.alert"),
			waitMsg: Application.app.language("auth.loading"),
	                url: 'departamentos/listusers',
                        params: {
          	              id: this.iddpto
                        },
                        scope: this,
                        success: this.el.unmask(),
                        faliure: this.el.unmask()
		});
	},
	setUser: function(user) {
		this.iddpto = user;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		departamentos.ControleDepartamentosForm.superclass.constructor.apply(this, arguments);
	},

	listeners:{
		beforerender:function(grid){
			Application.AccessController.applyPermission({
				defaultAction:'hide',
				items:[{
					objeto: 'comboBoxListUser_ControleDepartamentosForm',
                                        acl: 3,
                                        tipo: 'componente'
				}]
			});
		}
	},
	initComponent: function() {
	this.comboStore = new Ext.data.JsonStore({
            url: 'departamentos/listusers',
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
		this.comboStore.addListener('load', function (a, b, c) {
	                if(this.iddpto){
        	                Ext.Ajax.request({
                	                scope: this,
                        	        url: 'user/gerentesel',
                                	params: {
	                                        'id': this.iddpto
        	                        },
                	                success: function (a, b) {
                        	                try {
                                	                var c = Ext.decode(a.responseText);
                                        	} catch (e) {
							return;
						};
	                                        if (c.failure == true) {
        	                                        this.listUser.setValue("");
                	                                return;
                        	                }
						if (c.data == 0)
							this.listUser.setValue("");
						else
	                                	        this.listUser.setValue(c.data);
	                                }
        	                });
	                }
		}, this);
		this.listUser = new Ext.form.ComboBox({
			id: 'comboBoxListUser_ControleDepartamentosForm',
			scope: this,
			store: this.comboStore,
			hiddenName: 'listUser',
			allowBlank: true,
			displayField: 'name',
			valueField: 'id',
			triggerAction: 'all',
			mode: 'local',
			fieldLabel: Application.app.language('departamento.form.gerente.text'),
			emptyText: Application.app.language('departamento.form.gerente.helper')
		});
		this.formUPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			border: false,
			autoScroll: true,
			defaultType: 'textfield',
			defaults: {anchor: '-19'},
			items:[{
				fieldLabel: Application.app.language('departamento.columns.nm_departamento.text'),
				name: 'name',
				id:'fieldName_ControleDepartamentosForm',
				allowBlank: false,
				maxLength: 255
			},{
				fieldLabel: Application.app.language('departamento.columns.cod.text'),
				name: 'cod', 
				allowBlank: true, 
				maxLength: 255
			},
				this.listUser
//				this.accountD
			]
		});
		Ext.apply(this, {
			items: this.formUPanel,
			bbar: [
				'->',
				{text: Application.app.language('grid.form.save'),iconCls: 'icon-save',scope: this,handler: this._onBtnSalvarClick},
				this.btnExcluir = new Ext.Button({text: Application.app.language('grid.form.delete'), iconCls: 'silk-delete', scope: this, handler: this._onBtnDeleteClick}),
				{text: Application.app.language('grid.form.cancel'), iconCls: 'silk-cross', scope: this, handler: this._onBtnCancelarClick}
			]
		});
		departamentos.ControleDepartamentosForm.superclass.initComponent.call(this);
	},
	MaskRequests: 0,
	_doMask: function(value) {
		this.MaskRequests = this.MaskRequests + value;

		if(this.MaskRequests == 0){
			this.el.unmask();
		}
	},
	show: function() {
		this.formUPanel.getForm().reset();
		departamentos.ControleDepartamentosForm.superclass.show.apply(this, arguments);
		if(this.iddpto !== 0) {
			this.btnExcluir.show();
			this.el.mask(Application.app.language('grid.form.loading'));
			this._doMask(3); //seta para esperar por 3
			if( this.id != 0 )
				this.comboStore.load({
					waitTitle: Application.app.language("auth.alert"),
					waitMsg: Application.app.language("auth.loading"),
					fail: Application.app.faiHandler,

					url: 'departamentos/listusers',
					params: {
						id: this.iddpto
					},
					scope: this,
					success: this._doMask(-1),
					faliure: function(obj1, obj2){
						this._doMask(-1);
						Application.app.failHandler(obj1, obj2);
					}
				});
			this.el.mask(Application.app.language('grid.form.loading'));
                        this.formUPanel.getForm().load({
				waitTitle: Application.app.language("auth.alert"),
				waitMsg: Application.app.language("auth.loading"),
                                url: 'departamentos/get',
                                params: {
                                        id: this.iddpto
                                },
                                scope: this,
                                success: this._doMask(-1),
				faliure: this._doMask(-1)
                        });
		} else {
			this.btnExcluir.hide();
		}
		Ext.getCmp('fieldName_ControleDepartamentosForm').focus(false, 500);
	},
	onDestroy: function() {
//		DepartamentosForm.superclass.onDestroy.apply(this, arguments);
		this.formUPanel = null;
	},
	_onFormLoad: function(form, request) {
		this.el.unmask();
	},
	_onBtnSalvarClick: function() {
		var form = this.formUPanel.getForm();
		if(!form.isValid()) {
			Application.app.showMessageBox({title: Application.app.language('grid.form.alert.title'), msg: Application.app.language('grid.form.alert.invalid')});
			return false;
		}
		form.submit({
			waitTitle: Application.app.language("auth.alert"),
		    waitMsg: Application.app.language("auth.loading"),
			url: 'departamentos/save',
			params: {
				id: this.iddpto
			},
			scope: this,
			success: function() {
				this.hide();
				this.fireEvent('salvar', this);
			},
			failure: function (obj1, obj2) {
				Application.app.failHandler(obj1, obj2);
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
				url: 'departamentos/delete',
				params: {
					id: this.iddpto
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

