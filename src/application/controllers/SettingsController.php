<?php

class SettingsController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listAction () {
		{ //escopo de attualizacao (se nessesario)
			$listedAll = array();
			$listedThis = array();
			$loop1=0;
			$loop2=0;

			$query = Doctrine_Query::create()->select()->from('ScaAccountRelationConfig arc')->where('arc.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->execute();
			foreach($query as $p){
				$listedThis[$loop1]=$p->ScaAccountConfig->id;
				$loop1++;
			}
			$query2 = Doctrine::getTable('ScaAccountConfig')->findAll();	
			foreach($query2 as $x){
				$listedAll[$loop2]=$x->id;
				$loop2++;
			}
	                $diff = array_diff($listedAll, $listedThis);

			if(is_array($diff)){
				foreach($diff as $blah){
					$novo = new ScaAccountRelationConfig();
					$novo->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
					$novo->sca_account_config_id = $blah;
					$novo->valor_parametro = 'NotDefined';
					$novo->save();
				}
			}
		}
		if (DMG_Acl::canAccess(1)) {
			$obj = array();
			$loop =0;
			$query = Doctrine_Query::create()->select()->from('ScaAccountRelationConfig arc')->where('arc.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->orderBy('ac.nome_parametro ASC')->innerJoin('arc.ScaAccountConfig ac')->execute();
			foreach($query as $l){
				$obj[$loop]['id'] = $l->ScaAccountConfig->id;
				$obj[$loop]['nome'] = $l->ScaAccountConfig->nome_parametro;
				$obj[$loop]['desc'] = $l->ScaAccountConfig->desc_parametro;
				$obj[$loop]['parm'] = $l->valor_parametro; 
				$loop++;
			}
			echo Zend_Json::encode(array('success' => true, 'data' => $obj));
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
	public function getAction () {
		if (DMG_Acl::canAccess(2)) {
                        $id = (int) $this->getRequest()->getParam('id');

			$query = Doctrine_Query::create()->select()->from('ScaAccountRelationConfig arc')->where('arc.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->addWhere('arc.sca_account_config_id = ?', $id)->execute();	


			try {
				$obj['id'] = $id;
				$obj['name'] = $query[0]->ScaAccountConfig->nome_parametro;
				$obj['value'] = $query[0]->valor_parametro;
			} catch (exception $e) {
				echo Zend_Json::encode(array('success' => false));
			}

                        if ($obj) {
                                echo Zend_Json::encode(array('success' => true, 'data' => $obj));
                        } else {
				echo Zend_Json::encode(array('success' => false));
			}
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
	public function saveAction () {
		if (DMG_Acl::canAccess(2)) {
	
			$id = (int) $this->getRequest()->getParam('id');
			$query = Doctrine_Query::create()->select()->from('ScaAccountRelationConfig arc')->where('arc.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)->addWhere('arc.sca_account_config_id = ?', $id)->execute();

			if($query->count()){
				try {
					$obj = Doctrine::getTable('ScaAccountRelationConfig')->find($query[0]->id);
					$obj->valor_parametro = $this->getRequest()->getParam('value');
					$obj->save();
				} catch (exception $e) {
					echo Zend_Json::encode(array('success' => false));
				}

			} else {
				echo Zend_Json::encode(array('success' => false));
			}
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
}
