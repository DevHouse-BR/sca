var sm = new Ext.grid.CheckboxSelectionModel();
var AdministrationAccWindowFilter = new Ext.ux.grid.GridFilters({
	local: false,
	menuFilterText: '<?php echo DMG_Translate::_('grid.filter.label'); ?>',
	filters: [{
		type: 'string',
		dataIndex: 'nome_account',
		phpMode: true
	}, {
		type: 'string',
		dataIndex: 'email_account',
		phpMode: true
	}, {
		type: 'list',
		dataIndex: 'fl_ativa',
		options: [
			[0, '<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>'],
			[1, '<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>']
		],
		phpMode: true
	}]
});
var AdministrationAccWindow = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	sm: sm,
	columnLines: true,
	plugins: [AdministrationUserWindowFilter],
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: '<?php echo $this->url(array('controller' => 'account', 'action' => 'listacc'), null, true); ?>',
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
				{name: 'nome_account', type: 'string'},
				{name: 'email_account', type: 'string'},
				{name: 'fl_ativa', type: 'string'}
			]
		});
		var paginator = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30,
			plugins: [AdministrationAccWindowFilter]
		});
		paginator.addSeparator();
		var button = new Ext.Toolbar.Button();
		button.text = '<?php echo DMG_Translate::_('grid.bbar.clearfilter'); ?>';
		button.addListener('click', function(a, b) {
			AdministrationAccWindowFilter.clearFilters();
		});
		paginator.addButton(button);
		Ext.apply(this, {
			viewConfig: {
				emptyText: '<?php echo DMG_Translate::_('grid.empty'); ?>',
				deferEmptyText: false
			},
			bbar: paginator,
			tbar: ['->',
			{
				text: '<?php echo DMG_Translate::_('grid.form.add'); ?>',
				iconCls: 'silk-add',
				scope: this,
				handler: this._onBtnNovoAccClick
			},
			{
				text: '<?php echo DMG_Translate::_('grid.form.delete'); ?>',
				iconCls: 'silk-delete',
				scope: this,
				handler: this._onBtnExcluirSelecionadosClick
			}
			],
			columns: [sm, {
				dataIndex: 'id',
				header: '<?php echo DMG_Translate::_('administration.acc.form.id.text'); ?>',
				width: 40,
				sortable: true
			}, {
				dataIndex: 'nome_account',
				header: '<?php echo DMG_Translate::_('administration.acc.form.name.text'); ?>',
				sortable: true
			}, {
				dataIndex: 'email_account',
				header: '<?php echo DMG_Translate::_('administration.acc.form.email.text'); ?>',
				sortable: true
			}, {
				dataIndex: 'fl_ativa',
				header: '<?php echo DMG_Translate::_('administration.acc.form.ativa.text'); ?>',
				sortable: true,
				width: 40,
				renderer: function (e) {
					if (e == 'true') {
						return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>" title="<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>" /></center>';
					} else {
						return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>" title="<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>" /></center>';
					}
				}
			}]
		});
		AdministrationAccWindow.superclass.initComponent.call(this);
	},
	initEvents: function () {
		AdministrationAccWindow.superclass.initEvents.call(this);
		this.on({
			scope: this,
			rowdblclick: this._onGridRowDblClick
		});
	},
	onDestroy: function () {
		AdministrationAccWindow.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
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
			this.group = new AdministrationAccGroup({
				renderTo: this.body,
				listeners: {
					scope: this
				}
			});
		}
		return this.group;
	},
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
				url: '<?php echo $this->url(array('controller' => 'account', 'action' => 'deleteacc'), null, true); ?>',
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
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		this._newForm();
		this.window.setUser(id);
		this.window.show();
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.setUser(0);
		this.window.show();
	},
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	_newForm: function () {
		if (!this.window) {
			this.window = new AdministrationUserForm({
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
});
Ext.reg('administration-acc', AdministrationAccWindow);
