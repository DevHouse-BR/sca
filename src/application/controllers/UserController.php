<?php

class UserController extends Zend_Controller_Action {
	
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	
	public function gerenteselAction () {
		if(DMG_Acl::canAccess(3) and DMG_Acl::canAccess(15)){
			$id = (int) $this->getRequest()->getParam('id');
			$obj = Doctrine::getTable('ScaDepartamentos')->find($id);
			if($obj->sca_account_id ==  Zend_Auth::getInstance()->getIdentity()->sca_account_id){
				$blah = $obj->id_gerente;
				
				if($blah == null)
				$blah = 0;
				$this->_helper->json(array('success' => true, 'data' => $blah));
			}
		}
		else {
			$this->_helper->json(array('faliure' => true));
		}
	}
	
	public function userdeptAction () {
		if (DMG_Acl::canAccess(3) and DMG_Acl::canAccess(15)){
			$id = (int) $this->getRequest()->getParam('id');
			$obj = Doctrine::getTable('ScmUser')->find($id);
			
			if($obj->sca_account_id ==  Zend_Auth::getInstance()->getIdentity()->sca_account_id){
				$this->_helper->json(array('success' => true, 'data' => $obj->sca_departamentos_id));
			}
		}
		else {
			$this->_helper->json(array('faliure' => true));
		}
	}
	
	public function listAction () {
		$answer = array();
		if (DMG_Acl::canAccess(3)) {
			$order = $this->getRequest()->getParam('sort');
			$dir = $this->getRequest()->getParam('dir');
			
			$query = Doctrine_Query::create()->select()->from('ScmUser su')->Where('su.tipo_usuario = \'I\'');
			
			$query  ->addSelect('su.id')
			->addSelect('su.nome_usuario')
			->addSelect('su.login_usuario')
			->addSelect('su.email')
			->addSelect('su.idioma_usuario')
			->addSelect('su.fl_status')
			->addSelect('su.recebe_mensagem')
			->addSelect('(SELECT d1.nome_departamento FROM ScaDepartamentos d1 WHERE d1.id = su.id) AS nome_departamento')
			;
			
			if($order and $dir){
			$query->orderBy("$order $dir");
			}
			
			if(!DMG_Acl::canAccess(14))
			$query = $query->addWhere('su.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
			
			$query = $query->execute();
			
			$loop = 0;
			
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
		}
		$this->_helper->json(array('success' => true, 'data' => $answer));
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
					$send['recebe_msg'] = 'on';
				else
					$send['recebe_msg'] = 0;
				
				$send["idioma_usuario"] = $obj->idioma_usuario;
				
				$this->_helper->json(array('success' => true, 'data' => $send));
			}
		}
	}
	
	public function accountslistAction () {
		if (DMG_Acl::canAccess(14)){
			$obj = Doctrine::getTable('ScaAccount');
			if($obj){
				$obj = $obj->findAll();
				$place =0;
				$blah = array();
				foreach($obj as $k){
					$blah[$place]['name'] = $k['nome_account'];
					$blah[$place]['id'] = $k['id'];
					$place++;
				}
				$this->_helper->json(array('success' => true, 'data' => $blah));
			} else {
				$this->_helper->json(array('success' => false));
			}
		} else {
			$this->_helper->json(array('success' => false));
		}
	}
	
	public function departamentoslistAction () {
		if (DMG_Acl::canAccess(13)){
			$obj = Doctrine::getTable('ScaDepartamentos');
			if ($obj) {
				if(DMG_Acl::canAccess(14)){
					$obj = $obj->findAll();
				} 
				else {
					$obj = Doctrine_Query::create()->from('ScaDepartamentos')->addWhere('acc.id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->innerJoin('ScaDepartamentos.ScaAccount acc')->execute()->toArray();
				}
				$sendObj = array();
				$place = 0;
				foreach($obj as $o){
					$sendObj[$place]['name'] = $o['nome_departamento'];
					$sendObj[$place]['id'] = $o['id'];
					$place++;
				}
				$this->_helper->json(array('success' => true, 'data' => $sendObj));
			} else {
				$this->_helper->json(array('success' => false));
			}
		}
	}
	
	public function saveAction(){
		try {
			$id = (int) $this->getRequest()->getParam('id');
			$nome_usuario = $this->getRequest()->getParam('name');
			$login_usuario = $this->getRequest()->getParam('username');
			$email = $this->getRequest()->getParam('email');
			$fl_status = (int)$this->getRequest()->getParam('status');
			$senha_usuario = $this->getRequest()->getParam('password');
			$sca_departamentos_id = $this->getRequest()->getParam('departamento');
			$idioma_usuario = (strlen($this->getRequest()->getParam('idioma_usuario')) ? $this->getRequest()->getParam('idioma_usuario') : null);
			$recebe_mensagem = $this->getRequest()->getParam('recebe_msg');
			$id_cliente = (int) $this->getRequest()->getParam('idcliente');
			if($id_cliente) $tipo_usuario = 'P';
			else $tipo_usuario ='I';
			
			$query = Doctrine_Query::create()
					->select('id')
					->from('ScmUser su')
					->where('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
					->addWhere('login_usuario = ?', $login_usuario);
					
			if ($id > 0) $query->addWhere('id <> ?', $id);
			
			$query->execute();
			
			if($query->count()>0)
				throw new DMG_FormException(DMG_Translate::_('groups.error.exists'), array('field'=>'username', 'message'=> DMG_Translate::_('groups.error.exists')));
			
			
			/*$query = Doctrine_Query::create()
					->select('id')
					->from('ScmUser su')
					->where('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
					->addWhere('email = ?', $email);
					
			if ($id > 0) $query->addWhere('id <> ?', $id);
			
			$query->execute();
			
			if($query->count()>0)
				throw new DMG_FormException(DMG_Translate::_('administration.user.form.email.existe'), array('field'=>'email', 'message'=> DMG_Translate::_('administration.user.form.email.existe')));
			*/
			$validator = new Zend_Validate_EmailAddress();
			if (!$validator->isValid($email)) {
				throw new DMG_FormException(DMG_Translate::_('administration.user.form.email.invalidsyntax'), array('field'=>'email', 'message'=> DMG_Translate::_('administration.user.form.email.invalidsyntax')));
			}

			if ($id > 0){
				$obj = Doctrine::getTable('ScmUser')->find($id);
			}
			else{
				$obj = new ScmUser();
			}
			
			$obj->nome_usuario = $nome_usuario;
			$obj->login_usuario = $login_usuario;
			$obj->email = $email;
			$obj->fl_status = $fl_status;
			$obj->senha_usuario = $senha_usuario;
			$obj->fl_system = false;
			$obj->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$obj->tipo_usuario = $tipo_usuario;
			$obj->recebe_mensagem = $recebe_mensagem;
			
			if(strlen($sca_departamentos_id)>0)	$obj->sca_departamentos_id = $sca_departamentos_id;
			if(strlen($idioma_usuario)>0) $obj->idioma_usuario = $idioma_usuario;
			if($id_cliente) $obj->sca_clientes_id = $id_cliente;
			
			$obj->save();
			$this->_helper->json(array('success' => true));
		}
		catch(DMG_FormException $e){
			$this->_helper->json($e->getErrors());
		}
		catch(Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
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
					$this->_helper->json(array('success' => true));
				else
					$this->_helper->json(array('success' => false, 'errormsg' => DMG_Translate::_('administration.user.form.cannotdelete')));
			} catch (Exception $e) {
				Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
				$this->_helper->json(array('sucess' => true, 'errormsg' => DMG_Translate::_('administration.user.form.cannotdelete')));
			}
		}
	}
	
	protected function deleteUser ($id) {
		$user = Doctrine::getTable('ScmUser')->find($id);
		if($user->fl_system) return false;
		
		$responsavel = Doctrine_Query::create()
			->select('id')
			->from('ScaClientes')
			->where('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
			->addWhere('id_responsavel = ?', $id)
			->execute();
		if($responsavel->count()>0) return false;
		
		for ($i = 0; $i < count($user->ScmUserGroup); $i++) {
			$user->ScmUserGroup[$i]->delete();
		}
		$user->delete();
		return true;
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
		$this->_helper->json(array('success' => true));
	}
	
	protected function getUnassignedGroup () {
		// pega grupos dos quais o usuario nao faz parte
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
			} 
			else {
				$data[] = array(
					'id' => 'g' . $l->id,
					'text' => $l->name.' - '.$l->ScaAccount->nome_account,
					'leaf' => true
				);
			}
		}
		$this->_helper->json($data);
	}
	
	protected function getAssignedGroup () {
		// pega grupos dos quais o usuario esta inscrito
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
			}
			else {
				$data[] = array(
					'id' => 'g' . $l->ScmGroup->id,
					'text' => $l->ScmGroup->name.' - '.$l->ScmGroup->ScaAccount->nome_account,
					'leaf' => true
				);
			}
		}
		$this->_helper->json($data);
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
		$this->_helper->json(array('success' => true));
	}
	
	protected function getUnassignedEmpresa () {
		// pega grupos dos quais o usu�rio n�o est�
		$query = Doctrine_Query::create()->from('ScmEmpresa e')->addWhere('e.id NOT IN (SELECT ue.id_empresa FROM ScmUserEmpresa ue WHERE ue.user_id = ?)', $this->user->id)->execute();
		$data = array();
		foreach ($query as $l) {
			$data[] = array(
				'id' => 'e' . $l->id,
				'text' => $l->nm_empresa,
				'leaf' => true
			);
		}
		$this->_helper->json($data);
	}
	
	protected function getAssignedEmpresa () {
		// pega grupos dos quais o usu�rio est�
		$query = Doctrine::getTable('ScmUserEmpresa')->findByUserId($this->user->id);
		$data = array();
		foreach ($query as $l) {
			$data[] = array(
				'id' => 'e' . $l->ScmEmpresa->id,
				'text' => $l->ScmEmpresa->nm_empresa,
				'leaf' => true
			);
		}
		$this->_helper->json($data);
	}
	
}
