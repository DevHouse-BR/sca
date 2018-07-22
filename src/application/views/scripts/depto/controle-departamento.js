var sm = new Ext.grid.CheckboxSelectionModel();
var ControleDepartamentosWindowFilter = new Ext.ux.grid.GridFilters({
	local: false,
	menuFilterText: '<?php echo DMG_Translate::_('grid.filter.label'); ?>',
	filters: [{
		type: 'string',
		dataIndex: 'nm_dpto',
		phpMode: true
	}, {
		type: 'int',
		dataIndex: 'cod_dpto',
		phpMode: true
	}, {
		type: 'string',
		dataIndex: 'nm_gerente',
		phpMode: true
	<?php if (DMG_Acl::canAccess(14)): ?>
	}, {
		type: 'string',
		dataIndex: 'nm_account',
		phpmode: true
	<?php endif; ?>
	}]
});
var ControleDepartamentosWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: sm,
	columnLines: true,
	plugins: [ControleDepartamentosWindowFilter],
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'list'), null, true); ?>',
			root: 'data',
			idProperty: 'id',
			totalProperty: 'total',
			autoLoad: true,
			autoDestroy: true,
			remoteSort: true,
			sortInfo: {
				field: 'id',
				direction: 'ASC'
			},
			baseParams: {
				limit: 30
			},
			fields: [
				{name: 'id', type: 'int'},
				{name: 'nm_dpto', type: 'string'},
				{name: 'cod_dpto', type: 'int'},
				{name: 'nm_gerente', type: 'string'},
				<?php if (DMG_Acl::canAccess(14)): ?>
				{name: 'nm_account', type: 'string'},
				<?php endif; ?>
			]
		});
		var paginator = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30,
			plugins: [ControleDepartamentosWindowFilter]
		});
		paginator.addSeparator();
		var button = new Ext.Toolbar.Button();
		button.text = '<?php echo DMG_Translate::_('grid.bbar.clearfilter'); ?>';
		button.addListener('click', function(a, b) {
			ControleDepartamentosWindowFilter.clearFilters();
		});
		paginator.addButton(button);
		Ext.apply(this, {
			viewConfig: {
				emptyText: '<?php echo DMG_Translate::_('grid.empty'); ?>',
				deferEmptyText: false
			},
                        bbar: paginator,
<?php if (DMG_Acl::canAccess(16)): ?>
                        tbar: ['->',
                        {
                                text: '<?php echo DMG_Translate::_('grid.form.add'); ?>',
                                iconCls: 'silk-add',
                                scope: this,
                                handler: this._onBtnNovoUsuarioClick
                        },
                        {
                                text: '<?php echo DMG_Translate::_('grid.form.delete'); ?>',
                                iconCls: 'silk-delete',
                                scope: this,
                                handler: this._onBtnExcluirSelecionadosClick
                        },
                        ],
<?php endif; ?>
			columns: [sm, {
				dataIndex: 'id',
				header: '<?php echo DMG_Translate::_('departamento.columns.id.text'); ?>',
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nm_dpto',
				header: '<?php echo DMG_Translate::_('departamento.columns.nm_departamento.text'); ?>',
				sortable: true
			}, {
				dataIndex: 'cod_dpto',
				header: '<?php echo DMG_Translate::_('departamento.columns.cod.text'); ?>',
				sortable: true
			}, {
				dataIndex: 'nm_gerente',
				header: '<?php echo DMG_Translate::_('departamento.columns.nm_gerente.text'); ?>',
				sortable: true
			<?php if (DMG_Acl::canAccess(14)): ?>
			}, {
				dataIndex: 'nm_account',
				header: '<?php echo DMG_Translate::_('administration.user.form.account.text'); ?>',
				sortable: false,
				width: 120
			<?php endif; ?>	
			}]
		});
		ControleDepartamentosWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		ControleDepartamentosWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			<?php if (DMG_Acl::canAccess(16)): ?>
			rowdblclick: this._onGridRowDblClick
			<?php endif; ?>
		});
	},
	onDestroy: function () {
		ControleDepartamentosWindow.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	<?php if (DMG_Acl::canAccess(16)): ?>
	_onBntGroupClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();
		if (arrSelecionados.length > 1) {
			//Ext.Msg.alert('<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', '<?php echo DMG_Translate::_('administration.user.group.manyerror'); ?>');
			uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('administration.user.group.manyerror'); ?>'});
			return false;
		}
		if (arrSelecionados.length === 0) {
			//Ext.Msg.alert('<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', '<?php echo DMG_Translate::_('administration.user.group.oneerror'); ?>');
			uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('administration.user.group.oneerror'); ?>'});
			return false;
		}
		var id = arrSelecionados[0].get('id');
		this.newGroup();
		this.group.setUser(id);
		this.group.show();
		return true;
	},
	newGroup: function () {
		if (!this.group) {
			this.group = new ControleDepartamentosGroup({
				renderTo: this.body,
				listeners: {
					scope: this
				}
			});
		}
		return this.group;
	},
	<?php endif; ?>
        <?php if (DMG_Acl::canAccess(16)): ?>
        _onBtnExcluirSelecionadosClick: function () {
                var arrSelecionados = this.getSelectionModel().getSelections();
                if (arrSelecionados.length === 0) {
                        //Ext.Msg.alert('<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', '<?php echo DMG_Translate::_('grid.form.alert.select'); ?>');
                        uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('grid.form.alert.select'); ?>'});
                        return false;
                }
                uiHelper.confirm('<?php echo DMG_Translate::_('grid.form.confirm.title'); ?>', '<?php echo DMG_Translate::_('grid.form.confirm.delete'); ?>', function (opt) {
                        if (opt === 'no') {
                                return;
                        }
                        var id = [];
                        for (var i = 0; i < arrSelecionados.length; i++) {
                                id.push(arrSelecionados[i].get('id'));
                        }
                        this.el.mask('<?php echo DMG_Translate::_('grid.form.deleting'); ?>');
                        Ext.Ajax.request({
                                url: '<?php echo $this->url(array('controller' => 'departamentos', 'action' => 'delete'), null, true); ?>',
                                params: {
                                        'id[]': id
                                },
                                scope: this,
                                success: function (a, b) {
                                        try {
                                                var c = Ext.decode(a.responseText);
                                        } catch (e) {};
                                        if (c.failure == true) {
                                                //Ext.Msg.alert('<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', c.message);
                                                uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: c.message});
                                        }
                                        this.el.unmask();
                                        this.store.reload();
                                },
                        });
                },
                this);
        },
        <?php endif; ?>
	<?php if (DMG_Acl::canAccess(16)): ?>
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		this._newForm();
		this.window.setUser(id);
		this.window.show();
	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(16)): ?>
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.forceReload(0);
		this.window.show();
	},
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(16)): ?>
	_newForm: function () {
		if (!this.window) {
			this.window = new ControleDepartamentosForm({
				renderTo: this.body,
				listeners: {
					scope: this,
					salvar: this._onCadastroUsuarioSalvarExcluir,
					excluir: this._onCadastroUsuarioSalvarExcluir
				}
			});
		}
		return this.window;
	}
	<?php endif; ?>
});
Ext.reg('controle-departamentos', ControleDepartamentosWindow);
