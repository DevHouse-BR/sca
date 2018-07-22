var smGridPrincipal = new Ext.grid.CheckboxSelectionModel();
var ControleClientesWindowFilter = new Ext.ux.grid.GridFilters({
	local: false,
	menuFilterText: '<?php echo DMG_Translate::_('grid.filter.label'); ?>',
	filters: [{
			type: 'string',
			dataIndex: 'cod_cliente',
			phpMode: true
		}, {
                        type: 'string',
                        dataIndex: 'nome_cliente',
                        phpMode: true
		}, {
                        type: 'boolean',
                        dataIndex: 'fl_acesso_portal',
	                options: [
        	                [0, '<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>'],
                	        [1, '<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>']
	                ],
                        phpMode: true
		}, {
                        type: 'string',
                        dataIndex: 'responsavel',
                        phpMode: true
		<?php if (DMG_Acl::canAccess(14)): ?>
		}, {
			type: 'string',
			dataIndex: 'nome_account',
			phpMode: true
		<?php endif; ?>
	}]
});
var ControleClientesWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: smGridPrincipal,
	columnLines: true,
	plugins: [ControleClientesWindowFilter],
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'list'), null, true); ?>',
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
				{name: 'nome_cliente', type: 'string'},
				{name: 'cod_cliente', type: 'string'},
				{name: 'responsavel', type: 'string'},
				{name: 'fl_acesso_portal', type: 'boolean'},
				<?php if (DMG_Acl::canAccess(14)): ?>
				{name: 'nome_account', type: 'string'}
				<?php endif; ?>
			]
		});
		var paginator = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30,
			plugins: [ControleClientesWindowFilter]
		});
		paginator.addSeparator();
		var button = new Ext.Toolbar.Button();
		button.text = '<?php echo DMG_Translate::_('grid.bbar.clearfilter'); ?>';
		button.addListener('click', function(a, b) {
			ControleClientesWindowFilter.clearFilters();
		});
		paginator.addButton(button);
		Ext.apply(this, {
			viewConfig: {
				emptyText: '<?php echo DMG_Translate::_('grid.empty'); ?>',
				deferEmptyText: false
			},
			bbar: paginator,
			<?php if (DMG_Acl::canAccess(18) or DMG_Acl::canAccess(19)): ?>
			tbar: ['->',
			<?php if (DMG_Acl::canAccess(18)): ?>
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
			<?php endif; ?>
			<?php if (DMG_Acl::canAccess(19)): ?>
			{
                                text: '<?php echo DMG_Translate::_('controle.cliente.addUser.text'); ?>',
                                iconCls: 'silk-group',
                                scope: this,
                                handler: this._onBtnAddUserClick
			},
			<?php endif; ?>
			],
			<?php endif; ?>
			columns: [smGridPrincipal, {
				dataIndex: 'id',
				header: '<?php echo DMG_Translate::_('controle.clientes.id.text'); ?>',
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nome_cliente',
				header: '<?php echo DMG_Translate::_('controle.clientes.nome.text'); ?>',
				sortable: true
                        }, {
                                dataIndex: 'cod_cliente',
                                header: '<?php echo DMG_Translate::_('controle.clientes.cod.text'); ?>',
                                sortable: true
                        }, {
                                dataIndex: 'responsavel',
                                header: '<?php echo DMG_Translate::_('controle.clientes.responsavel.text'); ?>',
                                sortable: true
                        }, {
                                dataIndex: 'fl_acesso_portal',
                                header: '<?php echo DMG_Translate::_('controle.clientes.portal.text'); ?>',
                                sortable: true,
                                renderer: function (e) {
                                        if(e == true) {
                                                return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>" title="<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>" /></center>';
                                        } else {
                                                return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>" title="<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>" /></center>';
                                        }
                                }
			<?php if (DMG_Acl::canAccess(14)): ?>
			}, {
				dataIndex: 'nome_account',
				header: '<?php echo DMG_Translate::_('administration.group.account.text'); ?>',
				sortable: true
			<?php endif; ?>
			}]
		});
		ControleClientesWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		ControleClientesWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			<?php if (DMG_Acl::canAccess(18)): ?>
			rowdblclick: this._onGridRowDblClick
			<?php endif; ?>
		});
	},
	onDestroy: function () {
		ControleClientesWindow.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	<?php if (DMG_Acl::canAccess(18)): ?>
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.setGroup(0);
		this.window.show();
	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(19)): ?>
	_onBtnAddUserClick: function () {
		var arrSelecionados = this.getSelectionModel().getSelections();

		if(arrSelecionados.length === 0){
			uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('grid.form.alert.select'); ?>'});
			return false;
		}
		
		if(arrSelecionados.length > 1){
			uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('grid.form.alert.selectless'); ?>'});
			return false;
		}
		/////////////////////////////////Comesa Aqui
		var idGet = arrSelecionados[0].get('id');
		this._newAddUserWindow();
		this.windowAddUser._setClienteId(idGet);
		this.windowAddUser.show();
		////////////////////////////////Termina Aqui
	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(18)): ?>
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
				url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'delete'), null, true); ?>',
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
	<?php if (DMG_Acl::canAccess(18)): ?>
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(18)): ?>
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		this._newForm();
		this.window.setGroup(id);
		this.window.show();
	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(19)): ?>
	_newAddUserWindow: function () {
                        if (!this.windowAddUser) {
                                this.windowAddUser = new ControleClienteUserForm({ });     
                        }                       
                                        
                return this.windowAddUser;     
 	},
	<?php endif; ?>
	<?php if (DMG_Acl::canAccess(18)): ?>
	_newForm: function () {
		if (!this.window) {
			this.window = new ControleClientesForm({
				renderTo: this.body,
				listeners: {
					scope: this,
					salvar: this._onCadastroUsuarioSalvarExcluir,
					<?php if (DMG_Acl::canAccess(10)): ?>
					excluir: this._onCadastroUsuarioSalvarExcluir
					<?php endif; ?>
				}
			});
		}
		return this.window;
	}
	<?php endif; ?>
});
Ext.reg('controle-clientes', ControleClientesWindow);
