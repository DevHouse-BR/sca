<?php

class ConfigController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listAction () {
		if (DMG_Acl::canAccess(1)) {
			echo DMG_Crud::index('ScmConfig', 'id, name, value, system');
		}
	}
	public function getAction () {
		if (DMG_Acl::canAccess(2)) {
			$id = (int) $this->getRequest()->getParam('id');
			$obj = Doctrine::getTable('ScmConfig')->find($id);
			if ($obj) {
				$this->_helper->json(array('success' => true, 'data' => $obj->toArray()));
			}
		}
	}
	public function saveAction () {
		if (DMG_Acl::canAccess(2)) {
			echo DMG_Crud::save('ScmConfig', (int) $this->getRequest()->getParam('id'), array('value'));
		}
	}
	
	public function getmultipleAction () {
		$data = array();

		/*$canAccess = false;
		
		if(DMG_Acl::canAccess(1)){
			$canAccess = true;
		} else if(Zend_Auth::getInstance()->hasIdentity()) {
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == 'P') {
				$canAccess = true;
			}
		}

		if($canAccess) {*/
			$query = Doctrine_Query::create()
				->select('id')
				->addSelect('value')
				->from('ScmConfig')
				->whereIn('id', $this->getRequest()->getParam('id'));
			
			foreach ($query->execute() as $k) {
				$data[(int)$k->id] = $k->value;
			}
		//}
		$this->_helper->json($data);
	}
	
	public function getaccountcfgAction () {
		$data = array();
		$acess = false;

		if(Zend_Auth::getInstance()->hasIdentity()) {
			$query = Doctrine_Query::create()
				->select('sca_account_config_id')
				->addSelect('valor_parametro')
				->from('ScaAccountRelationConfig')
				->where('sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
				->orderBy('sca_account_config_id ASC');
			
			foreach ($query->execute() as $k) {
				$data[(int)$k->sca_account_config_id] = $k->valor_parametro;
			}
		}
		$this->_helper->json($data);
	}
	
	
}
