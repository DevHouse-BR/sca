var smSubGrid = new Ext.grid.CheckboxSelectionModel();
var ControleClienteUserFormFilter = new Ext.ux.grid.GridFilters({
        local: false,
        menuFilterText: '<?php echo DMG_Translate::_('grid.filter.label'); ?>',
        filters: [{
                type: 'string',
                dataIndex: 'nome_usuario',
                phpMode: true
        }, {
                type: 'string',
                dataIndex: 'login_usuario',
                phpMode: true
        }, {
                type: 'string',
                dataIndex: 'email',
                phpMode: true
        }, {
                type: 'list',
                dataIndex: 'idioma_usuario',
                options: languages,
                phpMode: true
        },{
                type: 'string',
                dataIndex: 'recebe_mensagem',
                options: [
                        [0, '<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>'],
                        [1, '<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>']
                ],
                phpMode: true
        }]
});

var ControleClienteUserForm = Ext.extend(Ext.Window, {
        clienteId: 0,
        modal: true,
        constrain: true,
        maximizable: true,
        resizable: true,
        width: 450,
	height: 380,
        layout: 'fit',
        closeAction: 'hide',

	//seta a var id
	_setClienteId: function (cliente){
		this.clienteId = cliente;
	},

	//Cria e seta as propriedades do documento
	initComponent: function() {
		//store para conter as infos baixadas do servidor
                storeS = new Ext.data.JsonStore({
			id: "storeGridClienteUserInfo",
                        url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'list_cli_user'), null, true); ?>',
                        root: 'data',
                        idProperty: 'id',
                        totalProperty: 'total',
                        autoLoad: false,
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
                                {name: 'id', type: 'string'},
				{name: 'nome_usuario', type: 'string'},
				{name: 'login_usuario', type: 'string'},
				{name: 'email', type: 'string'},
				{name: 'idioma_usuario', type: 'string'},
				{name: 'recebe_mensagem', type: 'boolean'},
                        ]
                });

		//cria um paginador
                var paginator = new Ext.PagingToolbar({
                        store: storeS,
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

		//cira a grid
		var MyGrid = Ext.extend(Ext.grid.GridPanel, {
			scope: this, //para pegar o scopo da classe mae

		        border: false,
		        stripeRows: true,
		        loadMask: true,
		        sm: smSubGrid,
		        columnLines: true,
		        plugins: [ControleClienteUserFormFilter],
			store: storeS,
			
			//funcao para inicializar comps
		        initComponent: function () {

				Ext.apply(this, {
					viewConfig: {
						emptyText: '<?php echo DMG_Translate::_('grid.empty'); ?>',
						deferEmptyText: false
					},

					bbar: paginator,

					<?php if(DMG_Acl::canAccess(20)): ?>
					tbar: ['->', {
						text: '<?php echo DMG_Translate::_('grid.form.add'); ?>',
						iconCls: 'silk-add',
						scope: this,
						handler: this._onBtnNovoUsuarioClick
					}, {
						text: '<?php echo DMG_Translate::_('grid.form.delete'); ?>',
						iconCls: 'silk-delete',
						scope: this,
						handler: this._onBtnExcluirSelecionadosClick
					} ],
					<?php endif; ?>
					
					columns: [smSubGrid, {
						dataIndex: 'id',
						header: '<?php echo DMG_Translate::_('controle.clientes.usuarios.id.text'); ?>',
						width: 40,
						sortable: true
					}, {
						dataIndex: 'nome_usuario',
						header: '<?php echo DMG_Translate::_('controle.clientes.usuarios.nome.text'); ?>',
						width: 120,
						sortable: true
                                        }, {
                                                dataIndex: 'login_usuario',
                                                header: '<?php echo DMG_Translate::_('controle.clientes.usuarios.login.text'); ?>',
                                                width: 120,
                                                sortable: true
                                        }, {
                                                dataIndex: 'email',
                                                header: '<?php echo DMG_Translate::_('controle.clientes.usuarios.email.text'); ?>',
                                                width: 120,
                                                sortable: true
                                        }, {
                                                dataIndex: 'idioma_usuario',
                                                header: '<?php echo DMG_Translate::_('controle.clientes.usuarios.idioma.text'); ?>',
                                                width: 120,
                                                sortable: true,
        		                        renderer: function (e) {
	                	                        for (i = 0; i < languages.length; i++) {
                                	        	        if (languages[i][0] == e) {
                                		                        return languages[i][1];
                        	                	        }
	                	                        }
	        	                        }
                                        }, {
                                                dataIndex: 'recebe_mensagem',
                                                header: '<?php echo DMG_Translate::_('controle.clientes.usuarios.mensagem.text'); ?>',
                                                width: 40,
                                                sortable: true,
		                                renderer: function (e) {
                		                        if(e == 'true') {
                                		                return '<center><img src="extjs/resources/images/default/dd/drop-yes.gif" alt="<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>" title="<?php echo DMG_Translate::_('administration.user.form.status.active'); ?>" /></center>';
		                                        } else {
                		                                return '<center><img src="extjs/resources/images/default/dd/drop-no.gif" alt="<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>" title="<?php echo DMG_Translate::_('administration.user.form.status.inactive'); ?>" /></center>';
                                		        }
		                                }
					} ],
					
					
				});

				MyGrid.superclass.initComponent.call(this);
			},

			show: function() {
				MyGrid.superclass.show.apply(this, arguments);
			},


		        //ao clicar no botao de remover usuario de cliente...
		       _onBtnExcluirSelecionadosClick: function () {
		                var arrSelecionados = this.getSelectionModel().getSelections();
                		if (arrSelecionados.length === 0) {
		                        uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: '<?php echo DMG_Translate::_('grid.form.alert.select'); ?>'});
                		        return false;
		                }
				uiHelper.confirm('<?php echo DMG_Translate::_('grid.form.confirm.title'); ?>', '<?php echo DMG_Translate::_('grid.form.confirm.delete'); ?>', function (opt) {
					if (opt === 'no') {
						return;
					}
					var id_user_cliente = [];
					for (var i = 0; i < arrSelecionados.length; i++) {
						id_user_cliente.push(arrSelecionados[i].get('id'));
					}

					this.el.mask('<?php echo DMG_Translate::_('grid.form.deleting'); ?>');
					Ext.Ajax.request({
						scope: this,
						url: '<?php echo $this->url(array('controller' => 'clientes', 'action' => 'deleteusercliente'), null, true); ?>',
						params: {
							'id[]': id_user_cliente,
						},
						scope: this,
						success: function (a, b) {
							try {
								var c = Ext.decode(a.responseText);
							} catch (e) {};
							if (c.failure == true) {
								uiHelper.showMessageBox({title: '<?php echo DMG_Translate::_('grid.form.alert.title'); ?>', msg: c.message});
							}
							this.el.unmask();
							this.store.reload();
						},
					});
				}, this);	
		        },
		});

		//cira uma nova grid a partir da classe
		this.myGrid = new MyGrid();

		//incere a grid na janela
                Ext.apply(this, {
			items: this.myGrid,
		});

		//Inicializa 'de facto'
		ControleClienteUserForm.superclass.initComponent.call(this);
	},

        //ao terminar de carregar
        _onLoadOver: function () {
                this.el.unmask();
        },

	//forca carregar novamente o sotore
        show: function() {
		ControleClienteUserForm.superclass.show.apply(this, arguments);
		this.el.mask('<?php echo DMG_Translate::_('grid.form.loading'); ?>');
		storeS.load({
			scope: this,
			params: {
				'id': this.clienteId,
			},
			success: this._onLoadOver(),
			faliure: this._onLoadOver(),
		});
	},
});
