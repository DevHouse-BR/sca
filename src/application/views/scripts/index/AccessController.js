/**
 * @author Leonardo
 */

Application.AccessController = function(){	
	
	var acl = [];
	
 	var _syncAjax = function(url, passData) {
		var postString = Ext.isObject(passData) ? Ext.urlEncode(passData) : passData;
		try {
			if (window.XMLHttpRequest) {
				AJAX = new XMLHttpRequest();
			}
			else {
				AJAX = new ActiveXObject("Microsoft.XMLHTTP");
			}
			
			if (AJAX) {
				AJAX.open("POST", url, false);
				AJAX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				AJAX.send(postString);
				return AJAX.responseText;
			}
			else {
				return false;
			}
		}
		catch(e){
			return false;
		}
	};
	
	var checkAcl = function(controlAcl){
		var resposta = Ext.decode(_syncAjax(baseURL + 'index/accesscontrol', {'acl[]':controlAcl}));
		if(resposta) acl = resposta.data;
	};
	
	var denied = function(controlAcl){
		if(Ext.isArray(controlAcl)){
			for(var i = 0; i < controlAcl.length; i++){
				if(acl[String(controlAcl[i])]) return false;
			}
		}
		else {
			if(acl[String(controlAcl)]) return false;
		}
		return true;
	};
	
 	return{
 		applyPermission: function(args){
 			var temp = [];
 			var access;
 			for(var i = 0; i < args.items.length; i++){
 				if(Ext.isArray(args.items[i].acl)){
	 				for(var j = 0; j < args.items[i].acl.length; j++){
	 					temp.push(args.items[i].acl[j]);
	 				}
 				}
 				else temp.push(args.items[i].acl);
 			}
 			
 			checkAcl(temp);
 			
 			for(var i = 0; i < args.items.length; i++){
 				if(denied(args.items[i].acl)){
 					var action = args.defaultAction;
 					if(args.items[i].action) action = args.items[i].action;
 					if(args.items[i].tipo == "componente"){
 						var el = Ext.getCmp(args.items[i].objeto);
						if(!el)
							alert("EL invalido!");
 	 					switch (action) {
 							case 'hide':
 								el.hide();
 								break;
 							case 'disable':
 								el.disable();
 								break;
 						}
						if(args.items[i].setHeightZero==true){
							el.height = 0;
						}
						if(args.items[i].setFlexZero==true){
							el.flex = 0;
						}
						if(args.items[i].setWidthZero==true){
							el.width = 0;
						}
 					} else if(args.items[i].tipo == "coluna"){
						if(args.items[i].objeto.removeColumnMark != true) {
							args.items[i].objeto.removeColumnMark = true;
 							var config = args.items[i].objeto.config;
 							args.items[i].objeto.config = [config[args.items[i].columnIndex]];
 							config.splice(args.items[i].columnIndex, 1);
 							args.items[i].objeto.setConfig(config);
						}
 					} else if(args.items[i].tipo == "funcao"){
 						args.items[i].objeto[args.items[i].funcao] = function(){};
 					} else if(args.items[i].tipo == "execute"){
 						args.items[i].funcao(args.items[i].objeto);
 					} else if(args.items[i].tipo == "title"){ //caso n exista a permicao muda-se o titulo
						args.items[i].objeto.title = args.items[i].title;
					}
 				}
 			} 			
 		},
		
		hasPermission: function(controlAcl){
 			checkAcl(controlAcl);
 			return !denied(controlAcl);
 		}
 	};
 }();
