<?php

class DepartamentosController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listAction () {
		if (DMG_Acl::canAccess(15)) {
			if(DMG_Acl::canAccess(14)) {
				$table = Doctrine::getTable('ScaDepartamentos')->findAll();
				$answer = array();				
				$number=0;

				foreach($table as $k){
					$answer[$number]['id'] = $k->id;
					$answer[$number]['cod_dpto'] = $k->cod_departamento;
					$answer[$number]['nm_dpto'] = $k->nome_departamento;
					$answer[$number]['nm_account'] = $k->ScaAccount->nome_account;
					
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

				echo Zend_Json::encode(array('success' => true, 'data' => $answer));
			} else {
				$table = Doctrine_Query::create()->select()->from('ScaDepartamentos sd')->where('sd.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id )->orderBy('id ASC')->execute();

                                $answer = array();
                                $number=0;

                                foreach($table as $k){
                                        $answer[$number]['id'] = $k->id;
                                        $answer[$number]['cod_dpto'] = $k->cod_departamento;
                                        $answer[$number]['nm_dpto'] = $k->nome_departamento;

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

				echo Zend_Json::encode(array('success' => true, 'data' => $answer));
			}
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
	public function listusersAction() {
		if(DMG_Acl::canAccess(3)){
			$id = $this->getRequest()->getParam('id');
			if($id == 0 ) {
				echo Zend_Json::encode(array('success' => true, 'data' => ""));
			} else {
				$table = Doctrine::getTable('ScmUser')->findByScaDepartamentosId($id);
				$answer;
				$loop=0;				

				foreach($table as $l){
					if($l->tipo_usuario == "I") {
						$answer[$loop]['id'] = $l->id;
						$answer[$loop]['name'] = $l->nome_usuario;
	
						$loop++;
					}
				}

				if($answer === null)
					$answer = "";

				echo Zend_Json::encode(array('success' => true, 'data' => $answer));
			}
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
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
				echo Zend_Json::encode(array('success' => false));
				return;
			}
					
			$return['name'] = $obj->nome_departamento;
			$return['cod'] = $obj->cod_departamento;
			$return['id'] = $obj->id;

			echo Zend_Json::encode(array('success' => true, 'data' => $return));
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
				echo Zend_Json::encode(array('success' => true));
			} catch (Exception $e) {
				Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
				echo Zend_Json::encode(array('failure' => true, 'message' => DMG_Translate::_('administration.group.form.cannotdelete')));
			}
		}
	}
	protected function deleteDepartamento ($id) {
		$group = Doctrine::getTable('ScaDepartamentos')->find($id);
		for ($i = 0; $i < count($group->ScmUser); $i++) {
			$group->ScmUser[$i]->delete();
		}
		$group->delete();
	}
	public function saveAction () {
		$id = (int) $this->getRequest()->getParam('id');
		if ($id > 0) {
			if (DMG_Acl::canAccess(16)) {
				$obj = Doctrine::getTable('ScaDepartamentos')->find($id);
				if ($obj && ( ( $obj->sca_account_id == Zend_Auth::getInstance()->getIdentity()->sca_account_id ) or (DMG_Acl::canAccess(14))) ) {
					$obj->nome_departamento = $this->getRequest()->getParam('name');
					$obj->cod_departamento = $this->getRequest()->getParam('cod');
					$obj->id_gerente = $this->getRequest()->getParam('listUser');
					if(DMG_Acl::canAccess(14))
						$obj->sca_account_id = $this->getRequest()->getParam('accountD');
					try {
						$obj->save();
						echo Zend_Json::encode(array('success' => true));
					} catch (Exception $e) {
						echo Zend_Json::encode(array('success' => false));
					}
				} else {
					echo Zend_Json::encode(array('success' => false));
				}
			}
		} else {
			if (DMG_Acl::canAccess(16)) {
				$obj = new ScaDepartamentos();
				$obj->nome_departamento = $this->getRequest()->getParam('name');
			
				if(DMG_Acl::canAccess(14))
					$obj->sca_account_id = $this->getRequest()->getParam('accountD');
				else
					$obj->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;

				$obj->cod_departamento = $this->getRequest()->getParam('cod');
				try {
					$obj->save();
					echo Zend_Json::encode(array('success' => true));
				} catch (Exception $e) {
					echo Zend_Json::encode(array('success' => false));
				}
			}
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
		echo Zend_Json::encode(array('success' => true));
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
		echo Zend_Json::encode($data);
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
		echo Zend_Json::encode($data);
	}
}
