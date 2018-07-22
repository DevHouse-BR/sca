<?php

class ClientesController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listAction () {
		if (DMG_Acl::canAccess(17)) {
			$query = DMG_Crud::rawIndex('ScaClientes', 'id, cod_cliente, nome_cliente, id_responsavel, fl_acesso_portal');

			if(!(DMG_Acl::canAccess(14)))
				$query->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);

			$query = $query->execute();
	
			$answer;
			$pos=0;			

			foreach($query as $k){
				$answer[$pos]['id'] = $k->id;
				$answer[$pos]['cod_cliente'] = $k->cod_cliente;
				$answer[$pos]['nome_cliente'] = $k->nome_cliente;
				$answer[$pos]['fl_acesso_portal'] = $k->fl_acesso_portal;

				if(DMG_Acl::canAccess(14)){
					$answer[$pos]['nome_account'] = $k->ScaAccount->nome_account;
				}

				$responsavelID = $k->id_responsavel;

				if($responsavelID != 0){
					try {
						$resp = Doctrine::getTable('ScmUser')->find($responsavelID);
						$answer[$pos]['responsavel'] = $resp->nome_usuario;
					} catch (exception $e) {
						$answer[$pos]['responsavel'] = 'N/A';
					}
				} else {
					$answer[$pos]['responsavel'] = 'N/A';
				}

				$pos++;	
			}

			echo Zend_Json::encode(array('success' => true, 'data' => $answer));
		}
	}
	public function getAction () {
		if (DMG_Acl::canAccess(17)) {
			$id = (int) $this->getRequest()->getParam('id');
			$obj = Doctrine::getTable('ScaClientes')->find($id);
			if ($obj) {
				echo Zend_Json::encode(array('success' => true, 'data' => $obj->toArray()));
			}
		}
	}
	public function saveAction () {
		if (DMG_Acl::canAccess(18)) {
			$id = (int) $this->getRequest()->getParam('id');

			$nome = $this->getRequest()->getParam('nome_cliente');
			$codigo = $this->getRequest()->getParam('cod_cliente');
			$responsavel = $this->getRequest()->getParam('responsavel');
			$isAtivo = (int) $this->getRequest()->getParam('portal');

			$salvar = Doctrine::getTable('ScaClientes')->find($id);

			if(!$salvar){
				$salvar = new ScaClientes();
				$salvar->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			}

			$salvar->nome_cliente = $nome;
			$salvar->cod_cliente = $codigo;
			$salvar->id_responsavel = $responsavel;
			$salvar->fl_acesso_portal = (bool)$isAtivo;

			try {
				$salvar->save();
			} catch (exception $e) {
				echo Zend_Json::encode(array('success' => false));
				return;
			}
			echo Zend_Json::encode(array('success' => true));
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
	public function deleteAction () {
		if (DMG_Acl::canAccess(18)){
                        $id = $this->getRequest()->getParam('id');
                        try {
                                Doctrine_Manager::getInstance()->getCurrentConnection()->beginTransaction();
                                if (is_array($id)) {
                                        foreach ($id as $k) {
                                                $this->deleteClientes($k);
                                        }
                                } else {
                                        $this->deleteClientes($id);
                                }
                                Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
                                echo Zend_Json::encode(array('success' => true));
                        } catch (Exception $e) {
                                Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
                                echo Zend_Json::encode(array('failure' => true, 'message' => DMG_Translate::_('administration.group.form.cannotdelete')));
			}
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
	private function deleteClientes ($id) {
                $cli = Doctrine::getTable('ScaClientes')->find($id);

		foreach( $cli->ScmUser as $l){
			$l->delete();
		}

		$cli->delete();
	}
        public function listusersAction() {
                if(DMG_Acl::canAccess(3)){
			$table = Doctrine::getTable('ScmUser')->findAll();
			$answer;
			$loop=0;

			foreach($table as $l){
				if($l->tipo_usuario == "I") {
					if(!DMG_Acl::canAccess(14)){
						if($l->sca_account_id != Zend_Auth::getInstance()->getIdentity()->sca_account_id)
							continue;
					} else {
						$answer[$loop]['account'] = $l->ScaAccount->nome_account;
					}

					$answer[$loop]['id'] = $l->id;
					
					if(!DMG_Acl::canAccess(14))					
						$answer[$loop]['name'] = $l->nome_usuario;
					else
						$answer[$loop]['name'] = $l->nome_usuario." - ".$l->ScaAccount->nome_account;

					$loop++;
				}
			}
	
			if($answer === null)
				$answer = "";

			echo Zend_Json::encode(array('success' => true, 'data' => $answer));
                } else {
                        echo Zend_Json::encode(array('success' => false));
                }
        }

	public function listcliuserAction(){
		$id = (int) $this->getRequest()->getParam('id');

		$query = Doctrine_Query::create()->select()->from('ScmUser g')->Where('g.sca_clientes_id = ?', $id)->addWhere('tipo_usuario = \'P\'');

		if(!DMG_Acl::canAccess(14)){
			$query = $query->addWhere('sca_departamentos_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
		}

		try {
			$array = $query->execute();
			$loop = 0;
			$answer;

			foreach($array as $p){
				$answer[$loop]['id'] = $p->id;
				$answer[$loop]['nome_usuario'] = $p->nome_usuario;
				$answer[$loop]['login_usuario'] = $p->login_usuario;
				$answer[$loop]['email'] = $p->email;
				$answer[$loop]['idioma_usuario'] = $p->idioma_usuario;
				$answer[$loop]['recebe_mensagem'] = $p->recebe_mensagem;
				
				$loop++;
			}
		
			if($answer === null)
				$answer = "";

			echo Zend_Json::encode(array('success' => true, 'data' => $answer));
		} catch (exception $e) {
			echo Zend_Json::encode(array('success' => false));
		}
	}

        private function delete_user_cli ($id){
                $row = Doctrine::getTable('ScmUser')->find($id);
                if(!$row)
                        return false;
                if($row->sca_account_id != Zend_Auth::getInstance()->getIdentity()->sca_account_id && $row->tipo_usuario == 'P'){
                        try {
                                $row->delete();
                                return true;
                        } catch (exception $e) {
                                return false;
                        }
                }
        }

	public function deleteuserclienteAction(){
		$id = $this->getRequest()->getParam('id');

		$allOk = true;

		if(is_array($id)){
			foreach($id as $l){
				if ( $this->delete_user_cli($l) === false )
					$allOk = false;
			}
		} else {
			$allOk = $this->delete_user_cli($id);
		}

		if($allOk)
			echo Zend_Json::encode(array('success' => true));
		else
			echo Zend_Json::encode(array('faliure' => true, 'data' => DMG_Translate::_('administration.user.form.cannotdelete')));
	}
}
