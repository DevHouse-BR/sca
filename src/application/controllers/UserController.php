<?php

class UserController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listAction () {
		if (DMG_Acl::canAccess(3)) {
			$query = Doctrine_Query::create()->select()->from('ScmUser')->Where('tipo_usuario = \'I\'');
				
			if(!DMG_Acl::canAccess(14))
				$query = $query->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);

			$query = $query->execute();
			$answer;
			$loop=0;
	
			foreach($query as $l){
				$answer[$loop]['id'] = $l->id;
				$answer[$loop]['nome_usuario'] = $l->nome_usuario;
				$answer[$loop]['login_usuario'] = $l->login_usuario;
				$answer[$loop]['email'] = $l->email;
				$answer[$loop]['idioma_usuario'] = $l->idioma_usuario;
				$answer[$loop]['fl_status'] = $l->fl_status;
				$answer[$loop]['recebe_mensagem'] = $l->recebe_mensagem;
				$answer[$loop]['nome_departamento'] = $l->ScaDepartamentos->nome_departamento;
				if(DMG_Acl::canAccess(14))
					$answer[$loop]['nome_account'] = $l->ScaAccount->nome_account;

				$loop++;
			}

			echo Zend_Json::encode(array('success' => true, 'data' => $answer));
		}
	}
	public function getAction () {
		if (DMG_Acl::canAccess(4)) {
			$id = (int) $this->getRequest()->getParam('id');
			$obj = Doctrine::getTable('ScmUser')->find($id);
			if ($obj) {
				$send['name'] = $obj->nome_usuario;
				$send['username'] = $obj->login_usuario;
				$send['email'] = $obj->email;
				if($obj->fl_status == 'true')
					$send['status'] = 1;
				else
					$send['status'] = 0;
				if($obj->recebe_mensagem == 'true')
					$send['recebe_msg'] = 1;
				else
					$send['recebe_msg'] = 0;

				echo Zend_Json::encode(array('success' => true, 'data' => $send));
			}
		}
	}
	public function accountslistAction () {
		if (DMG_Acl::canAccess(14)){
			$obj = Doctrine::getTable('ScaAccount');
			if($obj){
				$obj = $obj->findAll();
				$place =0;
				$blah;
				foreach($obj as $k){
					$blah[$place]['name'] = $k['nome_account'];
					$blah[$place]['id'] = $k['id'];
					$place++;
				}
				echo Zend_Json::encode(array('success' => true, 'data' => $blah));
			} else {
				echo Zend_Json::encode(array('success' => false));
			}
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
	public function departamentoslistAction () {
		if (DMG_Acl::canAccess(13)){
			$obj = Doctrine::getTable('ScaDepartamentos');
			if ($obj) {
				if(DMG_Acl::canAccess(14)){
					$obj = $obj->findAll();
				} else {
					$obj = Doctrine_Query::create()->from('ScaDepartamentos')->addWhere('acc.id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->innerJoin('ScaDepartamentos.ScaAccount acc')->execute()->toArray();
				}
				$sendObj;
				$place = 0;
				foreach($obj as $o){
					$sendObj[$place]['name'] = $o['nome_departamento'];
					$sendObj[$place]['id'] = $o['id'];
					$place++;
				}
				echo Zend_Json::encode(array('success' => true, 'data' => $sendObj));
			} else {
				echo Zend_Json::encode(array('success' => false));
			}
		}
	}
	public function saveAction () {
		$id = (int) $this->getRequest()->getParam('id');
		shell_exec("echo \"".$this->getRequest()->getParam('idioma_usuario')."\" >/tmp/blah");
		shell_exec("echo \"123\" >>/tmp/blah");
		if ($id > 0) {
			if (DMG_Acl::canAccess(4)) {
				$obj = Doctrine::getTable('ScmUser')->find($id);
				if ($obj) {
					$obj->nome_usuario = $this->getRequest()->getParam('name');
					$obj->login_usuario = $this->getRequest()->getParam('username');
					$obj->email = $this->getRequest()->getParam('email');
					$obj->idioma_usuario = (strlen($this->getRequest()->getParam('idioma_usuario')) ? $this->getRequest()->getParam('idioma_usuario') : null);
					$obj->fl_status = (int) $this->getRequest()->getParam('status');
					$obj->sca_departamentos_id = $this->getRequest()->getParam('departamento');
					$validation = $this->saveValidate($obj, $id);
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
			}
		} else {
			if (DMG_Acl::canAccess(5)) {
				$obj = new ScmUser();
				$obj->nome_usuario = $this->getRequest()->getParam('name');
				$obj->login_usuario = $this->getRequest()->getParam('username');
				$obj->email = $this->getRequest()->getParam('email');
				$obj->idioma_usuario = (strlen($this->getRequest()->getParam('idioma_usuario')) ? $this->getRequest()->getParam('idioma_usuario') : null);
				$obj->fl_status = (int) $this->getRequest()->getParam('status');
				$obj->senha_usuario = $this->getRequest()->getParam('password');
				$obj->sca_departamentos_id = $this->getRequest()->getParam('departamento');
				$obj->recebe_mensagem = $this->getRequest()->getParam('recebe_msg');
				$obj->fl_system = false;
				if(!DMG_Acl::canAccess(14))
					$obj->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
				else
					$obj->sca_account_id = $this->getRequest()->getParam('accountM');
				$obj->sca_clientes_id = 1;
				$obj->tipo_usuario = 'I';
				$validation = $this->saveValidate($obj, $id);
				if (!$validation) {
					try {
						$obj->save();
						echo Zend_Json::encode(array('success' => true));
					} catch (Exception $e) {
						echo Zend_Json::encode(array('success' => false, 'mensagem' => $e->getMessage()));
					}
				} else {
					echo Zend_Json::encode(array('success' => false));
				}
			}
		}
	}
	public function deleteAction () {
		$deletado = true;
		if (DMG_Acl::canAccess(6)) {
			$id = $this->getRequest()->getParam('id');
			try {
				Doctrine_Manager::getInstance()->getCurrentConnection()->beginTransaction();
				if (is_array($id)) {
					foreach ($id as $k) {
						$deletado = ($deletado and $this->deleteUser($k));
					}
				} else {
					$deletado = $this->deleteUser($id);
				}
				Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
				if($deletado)
					echo Zend_Json::encode(array('success' => true));
				else
					echo Zend_Json::encode(array('success' => false, 'message' => DMG_Translate::_('administration.user.form.cannotdelete')));
			} catch (Exception $e) {
				Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
				echo Zend_Json::encode(array('failure' => true, 'message' => DMG_Translate::_('administration.user.form.cannotdelete')));
			}
		}
	}
	protected function deleteUser ($id) {
		$user = Doctrine::getTable('ScmUser')->find($id);
		if($user->fl_system)
			return false;
		for ($i = 0; $i < count($user->ScmUserGroup); $i++) {
			$user->ScmUserGroup[$i]->delete();
		}
		$user->delete();
		return true;
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
			$errors['username'] = DMG_Translate::_('administration.user.form.username.invalid');
		}
		if ($qr2->count() > 0) {
			$errors['email'] = DMG_Translate::_('administration.user.form.email.invalid');
		}
		$validator = new Zend_Validate_EmailAddress();
		if (!$validator->isValid($obj->email)) {
			$errors['email'] = DMG_Translate::_('administration.user.form.email.invalidsyntax');
		}
		if (!strlen($this->getRequest()->getParam('username'))) {
			$errors['username'] = DMG_Translate::_('administration.user.form.username.validation');
		}
		if ($id == 0) {
			if (!strlen($this->getRequest()->getParam('password'))) {
				$errors['senha_usuario'] = DMG_Translate::_('administration.user.form.password.validation');
			} else {
				$obj->senha_usuario = $this->getRequest()->getParam('password');
			}
		} else {
			if (strlen($this->getRequest()->getParam('password'))) {
				$obj->senha_usuario = $this->getRequest()->getParam('password');
			}
		}
		if ($obj->fl_status == '1') {
			$obj->fl_status = '1';
		} else {
			$obj->fl_status = '0';
		}
		if (count($errors)) {
			return $errors;
		} else {
			return false;
		}
	}
	public function groupAction () {
		if (DMG_Acl::canAccess(12)) {
			$this->user = Doctrine::getTable('ScmUser')->find((int) $this->getRequest()->getParam('user'));
			if (!$this->user) {
				return;
			}
			switch ((string) $this->getRequest()->getParam('act')) {
				case 'save':
					$this->saveGroup();
				break;
				case 'getAssigned':
					$this->getAssignedGroup();
				break;
				case 'getUnassigned':
					$this->getUnassignedGroup();
				break;
			}
		}
	}
	protected function saveGroup () {
		$nodes = $this->getRequest()->getParam('node');
		Doctrine_Query::create()->delete()->from('ScmUserGroup')->addWhere('user_id = ?', $this->user->id)->execute();
		foreach ($nodes as $node) {
			if (substr($node, 0, 1) == 'g') {
				$ug = new ScmUserGroup();
				$ug->user_id = $this->user->id;
				$ug->group_id = substr($node, 1);
				try {
					$ug->save();
				} catch (Exception $e) {
					//
				}
				unset($ug);
			}
		}
		echo Zend_Json::encode(array('success' => true));
	}
	protected function getUnassignedGroup () {
		// pega grupos dos quais o usuário não está
		$query = Doctrine_Query::create()->from('ScmGroup g')->addWhere('g.id NOT IN (SELECT ug.group_id FROM ScmUserGroup ug WHERE ug.user_id = ?)', $this->user->id);
		
		if(!DMG_Acl::canAccess(14)){
			$query = $query->addWhere('g.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
		}
 
		$query = $query->execute();
		$data = array();
		foreach ($query as $l) {
			if(!DMG_Acl::canAccess(14)){
                                $data[] = array(
                                                'id' => 'g' . $l->id,
                                                'text' => $l->name,
                                                'leaf' => true
                                               );
			} else {
				$data[] = array(
						'id' => 'g' . $l->id,
						'text' => $l->name.' - '.$l->ScaAccount->nome_account,
						'leaf' => true
					       );
			}
		}
		echo Zend_Json::encode($data);
	}
	protected function getAssignedGroup () {
		// pega grupos dos quais o usuário está
		$query = Doctrine_Query::create()->from('ScmUserGroup g')->addWhere('k.id = ?', $this->user->id)->innerJoin('g.ScmUser k');

		if(!DMG_Acl::canAccess(14)){
			$query = $query->addWhere('p.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->innerJoin('g.ScmGroup p');
		}

		$query = $query->execute();
		$data = array();
		foreach ($query as $l) {
			if(!DMG_Acl::canAccess(14)){
                                $data[] = array(
                                                'id' => 'g' . $l->ScmGroup->id,
                                                'text' => $l->ScmGroup->name,
                                                'leaf' => true
                                               );
			} else {
				$data[] = array(
						'id' => 'g' . $l->ScmGroup->id,
						'text' => $l->ScmGroup->name.' - '.$l->ScmGroup->ScaAccount->nome_account,
						'leaf' => true
					       );
			}
		}
		echo Zend_Json::encode($data);
	}
	public function empresaAction () {
		if (DMG_Acl::canAccess(37)) {
			$this->user = Doctrine::getTable('ScmUser')->find((int) $this->getRequest()->getParam('user'));
			if (!$this->user) {
				return;
			}
			switch ((string) $this->getRequest()->getParam('act')) {
				case 'save':
					$this->saveEmpresa();
				break;
				case 'getAssigned':
					$this->getAssignedEmpresa();
				break;
				case 'getUnassigned':
					$this->getUnassignedEmpresa();
				break;
			}
		}
	}
	protected function saveEmpresa () {
		$nodes = $this->getRequest()->getParam('node');
		Doctrine_Query::create()->delete()->from('ScmUserEmpresa')->addWhere('user_id = ?', $this->user->id)->execute();
		foreach ($nodes as $node) {
			if (substr($node, 0, 1) == 'e') {
				$ug = new ScmUserEmpresa();
				$ug->user_id = $this->user->id;
				$ug->id_empresa = substr($node, 1);
				try {
					$ug->save();
				} catch (Exception $e) {
					//
				}
				unset($ug);
			}
		}
		echo Zend_Json::encode(array('success' => true));
	}
	protected function getUnassignedEmpresa () {
		// pega grupos dos quais o usuário não está
		$query = Doctrine_Query::create()->from('ScmEmpresa e')->addWhere('e.id NOT IN (SELECT ue.id_empresa FROM ScmUserEmpresa ue WHERE ue.user_id = ?)', $this->user->id)->execute();
		$data = array();
		foreach ($query as $l) {
			$data[] = array(
				'id' => 'e' . $l->id,
				'text' => $l->nm_empresa,
				'leaf' => true
			);
		}
		echo Zend_Json::encode($data);
	}
	protected function getAssignedEmpresa () {
		// pega grupos dos quais o usuário está
		$query = Doctrine::getTable('ScmUserEmpresa')->findByUserId($this->user->id);
		$data = array();
		foreach ($query as $l) {
			$data[] = array(
				'id' => 'e' . $l->ScmEmpresa->id,
				'text' => $l->ScmEmpresa->nm_empresa,
				'leaf' => true
			);
		}
		echo Zend_Json::encode($data);
	}
}
