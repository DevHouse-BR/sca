Ext.namespace('Extplorer');

Extplorer.explorer = Ext.extend(Ext.Panel, {
	id:'extplorer_panel',
	layout: 'fit',
	layoutConfig:{
		align: 'stretch'
	},
	listeners:{
		afterrender: function(painel){
			var keep = new Ext.util.DelayedTask(function(){
				Ext.EventManager.on(Ext.getCmp('extplorer_panel').iframe.getEl().dom, Ext.isIE?'readystatechange':'load', function(){
					Ext.getCmp('extplorer_panel').getEl().unmask();
				});

				painel.getEl().mask(Application.app.language('i18n.loading'));
			}).delay(500);
		}
	},
	initComponent: function(){
		this.iframe = new Ext.ux.IFrameComponent({
			flex:1,
			url: 'extplorer'
		});
		Ext.apply(this, {
			items: [this.iframe]
		});
		Extplorer.explorer.superclass.initComponent.call(this);
	}
});

Ext.reg('extplorer', Extplorer.explorer);
