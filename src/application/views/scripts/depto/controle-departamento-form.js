var ControleDepartamentosForm = Ext.extend(Ext.Window, {
	user: 0,
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	width: 450,
	<?php if(DMG_Acl::canAccess(14)): ?>
		height: 190,
	<?php else: ?>
		height: 160,
	<?php endif; ?>
	title: '<?php echo DMG_Translate::_('administration.user.form.title'); ?>',
	layout: 'fit',
	closeAction: 'hide',
	forceReload: function(id) {
		this.iddpto = id;
                this.comboStore.load({
	                url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'listusers'), null, true); ?>',
                        params: {
          	              id: this.iddpto
                        },
                        scope: this,
                        success: this.el.unmask(),
                        faliure: this.el.unmask(),
		});
	},
	setUser: function(user) {
		this.iddpto = user;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		ControleDepartamentosForm.superclass.constructor.apply(this, arguments);
	},
	initComponent: function() {
		<?php if(DMG_Acl::canAccess(14)): ?>
		this.accountD = new Ext.form.ComboBox({
			store: new Ext.data.JsonStore({
				url: '<?php echo $this->url(array('controller' => 'user', 'action' => 'accountsList'), null, true); ?>',
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
			hiddenName: 'accountD',
			allowBlank: 'false',
			displayField: 'name',
			valueField: 'id',
			mode: 'local',
			triggerAction: 'all',
			emptyText: '<?php echo DMG_Translate::_('administration.user.form.account.helper'); ?>',
			fieldLabel: '<?php echo DMG_Translate::_('administration.user.form.account.text'); ?>'
		});
		<?php endif; ?>
		<?php if(DMG_Acl::canAccess(3)): ?>
		this.comboStore = new Ext.data.JsonStore({
                                url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'listusers'), null, true); ?>',
                                root: 'data',
                                autoLoad: false,
                                autoDestroy: false,
                                remoteSort: true,
                                sortInfo: {
                                        field: 'name',
                                        direction: 'ASC'
                                },
                                fields: [
                                        {name: 'id', type: 'int'},
                                        {name: 'name', type: 'string'}
                                ],
		});
		this.listUser = new Ext.form.ComboBox({
			scope: this,
			store: this.comboStore,
			hiddenName: 'listUser',
			allowBlank: true,
			displayField: 'name',
			valueField: 'id',
			triggerAction: 'all',
			mode: 'local',
			fieldLabel: '<?php echo DMG_Translate::_('departamento.form.gerente.text'); ?>',
			emptyText: '<?php echo DMG_Translate::_('departamento.form.gerente.helper'); ?>',
		});
		<?php endif; ?>
		this.formUPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			border: false,
			autoScroll: true,
			defaultType: 'textfield',
			defaults: {anchor: '-19'},
			items:[
				{fieldLabel: '<?php echo DMG_Translate::_('departamento.columns.nm_departamento.text'); ?>', name: 'name', allowBlank: false, maxLength: 255},
				{fieldLabel: '<?php echo DMG_Translate::_('departamento.columns.cod.text'); ?>', name: 'cod', allowBlank: true, maxLength: 255},
				<?php if(DMG_Acl::canAccess(3)): ?>
				this.listUser,
				<?php endif; ?>
				<?php if(DMG_Acl::canAccess(14)): ?>
				this.accountD,
				<?php endif; ?>
			]
		});
		Ext.apply(this, {
			items: this.formUPanel,
			bbar: [
				'->',
				{text: '<?php echo DMG_Translate::_('grid.form.save'); ?>',iconCls: 'icon-save',scope: this,handler: this._onBtnSalvarClick},
				<?php if (DMG_Acl::canAccess(16)): ?>
				this.btnExcluir = new Ext.Button({text: '<?php echo DMG_Translate::_('grid.form.delete'); ?>', iconCls: 'silk-delete', scope: this, handler: this._onBtnDeleteClick}),
				<?php endif; ?>
				{text: '<?php echo DMG_Translate::_('grid.form.cancel'); ?>', iconCls: 'silk-cross', scope: this, handler: this._onBtnCancelarClick}
			]
		});
		ControleDepartamentosForm.superclass.initComponent.call(this);
	},
	show: function() {
		this.formUPanel.getForm().reset();
		ControleDepartamentosForm.superclass.show.apply(this, arguments);
		if(this.iddpto !== 0) {
			<?php if (DMG_Acl::canAccess(16)): ?>
			this.btnExcluir.show();
			<?php endif; ?>
			this.el.mask('<?php echo DMG_Translate::_('grid.form.loading'); ?>');
			<?php if(DMG_Acl::canAccess(16)): ?>
			if( this.id != 0 )
				this.comboStore.load({
					url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'listusers'), null, true); ?>',
					params: {
						id: this.iddpto
					},
					scope: this,
					success: this.el.unmask(),
					faliure: this.el.unmask(),
				});
			this.el.mask('<?php echo DMG_Translate::_('grid.form.loading'); ?>');
			<?php endif; ?>
                        this.formUPanel.getForm().load({
                                url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'get'), null, true); ?>',
                                params: {
                                        id: this.iddpto
                                },
                                scope: this,
                                success: this.el.unmask(),
				faliure: this.el.unmask(),
                        });
		} else {
			<?php if (DMG_Acl::canAccess(16)): ?>
			this.btnExcluir.hide();
			<?php endif; ?>
		}
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
			//Ext.Msg.alert('<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', '<?php echo DMG_Translate::_('grid.form.alert.invalid'); ?>');
			uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('grid.form.alert.invalid'); ?>'});
			return false;
		}
		this.el.mask('<?php echo DMG_Translate::_('grid.form.saving'); ?>');
		form.submit({
			url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'save'), null, true); ?>',
			params: {
				id: this.iddpto
			},
			scope: this,
			success: function() {
				this.el.unmask();
				this.hide();
				this.fireEvent('salvar', this);
			},
			failure: function () {
				this.el.unmask();
			}
		});
	},
	<?php if (DMG_Acl::canAccess(16)): ?>
	_onBtnDeleteClick: function() {
		uiHelper.confirm('<?php echo DMG_Translate::_('grid.form.confirm.title'); ?>', '<?php echo DMG_Translate::_('grid.form.confirm.delete'); ?>', function(opt) {
			if(opt === 'no') {
				return;
			}
			this.el.mask('<?php echo DMG_Translate::_('grid.form.deleting'); ?>');
			Ext.Ajax.request({
				url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'delete'), null, true); ?>',
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
	<?php endif; ?>
	_onBtnCancelarClick: function() {
		this.hide();
	}
});
Ext.apply(Ext.form.VTypes, {
	password: function(value, field) {
		var pwd = Ext.getCmp(field.initialPassField);
		this.passwordText = '<?php echo DMG_Translate::_('administration.user.form.password.error'); ?>';
		return (value == pwd.getValue());
	}
});
