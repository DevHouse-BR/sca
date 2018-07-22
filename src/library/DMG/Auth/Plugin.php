<?php

class DMG_Auth_Plugin extends Zend_Controller_Plugin_Abstract {
	public function routeShutdown(Zend_Controller_Request_Abstract $request) {
		$controller = $this->getRequest()->getControllerName();
		$action = $this->getRequest()->getActionName();

		if (!Zend_Auth::getInstance()->hasIdentity()) {
			// usu�rio n�o autenticado
			// permiss�es: index/index, index/auth
			if ( !($controller == 'index' && ($action == 'index' || $action == 'auth' || $action = 'compressedjs' || $action = 'compressedcss' || $action = 'language')) && !($controller == 'config' && ($action == 'getmultiple' || $action == 'getaccountcfg')) && !($controller == 'portal' && ($action == 'index' || $action == 'auth' || $action = 'compressedjs' || $action = 'compressedcss' || $action = 'language')) ) {
				//$request->setModuleName('default')->setControllerName('index')->setActionName('null')->setDispatched(false);
				self::stopService(1);
			} 
		} else {
			//Antes de liberar o acesso, verifica-se o tipo do usuario
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == 'I'){
				if($controller == 'portal' or $controller == 'ppostagens' or $controller == 'pmensagens'){
					Zend_Auth::getInstance()->clearIdentity();
				}
			} else if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == 'P'){
				if($controller != 'portal' and $controller != 'config' and $controller != 'extjs' and (($controller != 'index') and (($action != 'user') or ($action != 'compressedcss'))) and ($controller != 'ppostagens') and ($controller != 'anexos') and ($controller != 'pmensagens') and ($controller != 'clientes' and ($action != 'list') ) or ($controller == 'index' and $action == 'index')){
					Zend_Auth::getInstance()->clearIdentity();
				}
			}

			//se jah esta logado, nada de logar novamente...
			if ( ($controller == 'index' && $action == 'auth') or ($controller == 'portal' && $action == 'auth') ) {
				//$request->setModuleName('default')->setControllerName('index')->setActionName('null')->setDispatched(false);
				self::stopService(1);
			}				
		}		
	}

	private function stopService($errorCode){
		switch($errorCode){
			case 1:
				die("Voce nao tem permicao de acessar este recurso");
			default:
				die("Desculpe, este recurso esta indisponivel");
		}
	}
}
