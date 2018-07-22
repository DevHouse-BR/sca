<?php

class IndexController extends Zend_Controller_Action
{

    public function init(){
        $this->_helper->viewRenderer->setNoRender(true);
        $this->css = array(
			'extjs/resources/css/ext-all.css',
			'css/base-css.css'
		);
		$this->jsLogin = array(
			'index/app.js'
		);
		$this->js = array(
			'index/app.js',
			'index/edit-profile.js',
			'index/AccessController.js'
		);
		$this->uxLogin = array(
			'extjs/ux/PasswordField.js',
			'extjs/ux/md5.js'
		);
		
    	if (DMG_Acl::canAccess(1) and DMG_Acl::canAccess(14)) {
			$this->js[] = 'config/administration-config.js';
		}
		if (DMG_Acl::canAccess(2) and DMG_Acl::canAccess(14)) {
			$this->js[] = 'config/administration-config-form.js';
		}
		if (DMG_Acl::canAccess(1)) {
			$this->js[] = 'settings/administration-settings.js';
		}
		if (DMG_Acl::canAccess(2)) {
			$this->js[] = 'settings/administration-settings-form.js';
			$this->js[] = 'settings/administration-settings-upload-form.js';
		}
		if (DMG_Acl::canAccess(3)) {
			$this->js[] = 'user/administration-user.js';
		}
		if (DMG_Acl::canAccess(4) || DMG_Acl::canAccess(5) || DMG_Acl::canAccess(20)) {
			$this->js[] = 'user/administration-user-form.js';
		}
		if (DMG_Acl::canAccess(7)) {
			$this->js[] = 'group/administration-group.js';
		}
		if (DMG_Acl::canAccess(8) || DMG_Acl::canAccess(9)) {
			$this->js[] = 'group/administration-group-form.js';
		}
		if (DMG_Acl::canAccess(11)) {
			$this->js[] = 'group/administration-group-permission.js';
		}
		if (DMG_Acl::canAccess(12)) {
			$this->js[] = 'user/administration-user-group.js';
		}
		if (DMG_Acl::canAccess(14)) {
			$this->js[] = 'account/administration-acc.js';
		}
		if (DMG_Acl::canAccess(15)) {
			$this->js[] = 'depto/controle-departamento.js';
		}
		if (DMG_Acl::canAccess(16)) {
			$this->js[] = 'depto/controle-departamento-form.js';
		}
		if (DMG_Acl::canAccess(17)) {
			$this->js[] = 'clientes/controle-cliente.js';
		}
		if (DMG_Acl::canAccess(18)) {
			$this->js[] = 'clientes/controle-cliente-form.js';
		}
		if (DMG_Acl::canAccess(19)) {
			$this->js[] = 'clientes/controle-cliente-add-user.js';
		}
		if (DMG_Acl::canAccess(21)) {
			$this->js[] = 'postagens/controle-postagens.js';
		}
    	if (DMG_Acl::canAccess(22)) {
			$this->js[] = 'postagens/controle-postagens-form.js';
		}
		if (DMG_Acl::canAccess(36)) {
			//$this->js[] = 'index/reports.js';
		}
    }

    public function indexAction(){
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
    		$this->view->js = array('index/compressedjs');
    		$this->view->css = array(
    			'extjs/resources/css/ext-all-css.css',
    			'css/base-css.css'
    		);
    	}
    	
    	if($logado){
    		$this->view->account = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
    		$this->view->token = DMG_Asc2Hex::toHex(Zend_Auth::getInstance()->getIdentity()->ScaAccount->nome_account);
    	}
    	else{
	    	$token = Zend_Controller_Action::_getParam('token');
	    	$account = DMG_Asc2Hex::toAsc($token);
	    	$account = Doctrine::getTable('ScaAccount')->findByNomeAccount($account);
	    	$this->view->account = $account[0]->id;
    	}

    	//436F6E74612050616472C3A36F
        
    	echo $this->view->render('index/index.phtml');
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
		echo Khronos_Menu::getJson();
	}
	
	public function authAction (){
		
		if (!$this->getRequest()->isPost()) {
			return;
		}
		
		$resultado = Zend_Auth::getInstance()->authenticate(new DMG_Auth_Adapter($this->getRequest()->getParam('login_usuario'),$this->getRequest()->getParam('senha_usuario'), $this->getRequest()->getParam('id_account')))->isValid();
		if (!$resultado) {
			$this->_helper->json(array('success' => false, 'errormsg'=>DMG_Translate::_('auth.error')));
			return;
		} 

		$user = Doctrine::getTable('ScmUser')->find(Zend_Auth::getInstance()->getIdentity()->id);
		$this->_helper->json(array('success' => true, 'user' => array(
			'id' => $user->id,
			'nome_usuario' => $user->nome_usuario
		)));
	}
	
	public function logoutAction () {
		Zend_Auth::getInstance()->clearIdentity();	
		$this->_helper->_redirector->gotoSimple('', '', null, array('login' => $this->getRequest()->getParam('token')));	
	}
	
	public function userAction () {
		if (!Zend_Auth::getInstance()->hasIdentity()) {
			return;
		}
		switch ($this->getRequest()->getParam('do')) {
			case 'get':
				$user = Doctrine::getTable('ScmUser')->find(Zend_Auth::getInstance()->getIdentity()->id);
				$this->_helper->json(array(
					'success' => true,
					'data' => array(
						'id' => $user->id,
						'nome_usuario' => $user->nome_usuario,
						'login_usuario' => $user->login_usuario,
						'email' => $user->email,
						'idioma_usuario' => $user->idioma_usuario,
					)
				));
			break;
			case 'update':
				$obj = Doctrine::getTable('ScmUser')->find(Zend_Auth::getInstance()->getIdentity()->id);
				if ($obj) {
					$obj->nome_usuario = $this->getRequest()->getParam('nome_usuario');
					$obj->login_usuario = $this->getRequest()->getParam('login_usuario');
					$obj->email = $this->getRequest()->getParam('email');
					$obj->idioma_usuario = (strlen($this->getRequest()->getParam('idioma_usuario')) ? $this->getRequest()->getParam('idioma_usuario') : null);
					$validation = $this->saveValidate($obj, Zend_Auth::getInstance()->getIdentity()->id);
					$pass1 = $this->getRequest()->getParam('password_');
					$pass2 = $this->getRequest()->getParam('password2_');

					if( ($pass1 == $pass2) and $pass1){
						$obj->senha_usuario=$pass1;
					}

					if (!$validation) {
						try {
							$obj->save();
							$this->_helper->json(array('success' => true));
						} catch (Exception $e) {
							$this->_helper->json(array('success' => false));
						}
					} else {
						$this->_helper->json(array('success' => false, 'errors' => $validation));
					}
				}
			break;
		}
	}
	
	protected function saveValidate (&$obj, $id) {
		$errors = array();
		$qr1 = Doctrine_Query::create()->from('ScmUser')->addWhere('login_usuario = ?', $obj->login_usuario);
		$qr2 = Doctrine_Query::create()->from('ScmUser')->addWhere('email = ?', $obj->email);
		if ($id > 0) {
			$qr1->addWhere('id <> ?', $id);
			$qr2->addWhere('id <> ?', $id);
		}
		if ($qr1->count() > 0) {
			$errors['login_usuario'] = DMG_Translate::_('administration.user.form.login_usuario.invalid');
		}
		if ($qr2->count() > 0) {
			$errors['email'] = DMG_Translate::_('administration.user.form.email.invalid');
		}
		$validator = new Zend_Validate_EmailAddress();
		if (!$validator->isValid($obj->email)) {
			$errors['email'] = DMG_Translate::_('administration.user.form.email.invalidsyntax');
		}
		if (!strlen($this->getRequest()->getParam('login_usuario'))) {
			$errors['login_usuario'] = DMG_Translate::_('administration.user.form.login_usuario.validation');
		}
		// valida idioma
		if ($id == 0) {
			if (!strlen($this->getRequest()->getParam('senha_usuario'))) {
				$errors['senha_usuario'] = DMG_Translate::_('administration.user.form.senha_usuario.validation');
			} else {
				$obj->senha_usuario = $this->getRequest()->getParam('senha_usuario');
			}
		} else {
			if (strlen($this->getRequest()->getParam('senha_usuario'))) {
				$obj->senha_usuario = $this->getRequest()->getParam('senha_usuario');
			}
		}
		if (count($errors)) {
			return $errors;
		} else {
			return false;
		}
	}
	
	public function accesscontrolAction(){
		$acl = $this->getRequest()->getParam('acl');
		$data = array();
		foreach($acl as $a){
			$data[$a] = ($a != "")? (DMG_Acl::canAccess($a) ? true : false):false;
		}
		$this->_helper->json(array('success' => true,'data'=> $data));
	}
}

