var AdministrationSettingsFilter = new Ext.ux.grid.GridFilters({
	local: false,
	filters: [{
		type: 'string',
		dataIndex: 'name',
		phpMode: true
	}]
});
var AdministrationSettings = Ext.extend(Ext.grid.GridPanel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	columnLines: true,
	plugins: [AdministrationSettingsFilter],
	initComponent: function () {
		this.store = new Ext.data.JsonStore({
			url: '<?php echo $this->url(array('controller' => 'settings', 'action' => 'list'), null, true); ?>',
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
				{name: 'nome', type: 'string'},
				{name: 'desc', type: 'string'},
				{name: 'parm', type: 'string'},
			]
		});
		var paginator = new Ext.PagingToolbar({
			store: this.store,
			pageSize: 30,
			plugins: [AdministrationSettingsFilter]
		});
		paginator.addSeparator();
		var button = new Ext.Toolbar.Button();
		button.text = '<?php echo DMG_Translate::_('grid.bbar.clearfilter'); ?>';
		button.addListener('click', function(a, b) {
			AdministrationSettingsFilter.clearFilters();
		});
		paginator.addButton(button);
		Ext.apply(this, {
			viewConfig: {
				emptyText: '<?php echo DMG_Translate::_('grid.empty'); ?>',
				deferEmptyText: false
			},
			bbar: paginator,
			columns: [{
				dataIndex: 'nome',
				header: '<?php echo DMG_Translate::_('administration.setting.grid.name.text'); ?>',
				width: 170,
				sortable: true
			}, {
				dataIndex: 'parm',
				header: '<?php echo DMG_Translate::_('administration.setting.grid.value.text'); ?>',
				width: 100,
				sortable: true
			}, {
				dataIndex: 'desc',
				header: '<?php echo DMG_Translate::_('administration.setting.grid.help.text'); ?>',
				width: 300,
				sortable: true
			}]
		});
		AdministrationSettings.superclass.initComponent.call(this);
	},
	initEvents: function () {
		AdministrationSettings.superclass.initEvents.call(this);
		this.on({
			scope: this,
<?php if (DMG_Acl::canAccess(2)): ?>
			rowdblclick: this._onGridRowDblClick
<?php endif; ?>
		});
	},
	onDestroy: function () {
		AdministrationSettings.superclass.onDestroy.apply(this, arguments);
		Ext.destroy(this.window);
		this.window = null;
	},
	_onBtnNovoUsuarioClick: function () {
		this._newForm();
		this.window.setid(0);
		this.window.show();
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
				url: '<?php echo $this->url(array('controller' => 'settings', 'action' => 'delete'), null, true); ?>',
				params: {
					'id[]': id
				},
				scope: this,
				success: function () {
					this.el.unmask();
					this.store.reload();
				}
			});
		},
		this);
	},
	<?php if (DMG_Acl::canAccess(2)): ?>
	_onGridRowDblClick: function (grid, rowIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var id = record.get('id');
		this._newForm();
		this.window.setid(id);
		this.window.show();
	},
	_onCadastroUsuarioSalvarExcluir: function () {
		this.store.reload();
	},
	_newForm: function () {
		if (!this.window) {
			this.window = new AdministrationSettingsForm({
				renderTo: this.body,
				listeners: {
					scope: this,
					salvar: this._onCadastroUsuarioSalvarExcluir
				}
			});
		}
		return this.window;
	}
<?php endif; ?>
});
Ext.reg('administration-settings', AdministrationSettings);
