<?php

class IndexController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
	}
	public function indexAction () {
		echo $this->view->render('index/index.phtml');
	}
	public function authAction () {
		if (!$this->getRequest()->isPost()) {
			return;
		}

		if (!Zend_Auth::getInstance()->authenticate(new DMG_Auth_Adapter($this->getRequest()->getParam('login_usuario'),$this->getRequest()->getParam('senha_usuario')))->isValid()) {
			echo Zend_Json::encode(array('failure' => true));
			return;
		} 

		$user = Doctrine::getTable('ScmUser')->find(Zend_Auth::getInstance()->getIdentity()->id);
		echo Zend_Json::encode(array('success' => true, 'user' => array(
						'id' => $user->id,
						'nome_usuario' => $user->nome_usuario
						)));
	}
	public function userAction () {
		if (!Zend_Auth::getInstance()->hasIdentity()) {
			return;
		}
		switch ($this->getRequest()->getParam('do')) {
			case 'get':
				$user = Doctrine::getTable('ScmUser')->find(Zend_Auth::getInstance()->getIdentity()->id);
				echo Zend_Json::encode(array(
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
							echo Zend_Json::encode(array('success' => true));
						} catch (Exception $e) {
							echo Zend_Json::encode(array('success' => false));
						}
					} else {
						echo Zend_Json::encode(array('success' => false, 'errors' => $validation));
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
	public function jsAction () {
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'text/javascript; charset=UTF-8');
		$js = $this->view->render('index/i18n.js');
		$js .= $this->view->render('index/base.js');
		$js .= $this->view->render('index/edit-profile.js');
		if (DMG_Acl::canAccess(1) and DMG_Acl::canAccess(14)) {
			$js .= $this->view->render('config/administration-config.js');
		}
		if (DMG_Acl::canAccess(2) and DMG_Acl::canAccess(14)) {
			$js .= $this->view->render('config/administration-config-form.js');
		}
		if (DMG_Acl::canAccess(1)) {
			$js .= $this->view->render('settings/administration-settings.js');
		}
		if (DMG_Acl::canAccess(2)) {
			$js .= $this->view->render('settings/administration-settings-form.js');
		}
		if (DMG_Acl::canAccess(3)) {
			$js .= $this->view->render('user/administration-user.js');
		}
		if (DMG_Acl::canAccess(4) || DMG_Acl::canAccess(5)) {
			$js .= $this->view->render('user/administration-user-form.js');
		}
		if (DMG_Acl::canAccess(7)) {
			$js .= $this->view->render('group/administration-group.js');
		}
		if (DMG_Acl::canAccess(8) || DMG_Acl::canAccess(9)) {
			$js .= $this->view->render('group/administration-group-form.js');
		}
		if (DMG_Acl::canAccess(11)) {
			$js .= $this->view->render('group/administration-group-permission.js');
		}
		if (DMG_Acl::canAccess(12)) {
			$js .= $this->view->render('user/administration-user-group.js');
		}
		if (DMG_Acl::canAccess(14)) {
			$js .= $this->view->render('account/administration-acc.js');
		}
		if (DMG_Acl::canAccess(15)) {
			$js .= $this->view->render('depto/controle-departamento.js');
		}
		if (DMG_Acl::canAccess(16)) {
			$js .= $this->view->render('depto/controle-departamento-form.js');
		}
		if (DMG_Acl::canAccess(17)) {
			$js .= $this->view->render('clientes/controle-cliente.js');
		}
		if (DMG_Acl::canAccess(18)) {
			$js .= $this->view->render('clientes/controle-cliente-form.js');
		}
		if (DMG_Acl::canAccess(19)) {
			$js .= $this->view->render('clientes/controle-cliente-add-user.js');
		}
		if (DMG_Acl::canAccess(36)) {
			$js .= $this->view->render('index/reports.js');
		}
//		echo DMG_JSMin::minify($js);
		echo $js;
	}
	public function logoutAction () {
		Zend_Auth::getInstance()->clearIdentity();
		$this->_helper->redirector('index', 'index');
	}
	public function infoAction () {
		//4now not used...			
	}
}
