var ControleClientesForm = Ext.extend(Ext.Window, {
	group: 0,
	modal: true,
	constrain: true,
	maximizable: false,
	resizable: false,
	width: 450,
	<?php if(DMG_Acl::canAccess(14)): ?>
	height: 220,
	<?php else: ?>
	height: 190,
	<?php endif; ?>
	title: '<?php echo DMG_Translate::_('controle.cliente.form.title'); ?>',
	layout: 'fit',
	closeAction: 'hide',
	setGroup: function(group) {
		this.group = group;
	},
	constructor: function() {
		this.addEvents({salvar: true, excluir: true});
		ControleClientesForm.superclass.constructor.apply(this, arguments);
	},
	initComponent: function() {
                <?php if(DMG_Acl::canAccess(14)): ?>
                this.accountX = new Ext.form.ComboBox({
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
                        hiddenName: 'accountX',
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
                this.usersStore = new Ext.data.JsonStore({
                                url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'listusers'), null, true); ?>',
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
                this.listUserResponsavel = new Ext.form.ComboBox({
                        scope: this,
                        store: this.usersStore,
                        hiddenName: 'responsavel',
                        allowBlank: true,
                        displayField: 'name',
                        valueField: 'id',
                        triggerAction: 'all',
                        mode: 'local',
                        fieldLabel: '<?php echo DMG_Translate::_('controle.clientes.form.responsavel.text'); ?>',
                        emptyText: '<?php echo DMG_Translate::_('controle.clientes.form.resposnsavel.helper'); ?>',
                });
		<?php endif; ?>
		this.formPanel = new Ext.form.FormPanel({
			bodyStyle: 'padding:10px;',
			border: false,
			autoScroll: true,
			defaultType: 'textfield',
			defaults: {anchor: '-19'},
			items:[
				{fieldLabel: '<?php echo DMG_Translate::_('controle.clientes.nome.text'); ?>', name: 'nome_cliente', allowBlank: false, maxLength: 255},
				{fieldLabel: '<?php echo DMG_Translate::_('controle.clientes.cod.text'); ?>', name: 'cod_cliente', allowBlank: false, maxLength: 255},
				<?php if(DMG_Acl::canAccess(3)): ?>
				this.listUserResponsavel,
				<?php endif; ?>
				{fieldLabel: '<?php echo DMG_Translate::_('controle.clientes.form.portal.text'); ?>', xtype: 'radiogroup', name: 'portal', items: [
					{boxLabel: '<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>', name: 'portal', inputValue: '1'},
					{boxLabel: '<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>', name: 'portal', inputValue: '0'}
				]},
				<?php if(DMG_Acl::canAccess(14)): ?>
				this.accountG,
				<?php endif; ?>
			]
		});
		Ext.apply(this, {
			items: this.formPanel,
			bbar: [
				'->',
				{text: '<?php echo DMG_Translate::_('grid.form.save'); ?>',iconCls: 'icon-save',scope: this,handler: this._onBtnSalvarClick},
				<?php if (DMG_Acl::canAccess(10)): ?>
				this.btnExcluir = new Ext.Button({text: '<?php echo DMG_Translate::_('grid.form.delete'); ?>', iconCls: 'silk-delete', scope: this, handler: this._onBtnDeleteClick}),
				<?php endif; ?>
				{text: '<?php echo DMG_Translate::_('grid.form.cancel'); ?>', iconCls: 'silk-cross', scope: this, handler: this._onBtnCancelarClick}
			]
		});
		ControleClientesForm.superclass.initComponent.call(this);
	},
	show: function() {
		this.formPanel.getForm().reset();
		ControleClientesForm.superclass.show.apply(this, arguments);
                this.usersStore.load({
	                url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'listusers'), null, true); ?>',
                        scope: this,
                        success: this._onFormLoad
                });
		if(this.group !== 0) {
			<?php if (DMG_acl::canAccess(18)): ?>
			this.btnExcluir.show();
			<?php endif; ?>
			this.el.mask('<?php echo DMG_Translate::_('grid.form.loading'); ?>');
			this.formPanel.getForm().load({
				url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'get'), null, true); ?>',
				params: {
					id: this.group
				},
				scope: this,
				success: this._onFormLoad
			});
		} else {
			<?php if (DMG_acl::canAccess(10)): ?>
			this.btnExcluir.hide();
			<?php endif; ?>
		}
	},
	onDestroy: function() {
		ControleClientesForm.superclass.onDestroy.apply(this, arguments);
		this.formPanel = null;
	},
	_onFormLoad: function(form, request) {
		this.el.unmask();
	},
	_onBtnSalvarClick: function() {
		var form = this.formPanel.getForm();
		if(!form.isValid()) {
			//Ext.Msg.alert('<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', '<?php echo DMG_Translate::_('grid.form.alert.invalid'); ?>');
			uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('grid.form.alert.invalid'); ?>'});
			return false;
		}
		this.el.mask('<?php echo DMG_Translate::_('grid.form.saving'); ?>');
		form.submit({
			url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'save'), null, true); ?>',
			params: {
				id: this.group
			},
			scope:this,
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
	<?php if (DMG_acl::canAccess(10)): ?>
	_onBtnDeleteClick: function() {
		uiHelper.confirm('<?php echo DMG_Translate::_('grid.form.confirm.title'); ?>', '<?php echo DMG_Translate::_('grid.form.confirm.delete'); ?>', function(opt) {
			if(opt === 'no') {
				return;
			}
			this.el.mask('<?php echo DMG_Translate::_('grid.form.deleting'); ?>');
			Ext.Ajax.request({
				url: '<?php echo $this->url(array('controller' => 'group', 'action' => 'delete'), null, true); ?>',
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
	<?php endif; ?>
	_onBtnCancelarClick: function() {
		this.hide();
	}
});
