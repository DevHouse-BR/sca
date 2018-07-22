<?php

class PortalController extends Zend_Controller_Action
{

    public function init(){
        $this->_helper->viewRenderer->setNoRender(true);

		$this->css = array(
			'extjs/resources/css/ext-all.css',
			'css/base-css.css'
		);
		
		$this->jsLogin = array(
			'portal/app.js'
		);
		
		$this->js = array(
			'portal/app.js',
			'portal/edit-profile.js',
			'ppostagens/pcontrole-postagens.js',
			'ppostagens/pcontrole-postagens-form.js',
			'ppostagens/pcontrole-view-postagem.js'
		
		);
		
		$this->uxLogin = array(
			'extjs/ux/PasswordField.js',
			'extjs/ux/md5.js'
		);

    }

    public function indexAction(){
	$this->setCockiePlace(); //seta um cookie no usuario para podermos recuperar o token, isso facilita a vida do usuario
	$this->setRememberThings();

    	$this->view->logado = $logado = Zend_Auth::getInstance()->hasIdentity();
    	
    	if(APPLICATION_ENV == "development"){
    		$ext = array(
    			'extjs/adapter/ext/ext-base-debug.js',
    			'extjs/ext-all-debug.js'
    		);
    		
    		$ux = Khronos_UxScript::add();
    		
    		$js = array();
    		$caminho = '../application/views/scripts/';
    		if($logado){
	    		foreach($this->js as $script){
	    			$js[] = $caminho . $script;
	    		}
				$this->view->js = array_merge($ext, $ux, $js);
    		}
    		else{
	    		foreach($this->jsLogin as $script){
	    			$js[] = $caminho . $script;
	    		}
    			$this->view->js = array_merge($ext, $this->uxLogin, $js);
    		}
    		
			$this->view->css = $this->css;
    	}
    	else {
    		$this->view->js = array('portal/compressedjs');
    		$this->view->css = array(
    			'extjs/resources/css/ext-all-css.css',
    			'css/base-css.css'
    		);
		}
		 	
		if($logado){
			$this->setCockiePlace();
	
			$this->view->account = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$this->view->token = DMG_Asc2Hex::toHex(Zend_Auth::getInstance()->getIdentity()->ScaAccount->nome_account);
			
			$idCliente = Zend_Auth::getInstance()->getIdentity()->sca_clientes_id;
			$this->view->personalCliLogo = 'files/'.$this->view->account.'/client_logo_'.$idCliente;
			
			if( !file_exists($this->view->personalCliLogo) ){
				$this->view->personalCliLogo = "";
			}
		}
		else {
			$token = Zend_Controller_Action::_getParam('token');
			$account = DMG_Asc2Hex::toAsc($token);
			$account = Doctrine::getTable('ScaAccount')->findByNomeAccount($account);
			$this->view->account = $account[0]->id;
		
			$this->view->logoPath = DMG_Config::getAccountCfgWithId(2, $account[0]->id);
			
			$this->view->mainTitle = DMG_Config::getAccountCfgWithId(6, $account[0]->id);
			
			$this->view->welcomeMsg = DMG_Config::getAccountCfgWithId(8, $account[0]->id);
			
			$this->view->copyright = DMG_Config::get(3);
	
		}
	
		$this->view->footerMsg = Doctrine_Query::create()
				->select()
				->from('ScaAccountRelationConfig sarc')
				->where('sarc.sca_account_id = ?', $this->view->account)
				->addWhere('sca_account_config_id = ?', 7) // <---
				->fetchOne()
					->valor_parametro;
	
	
		//436F6E74612050616472C3A36F

    	echo $this->view->render('portal/index.phtml');
    }
    
    public function compressedjsAction(){
    	$logado = Zend_Auth::getInstance()->hasIdentity();
    	if($logado){
	    	$ux  = Khronos_UxScript::add();
	    	$js = $this->js;
    	}
    	else{
    		$ux = $this->uxLogin;
    		$js = $this->jsLogin;
    	}
		
		$ext  = @file_get_contents('extjs/adapter/ext/ext-base.js') . chr(10);
		$ext .= @file_get_contents('extjs/ext-all.js') . chr(10);
		
		foreach($ux as $script){
			$output .= @file_get_contents($script) . chr(10);
		}
		foreach($js as $script){
			//$script = str_replace("../application/views/scripts/", "", $script);
			$output .= $this->view->render($script) . chr(10);
		}
		
		ob_start("ob_gzhandler");
		$this->view->headMeta()->appendHttpEquiv('Content-Encoding', 'gzip,deflate');
		echo $ext;
		echo DMG_JSMin::minify($output);
		ob_end_flush();
    }
    
    public function compressedcssAction($request){
    	$output = "";
   		foreach($this->css as $script){
			$output .= @file_get_contents($script) . chr(10);
		}
		ob_start("ob_gzhandler");
		$this->getResponse()->setHeader("Content-Type", "text/css");
		$this->view->headMeta()->appendHttpEquiv('Content-Encoding', 'gzip,deflate');
		echo DMG_CSSMin::minify($output);
		ob_end_flush();
    }

	public function languageAction(){
		if (Zend_Auth::getInstance()->hasIdentity()) {
			$language = Zend_Auth::getInstance()->getIdentity()->idioma_usuario;
			if (!$language) {
				$language = DMG_Config::get(1);
			}
		} else {
			$language = DMG_Config::get(1);
		}
		
		$traducao = utf8_encode(@file_get_contents(APPLICATION_PATH . "/translations/" . $language . ".php"));
		$traducao = str_replace('<?php', '', $traducao);
		$traducao = str_replace('return', '$traducao =', $traducao);
		eval($traducao);
		$this->_helper->json($traducao);
	}
	
	public function userinfoAction(){
		if (Zend_Auth::getInstance()->hasIdentity()) {
			$identidade = Zend_Auth::getInstance()->getIdentity();
			$user = array(
				'id'=> $identidade->id,
				'sca_account_id'=> $identidade->sca_account_id,
				'sca_clientes_id'=> $identidade->sca_clientes_id,
				'sca_departamentos_id'=> $identidade->sca_departamentos_id,
				'tipo_usuario'=> $identidade->tipo_usuario,
				'nome_usuario'=> $identidade->nome_usuario,
				'login_usuario'=> $identidade->login_usuario,
				'recebe_mensagem'=> $identidade->recebe_mensagem,
				'idioma_usuario'=> $identidade->idioma_usuario,
				'email'=> $identidade->email,
				'fl_system'=> $identidade->fl_system,
				'fl_status'=> $identidade->fl_status
			);
		} else {
			$user = array();
		}
		$this->_helper->json($user);
	}
	
	public function menuAction(){
		$this->getResponse()->setHeader("Content-Type", "application/json");
		echo Khronos_MenuPortal::getJson();
	}
	
	public function authAction (){
		if (!$this->getRequest()->isPost()) {
			return;
		}
	
		$resultado = Zend_Auth::getInstance()->authenticate(new DMG_Portal_Auth_Adapter($this->getRequest()->getParam('login_usuario'),$this->getRequest()->getParam('senha_usuario'), $this->getRequest()->getParam('id_account')))->isValid();

		if (!$resultado) {
			$this->_helper->json(array('success' => false, 'errormsg'=>DMG_Translate::_('auth.error')));
			return;
		} 

		if($this->getRequest()->getParam('remember_user') == 'on'){
			$usr = $this->getRequest()->getParam('login_usuario');
			setcookie("remember_usr_sca_dmg", DMG_Asc2Hex::toHex($usr), time()+1300000); //pouco menos de um ano
		} else {
			setcookie("remember_usr_sca_dmg", '', time()+1300000);
		}
		if($this->getRequest()->getParam('remember_pass') == 'on'){
			$pas = $this->getRequest()->getParam('senha_usuario');
			setcookie("remember_pas_sca_dmg", DMG_Asc2Hex::toHex($pas), time()+1300000); //pouco menos de um ano
		} else {
			setcookie("remember_pas_sca_dmg", '', time()+1300000);
		}

		$this->_helper->json(array('success' => true, 'user' => array(
			'id' => Zend_Auth::getInstance()->getIdentity()->id,
			'nome_usuario' => Zend_Auth::getInstance()->getIdentity()->nome_usuario
		)));
	}
	
	public function logoutAction () {
		Zend_Auth::getInstance()->clearIdentity();	
		$this->_helper->_redirector->gotoSimple('portal', '', null, array('login' => $this->getRequest()->getParam('token')));	
	}
	
	public function accesscontrolAction(){
		$acl = $this->getRequest()->getParam('acl');
		$data = array();
		foreach($acl as $a){
			$data[$a] = ($a != "")? (DMG_Acl::canAccess($a) ? true : false):false;
		}
		$this->_helper->json(array('success' => true,'data'=> $data));
	}

	private function setCockiePlace(){
		$tokenData = $this->getRequest()->getParam('token');
		if($tokenData){
			return;
		}

		if(Zend_Auth::getInstance()->hasIdentity()){
			$tokenData = DMG_Asc2Hex::toHex(Zend_Auth::getInstance()->getIdentity()->ScaAccount->nome_account);
		}

		if($tokenData) {
			setcookie("portalToken", $tokenData, time()+1300000); //pouco menos de um ano
		} else if($_COOKIE["portalToken"]) {
			$this->_helper->_redirector->gotoSimple('portal', '', null, array('login' => $_COOKIE["portalToken"]));
		}

	}

	private function setRememberThings(){
		 if(!Zend_Auth::getInstance()->hasIdentity()) { //nao esta logado
			$user = '';
			$pass = '';
			if(isset($_COOKIE['remember_usr_sca_dmg'])){
				$user = $_COOKIE["remember_usr_sca_dmg"];
			}
			if(isset($_COOKIE['remember_pas_sca_dmg'])){
				$pass = $_COOKIE["remember_pas_sca_dmg"];
			}
			
			if($user){  //foi possivel regatar as informacoes de login
				$user = DMG_Asc2Hex::toAsc($user);
				$this->view->enableUsrRemember = $user;
			
				if($pass){
					$pass = DMG_Asc2Hex::toAsc($pass);
					$this->view->enablePassRemember = $pass;
				}
			}

		}
	}
}

