<?php

class ClientesController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function mostraresponsavelAction () {
                if(DMG_Acl::canAccess(3) and DMG_Acl::canAccess(17)){
                        $id = (int) $this->getRequest()->getParam('id');
                        $obj = Doctrine::getTable('ScaClientes')->find($id);
                
                        if($obj->sca_account_id == Zend_Auth::getInstance()->getIdentity()->sca_account_id){
                                $blah = $obj->id_responsavel;
                                if($blah == null)
                                        $blah = 0;
                                $this->_helper->json(array('success' => true, 'data' => $blah));
                        }
                } else {
                        $this->_helper->json(array('faliure' => true));
                }       
	}
	public function listAction () {
		if (DMG_Acl::canAccess(17)) {
			$order = $this->getRequest()->getParam('sort');
			$dir = $this->getRequest()->getParam('dir');
			$filtro = $this->getRequest()->getParam('query');

			$query = Doctrine_Query::create()->from('ScaClientes sd')
				->addSelect('sd.id')
				->addSelect('sd.cod_cliente as cod_cliente')
				->addSelect('sd.nome_cliente')
				->addSelect('sd.fl_acesso_portal')
				->addSelect('sd.dt_cadastro as data_criacao')
				->addSelect('(SELECT u1.nome_usuario FROM ScmUser u1 WHERE u1.id = sd.id) AS nm_criador')
				->addSelect('(SELECT u2.nome_usuario FROM ScmUser u2 WHERE u2.id = sd.id) AS responsavel')
			;
					
			if($filtro){
				$query->addWhere('sd.nome_cliente LIKE ?', $filtro . '%');
			}
			
			if($order && $dir){
				$query->orderBy("$order $dir");
			}

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
                                $answer[$pos]['data_criacao'] = $k->dt_cadastro;
                               
                                try {
                                        $place = Doctrine::getTable('ScmUser')->findById($k->id_criador);
                                        $answer[$pos]['nm_criador'] = $place[0]->nome_usuario;
                                } catch (exception $e) {
                                        $answer[$pos]['nm_criador'] = "";
                                }


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

			$this->_helper->json(array('success' => true, 'data' => $answer));
		}
	}
	public function getAction () {
		if (DMG_Acl::canAccess(17)) {
			$id = (int) $this->getRequest()->getParam('id');
			$obj = Doctrine::getTable('ScaClientes')->find($id);
			if($obj->fl_acesso_portal)
				$obj->fl_acesso_portal = 1;

			$return['id'] = $id;
			$return['cod_cliente'] = $obj->cod_cliente;
			$return['nome_cliente'] = $obj->nome_cliente;
			$return['id_responsavel'] = $obj->id_responsavel;
			
			if($obj->fl_acesso_portal)
				$return['portal'] = 1;
			else
				$return['portal'] = 0;

			$this->_helper->json(array('success' => true, 'data' => $return));
		}
	}
	public function saveAction () {
		if (DMG_Acl::canAccess(18)) {
			$id = (int) $this->getRequest()->getParam('id');

			$nome = $this->getRequest()->getParam('nome_cliente');
			$codigo = $this->getRequest()->getParam('cod_cliente');
			$responsavel = (int) $this->getRequest()->getParam('responsavel');
			$isAtivo = (int) $this->getRequest()->getParam('portal');
			$cliente = false;
			
			if($id) $cliente = Doctrine::getTable('ScaClientes')->find($id);
			
			
			if(($id == 0)||($cliente->nome_cliente != $nome)){
				$query = Doctrine_Query::create()
					->from('ScaClientes')
					->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
					->addWhere('nome_cliente = ?', $nome)
					->execute();
				if($query->count()>0){
					echo Zend_Json::encode(array('success' => false, 'errormsg' => DMG_Translate::_('controle.cliente.existe')));
					return;
				}
			}
			
			if(($id == 0)||($cliente->cod_cliente != $codigo)){
				$query = Doctrine_Query::create()
					->from('ScaClientes')
					->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
					->addWhere('cod_cliente = ?', $codigo)
					->execute();
				if($query->count()>0){
					echo Zend_Json::encode(array('success' => false, 'errormsg' => DMG_Translate::_('controle.cliente.cod.existe')));
					return;
				}
			}
			
			if(!$cliente){
				$cliente = new ScaClientes();
				$cliente->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
				$cliente->id_criador = Zend_Auth::getInstance()->getIdentity()->id;
				$cliente->dt_cadastro = DMG_Date::now();
			}

			$cliente->nome_cliente = $nome;
			$cliente->cod_cliente = $codigo;
			if($responsavel) $cliente->id_responsavel = $responsavel;
			$cliente->fl_acesso_portal = (bool)$isAtivo;

			try {
				$cliente->save();

				/*
				 * UPLOAD DA LOGOMARCA
				 */

				$upload = new Zend_File_Transfer_Adapter_Http();
				
				$info = @$upload->getFileInfo();
				
				$filename = 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . "/client_logo_" . $cliente->id;
							
				@$upload->addFilter('Rename', array(
					'target'=> $filename,
					'overwrite' => true
				),'logo');
				
				$upload->addValidator('IsImage', false, array('image/jpeg', 'image/gif', 'image/png'));
				
				if (!$upload->isValid()) {
					throw new Exception(DMG_Translate::_('administration.setting.form.upload.notimage'));
				}
				
				$upload->addValidator('ImageSize', false, array(
					'minwidth' => 1,
					'maxwidth' => 220,
					'minheight' => 1,
					'maxheight' => 52
				));
				
				if (!$upload->isValid()) {
					throw new Exception(DMG_Translate::_('administration.setting.form.upload.imagesizeinvalid'));
				}
				
				if(!$upload->receive()){
				    $erros = implode("<br />", $upload->getMessages());
					echo Zend_Json::encode(array('success' => false, 'errormsg'=>$erros));
				}
				
				
			} catch (exception $e) {
				echo Zend_Json::encode(array('success' => false, 'errormsg' => $e->getMessage()));
				return;
			}
			echo Zend_Json::encode(array('success' => true));
		} else {
			echo Zend_Json::encode(array('success' => false, 'errormsg' => DMG_Translate::_('administration.group.permission.denied')));
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
                                $this->_helper->json(array('success' => true));
                        } catch (Exception $e) {
                                Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
                                $this->_helper->json(array('failure' => true, 'message' => DMG_Translate::_('administration.group.form.cannotdelete')));
			}
		} else {
			$this->_helper->json(array('success' => false));
		}
	}
	private function deleteClientes ($id) {
                $cli = Doctrine::getTable('ScaClientes')->find($id);
		$usr_cli = Doctrine::getTable('ScmUser')->findByScaClientesId($cli->id);

		

		foreach( $usr_cli as $l){
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

			$this->_helper->json(array('success' => true, 'data' => $answer));
                } else {
                        $this->_helper->json(array('success' => false));
                }
        }

	public function listcliuserAction(){
		$id = (int) $this->getRequest()->getParam('id');

		$query = Doctrine_Query::create()->select()->from('ScmUser g')->Where('g.sca_clientes_id = ?', $id)->addWhere('tipo_usuario = \'P\'');
		
		$sort = $this->getRequest()->getParam('sort');
		$dir = $this->getRequest()->getParam('dir');
		
		if(strlen($sort)>0) $query->orderBy($sort . " " . $dir);
		
		if(!DMG_Acl::canAccess(14)){
			$query = $query->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
		}

		try {
			$array = $query->execute();
			$loop = 0;
			$answer = array();

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

			$this->_helper->json(array('success' => true, 'data' => $answer));
		} catch (exception $e) {
			$this->_helper->json(array('success' => false));
		}
	}

        private function delete_user_cli ($id){
                $row = Doctrine::getTable('ScmUser')->find((int)$id);
                if(!$row)
                        return false;
                if($row->sca_account_id == Zend_Auth::getInstance()->getIdentity()->sca_account_id && $row->tipo_usuario == 'P'){
                        try {
                                $row->delete();
                                return true;
                        } catch (exception $e) {
                                return false;
                        }
                } else {
			return false;
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
			$this->_helper->json(array('success' => true));
		else
			$this->_helper->json(array('faliure' => true, 'data' => DMG_Translate::_('administration.user.form.cannotdelete')));
	}
}
