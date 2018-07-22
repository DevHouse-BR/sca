<?php

class DepartamentosController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listAction () {
		if (DMG_Acl::canAccess(15)) {
			$order = $this->getRequest()->getParam('sort');
			$dir = $this->getRequest()->getParam('dir'); 

			if(DMG_Acl::canAccess(14)) {
				//NAO ATUALIZADO... (esta parte do if contem codigo legado...)
/*
				$table = Doctrine::getTable('ScaDepartamentos')->findAll();
				$answer = array();				
				$number=0;

				foreach($table as $k){
					$answer[$number]['id'] = $k->id;
					$answer[$number]['cod_dpto'] = $k->cod_departamento;
					$answer[$number]['nm_dpto'] = $k->nome_departamento;
					$answer[$number]['nm_account'] = $k->ScaAccount->nome_account;
					$answer[$number]['data_criacao'] = $k->dt_criacao;

					try {
						$place = Doctrine::getTable('ScmUser')->findById($k->id_criador);
						$answer[$number]['nm_criador'] = $place[0]->nome_usuario;
					} catch (exception $e) {
						$answer[$number]['nm_criador'] = "";
					}
				
					try {
						$place = Doctrine::getTable('ScmUser')->findById($k->id_gerente);
						$answer[$number]['nm_gerente'] = $place[0]->nome_usuario;

						if($answer[$number]['nm_gerente'] == NULL)
							$answer[$number]['nm_gerente'] = 'N/A';
					} catch (exception $e) {
						$answer[$number]['nm_gerente'] = 'N/A';
					}

					$number++;
				} 

				echo Zend_Json::encode(array('success' => true, 'data' => $answer)); */
			} else {
				$table = Doctrine_Query::create()->from('ScaDepartamentos sd')
					->addSelect('sd.id')
					->addSelect('sd.cod_departamento as cod_dpto')
					->addSelect('sd.nome_departamento as nm_dpto')
					->addSelect("to_char(sd.dt_criacao, 'YYYY-MM-DD HH:MI:SS') as dt_criacao")
					->addSelect('(SELECT u1.nome_usuario FROM ScmUser u1 WHERE u1.id = sd.id) AS nm_criador')
					->addSelect('(SELECT u2.nome_usuario FROM ScmUser u2 WHERE u2.id = sd.id) AS nm_gerente')
					->addWhere('sd.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
				;
				
				if($order and $dir){
					$table->orderBy("$order $dir");
				}

				$table = $table->execute();

                                $answer = array();
                                $number=0;

                                foreach($table as $k){
                                        $answer[$number]['id'] = $k->id;
                                        $answer[$number]['cod_dpto'] = $k->cod_departamento;
                                        $answer[$number]['nm_dpto'] = $k->nome_departamento;
                                        $answer[$number]['data_criacao'] = $k->dt_criacao;

                                        try {
                                                $place = Doctrine::getTable('ScmUser')->findById($k->id_criador);
                                                $answer[$number]['nm_criador'] = $place[0]->nome_usuario;
                                        } catch (exception $e) {
                                                $answer[$number]['nm_criador'] = "";
                                        }

                                        try {
                                                $place = Doctrine::getTable('ScmUser')->findById($k->id_gerente);
                                                $answer[$number]['nm_gerente'] = $place[0]->nome_usuario;

						if($answer[$number]['nm_gerente'] == NULL)
							$answer[$number]['nm_gerente'] = '';
                                        } catch (exception $e) {
                                                $answer[$number]['nm_gerente'] = '';
                                        }

                                        $number++;
                                }

				$this->_helper->json(array('success' => true, 'data' => $answer));
			}
		} else {
			$this->_helper->json(array('success' => false));
		}
	}
	public function listusersAction() {
		$answer = array();
		if(DMG_Acl::canAccess(3)){
			$table = Doctrine_Query::create()->from('ScmUser')			
			->where('tipo_usuario = ?', "I")
			->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
			->execute();
			
			
			$loop=0;				

			foreach($table as $l){
				//if($l->tipo_usuario == "I") {
					$answer[$loop]['id'] = $l->id;
					$answer[$loop]['name'] = $l->nome_usuario;

					$loop++;
				//}
			}

			if($answer === null)
				$answer = "";
		}
		$this->_helper->json(array('success' => true, 'data' => $answer));
	}
	public function getAction () {
		if (DMG_Acl::canAccess(16)) {
			$obj;
			$return;
			if(DMG_Acl::canAccess(14)){
				$obj = DMG_Crud::get( 'ScaDepartamentos', (int) $this->getRequest()->getParam('id') );
				$return['account'] = $obj->ScaAccount->nome_account;
			} else {
				$obj = DMG_Crud::accGet( 'ScaDepartamentos', (int) $this->getRequest()->getParam('id') );	
			}
		
			if($obj === NULL){
				$this->_helper->json(array('success' => false));
				return;
			}
					
			$return['name'] = $obj->nome_departamento;
			$return['cod'] = $obj->cod_departamento;
			$return['id'] = $obj->id;

			$this->_helper->json(array('success' => true, 'data' => $return));
//			echo DMG_Crud::get('ScmGroup', (int) $this->getRequest()->getParam('id'));
		}
	}
	public function deleteAction () {
		if (DMG_Acl::canAccess(16)) {
			$id = $this->getRequest()->getParam('id');
			try {
				Doctrine_Manager::getInstance()->getCurrentConnection()->beginTransaction();
				if (is_array($id)) {
					foreach ($id as $k) {
						$this->deleteDepartamento($k);
					}
				} else {
					$this->deleteDepartamento($id);
				}
				Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
				$this->_helper->json(array('success' => true));
			}
			catch (Exception $e) {
				Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
				//$this->_helper->json(array('failure' => true, 'message' => DMG_Translate::_('departamento.cannotdelete')));
				$this->_helper->json(array('failure' => true, 'message' => $e->getMessage()));
			}
		}
	}
	protected function deleteDepartamento ($id) {
		$users = Doctrine::getTable('ScmUser')->findByScaDepartamentosId($id);
		if($users->count()>0) throw new Exception(DMG_Translate::_('departamento.cannotdelete.users'));
		else{		
			$group = Doctrine::getTable('ScaDepartamentos')->find($id);
			$group->delete();
		}
	}
	public function saveAction () {
		if (DMG_Acl::canAccess(18)) {
			$id = (int) $this->getRequest()->getParam('id');
			
			$nome_departamento = $this->getRequest()->getParam('name');
			$codigo = $this->getRequest()->getParam('cod');
			$id_gerente = $this->getRequest()->getParam('listUser');
			$cliente = false;
		
			$departamento = false;
	
			if($id) $departamento = Doctrine::getTable('ScaDepartamentos')->find($id);
			
			if(($id == 0)||($departamento->nome_departamento != $nome_departamento)){
				$query = Doctrine_Query::create()
					->from('ScaDepartamentos')
					->addWhere('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
					->addWhere('nome_departamento = ?', $nome_departamento)
					->execute();
				if($query->count()>0){
					$this->_helper->json(array('success' => false, 'errormsg' => DMG_Translate::_('departamento.form.departamento.existe')));
					return;
				}
			}

			if(!$departamento){
				$departamento = new ScaDepartamentos();
				$departamento->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
				$departamento->id_criador = Zend_Auth::getInstance()->getIdentity()->id;
				$departamento->dt_criacao = DMG_Date::now();
			}

			$departamento->nome_departamento = $nome_departamento;
			$departamento->cod_departamento = $codigo;
			if($id_gerente) $departamento->id_gerente = $id_gerente; else $departamento->id_gerente = null;

			try {
				$departamento->save();
			} catch (exception $e) {
				if(strstr($e->getMessage(), $this->getRequest()->getParam('listUser')))
					$this->_helper->json(array('success' => false, 'errormsg' => DMG_Translate::_('departamento.form.departamento.invalidUser') ));
				else
					$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage() ));
				return;
			}
			$this->_helper->json(array('success' => true));
		} else {
			$this->_helper->json(array('success' => false, 'errormsg' => DMG_Translate::_('administration.group.permission.denied')));
		}
	}
	public function permissionAction () {
		if (DMG_Acl::canAccess(11)) {
			$this->group = Doctrine::getTable('ScmGroup')->find((int) $this->getRequest()->getParam('group'));
			if (!$this->group) {
				return;
			}
			switch ((string) $this->getRequest()->getParam('act')) {
				case 'save':
					$this->save();
				break;
				case 'getAssigned':
					$this->getAssigned();
				break;
				case 'getUnassigned':
					$this->getUnassigned();
				break;
			}
		}
	}
	protected function save () {
		$nodes = $this->getRequest()->getParam('node');
		Doctrine_Query::create()->delete()->from('ScmGroupRule')->addWhere('group_id = ?', $this->group->id)->execute();
		foreach ($nodes as $node) {
			if (substr($node, 0, 1) == 'p') {
				$pr = new ScmGroupRule();
				$pr->group_id = $this->group->id;
				$pr->rule_id = substr($node, 1);
				try {
					$pr->save();
				} catch (Exception $e) {
					//
				}
				unset($pr);
			}
		}
		$this->_helper->json(array('success' => true));
	}
	protected function getUnassigned () {
		$grouprule = array();
		foreach (Doctrine::getTable('ScmGroupRule')->findByGroupId($this->group->id) as $k) {
			if($k->rule_id != 14 || DMG_Acl::canAccess(14)) //permissao de gerenciar accounts
				$grouprule[] = $k->rule_id;
		}
		$rule = array();
		foreach (Doctrine::getTable('ScmRule')->findAll() as $k) {
			if($k->id != 14 || DMG_Acl::canAccess(14)) //permicao de gerenciar accounts
				$rule[] = $k->id;
		}
		$diff = array_diff($rule, $grouprule);
		if(empty($diff)) {
			$diff[] = 0;
		}
		$data = array();
		$modules = Doctrine::getTable('ScmModule')->findAll();
		if (!$modules) {
			return;
		}
		foreach ($modules as $k) {
			$children = array();
			foreach (Doctrine_Query::create()->from('ScmRule')->addWhere('module_id = ?', $k->id)->whereIn('id', $diff)->orderBy('name ASC')->execute() as $l) {
				$children[] = array(
					'id' => 'p' . $l->id,
					'text' => $l->name,
					'leaf' => true
				);
			}
			if (count($children)) {
				$data[] = array(
					'id' => 'm' . $k->id,
					'text' => $k->name,
					'iconCls' => true,
					'children' => $children
				);
			}
		}
		$this->_helper->json($data);
	}
	protected function getAssigned () {
		$grouprule = array();
		foreach (Doctrine::getTable('ScmGroupRule')->findByGroupId($this->group->id) as $k) {
			if($k->rule_id != 14 || DMG_Acl::canAccess(14))
				$grouprule[] = $k->rule_id;
		}
		if (empty($grouprule)) {
			$grouprule[] = 0;
		}
		$data = array();
		$modules = Doctrine::getTable('ScmModule')->findAll();
		if (!$modules) {
			return;
		}
		foreach ($modules as $k) {
			$children = array();
			foreach (Doctrine_Query::create()->from('ScmRule')->addWhere('module_id = ?', $k->id)->whereIn('id', $grouprule)->orderBy('name ASC')->execute() as $l) {
				$children[] = array(
					'id' => 'p' . $l->id,
					'text' => $l->name,
					'leaf' => true
				);
			}
			if (count($children)) {
				$data[] = array(
					'id' => 'm' . $k->id,
					'text' => $k->name,
					'iconCls' => true,
					'expand' => true,
					'children' => $children
				);
			}
		}
		$this->_helper->json($data);
	}
}
