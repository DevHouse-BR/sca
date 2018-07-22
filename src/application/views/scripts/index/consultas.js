var Consultas = Ext.extend(Ext.Panel, {
	border: false,
	stripeRows: true,
	loadMask: true,
	columnLines: true,
	initComponent: function () {
		this.formConsulta = new Ext.form.FormPanel({
			layout: 'form',
			id: 'formConsultas',
			border: false,
			bodyStyle: 'padding: 5px',
			items: [{border: false, html:'<?php echo DMG_Translate::_('consultas.select'); ?>'}],
		});
		this.treeConsulta = new Ext.tree.TreePanel({
			name: 'tree8',
			id: 'tree8',
			autoWidth: true,
			autoHeight: true,
			border: false,
			useArrows: true,
			enableDD: true,
			overflow: 'scroll',
			root: new Ext.tree.AsyncTreeNode({
				text: '<?php echo DMG_Translate::_('consultas'); ?>',
				iconCls: 'folder',
				draggable: false,
				id: '0',
				children: [] // <?php echo Khronos_Consultas::getJsonTreeList(); ?>
			})
		});
		this.panelConsulta = new Ext.Panel({
			border: false,
			items: [this.formConsulta]
		});
		Ext.apply(this, {
			bodyStyle: 'padding: 5px',
			width: '100%',
			height: '100%',
			layout: 'column',
			items: [{
				title: '<?php echo DMG_Translate::_('consultas.disponible'); ?>',
				width: '200px',
				autoHeight: true,
				items: [this.treeConsulta]
			}, {
				width: '5px',
				autoHeight: true,
				html: '&nbsp;',
				border: false,
			}, {
				title: '<?php echo DMG_Translate::_('consultas.filtering'); ?>',
				columnWidth: 1,
				autoHeight: true,
				items: [this.panelConsulta]
			}]
		});
		Consultas.superclass.initComponent.call(this);
	},
	initEvents: function () {
		this.treeConsulta.on('click', function(node) {
			if (node.isLeaf()) {
				this.el.mask('<?php echo DMG_Translate::_('i18n.loading'); ?>');
				var id = node.id;
				var con1 = new Ext.data.Connection();
				con1.request({
					url: '<?php echo $this->url(array('controller' => 'consultas', 'action' => 'get-filter')); ?>',
					params: {
						id: id
					},
					scope: this,
					callback: function (a, b, c) {
						var data;
						try {
							data = Ext.decode(c.responseText);
						}catch(e){};
						if (data.success) {
							if (data.data.length) {
								try {
									this.formConsulta.removeAll();
								} catch (e) {}
							}
							this.consultaName = data.name;
							this.formConsulta.add(new Ext.Panel({
								html: '<b>' + data.titulo + '</b>',
								border: false
							}));
							this.formConsulta.add(new Ext.Panel({
								html: data.descricao,
								border: false,
								bodyStyle: 'margin-bottom: 10px',
							}));
							this.formConsulta.add(new Ext.Panel({
								html: '<b><?php echo DMG_Translate::_('consultas.filters'); ?></b>',
								bodyStyle: 'margin-bottom: 5px',
								border: false,
							}));
							for (var i = 0; i < data.data.length; i++) {
								switch (data.data[i].tipo) {
									case 'jogo':
										this.formConsulta.add(new Ext.Panel({
											layout: 'column',
											border: false,
											items: [{
												width: 100,
												border: false,
												items: [{xtype: 'label', text: data.data[i].nome}]
											}, {
												width: 20,
												border: false,
												autoHeight: true,
												bodyStyle: 'padding-top: 4px; padding-left: 2px;',
												items: [{
													border: false,
													xtype: 'checkbox',
													checked: true,
													listeners: {
														check: function (a, b) {
															var box = this.ownerCt.ownerCt.items.items[2].items.items[0];
															if (b) {
																box.disable();
																box.selectAll();
															} else {
																box.enable();
																box.deselectAll();
															}
														}
													}
												}]
											},{
												border: false,
												autoHeight: true,
												items: [{
													border: false,
													xtype: 'lovcombo',
													name: data.data[i].campo,
													value: '',
													disabled: true,
													fieldLabel: data.data[i].nome,
													store: new Ext.data.JsonStore({
														autoLoad:true,
														root:'data',
														fields: ['id', 'nome'],
														id: 'id',
														url: '<?php echo $this->url(array('controller' => 'consultas', 'action' => 'get-combo', 'data' => 'jogo'), null, true); ?>?consulta=' + this.consultaName,
													}),
													mode: 'local',
													valueField: 'id',
													displayField: 'nome'
												}]
											}]
										}));
									break;
									case 'empresa':
										this.formConsulta.add(new Ext.Panel({
											layout: 'column',
											border: false,
											items: [{
												width: 100,
												border: false,
												items: [{xtype: 'label', text: data.data[i].nome}]
											}, {
												width: 20,
												border: false,
												autoHeight: true,
												bodyStyle: 'padding-top: 4px; padding-left: 2px;',
												items: [{
													border: false,
													xtype: 'checkbox',
													checked: true,
													listeners: {
														check: function (a, b) {
															var box = this.ownerCt.ownerCt.items.items[2].items.items[0];
															if (b) {
																box.disable();
																box.selectAll();
															} else {
																box.enable();
																box.deselectAll();
															}
														}
													}
												}]
											},{
												border: false,
												autoHeight: true,
												items: [{
													border: false,
													xtype: 'lovcombo',
													name: data.data[i].campo,
													value: '',
													disabled: true,
													fieldLabel: data.data[i].nome,
													store: new Ext.data.JsonStore({
														autoLoad:true,
														root:'data',
														fields: ['id', 'nome'],
														id: 'id',
														url: '<?php echo $this->url(array('controller' => 'consultas', 'action' => 'get-combo', 'data' => 'empresa'), null, true); ?>?consulta=' + this.consultaName,
													}),
													mode: 'local',
													valueField: 'id',
													displayField: 'nome'
												}]
											}]
										}));
									break;
									case 'filial':
										this.formConsulta.add(new Ext.Panel({
											layout: 'column',
											border: false,
											items: [{
												width: 100,
												border: false,
												items: [{xtype: 'label', text: data.data[i].nome}]
											}, {
												width: 20,
												border: false,
												autoHeight: true,
												bodyStyle: 'padding-top: 4px; padding-left: 2px;',
												items: [{
													border: false,
													xtype: 'checkbox',
													checked: true,
													listeners: {
														check: function (a, b) {
															var box = this.ownerCt.ownerCt.items.items[2].items.items[0];
															if (b) {
																box.disable();
																box.selectAll();
															} else {
																box.enable();
																box.deselectAll();
															}
														}
													}
												}]
											},{
												border: false,
												autoHeight: true,
												items: [{
													border: false,
													xtype: 'lovcombo',
													name: data.data[i].campo,
													value: '',
													disabled: true,
													fieldLabel: data.data[i].nome,
													store: new Ext.data.JsonStore({
														autoLoad:true,
														root:'data',
														fields: ['id', 'nome'],
														id: 'id',
														url: '<?php echo $this->url(array('controller' => 'consultas', 'action' => 'get-combo', 'data' => 'filial'), null, true); ?>?consulta=' + this.consultaName,
													}),
													mode: 'local',
													valueField: 'id',
													displayField: 'nome'
												}]
											}]
										}));
									break;
									case 'gabinete':
										this.formConsulta.add(new Ext.Panel({
											layout: 'column',
											border: false,
											items: [{
												width: 100,
												border: false,
												items: [{xtype: 'label', text: data.data[i].nome}]
											}, {
												width: 20,
												border: false,
												autoHeight: true,
												bodyStyle: 'padding-top: 4px; padding-left: 2px;',
												items: [{
													border: false,
													xtype: 'checkbox',
													checked: true,
													listeners: {
														check: function (a, b) {
															var box = this.ownerCt.ownerCt.items.items[2].items.items[0];
															if (b) {
																box.disable();
																box.selectAll();
															} else {
																box.enable();
																box.deselectAll();
															}
														}
													}
												}]
											},{
												border: false,
												autoHeight: true,
												items: [{
													border: false,
													xtype: 'lovcombo',
													name: data.data[i].campo,
													value: '',
													disabled: true,
													fieldLabel: data.data[i].nome,
													store: new Ext.data.JsonStore({
														autoLoad:true,
														root:'data',
														fields: ['id', 'nome'],
														id: 'id',
														url: '<?php echo $this->url(array('controller' => 'consultas', 'action' => 'get-combo', 'data' => 'gabinete'), null, true); ?>?consulta=' + this.consultaName,
													}),
													mode: 'local',
													valueField: 'id',
													displayField: 'nome'
												}]
											}]
										}));
									break;
									case 'grupo':
										this.formConsulta.add(new Ext.Panel({
											layout: 'column',
											border: false,
											items: [{
												width: 100,
												border: false,
												items: [{xtype: 'label', text: data.data[i].nome}]
											}, {
												width: 20,
												border: false,
												autoHeight: true,
												bodyStyle: 'padding-top: 4px; padding-left: 2px;',
												items: [{
													border: false,
													xtype: 'checkbox',
													checked: true,
													listeners: {
														check: function (a, b) {
															var box = this.ownerCt.ownerCt.items.items[2].items.items[0];
															if (b) {
																box.disable();
																box.selectAll();
															} else {
																box.enable();
																box.deselectAll();
															}
														}
													}
												}]
											},{
												border: false,
												autoHeight: true,
												items: [{
													border: false,
													xtype: 'lovcombo',
													name: data.data[i].campo,
													value: '',
													disabled: true,
													fieldLabel: data.data[i].nome,
													store: new Ext.data.JsonStore({
														autoLoad:true,
														root:'data',
														fields: ['id', 'nome'],
														id: 'id',
														url: '<?php echo $this->url(array('controller' => 'consultas', 'action' => 'get-combo', 'data' => 'grupo'), null, true); ?>?consulta=' + this.consultaName,
													}),
													mode: 'local',
													valueField: 'id',
													displayField: 'nome'
												}]
											}]
										}));
									break;
								}
							}
							this.el.unmask();
							this.formConsulta.doLayout();
						}
					}
				});
			} else {
				node.expand();
			}
		}, this);
		Consultas.superclass.initEvents.call(this);
	},
	onDestroy: function () {
		Consultas.superclass.onDestroy.apply(this, arguments);
	},
});
Ext.reg('consultas', Consultas);