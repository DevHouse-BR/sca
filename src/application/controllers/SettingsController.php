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
			$this->_helper->json(array('success' => true, 'data' => $obj));
		} else {
			$this->_helper->json(array('success' => false));
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
				$this->_helper->json(array('success' => false));
			}

                        if ($obj) {
				$this->_helper->json(array('success' => true, 'data' => $obj));
                        } else {
				$this->_helper->json(array('success' => false));
			}
		} else {
			$this->_helper->json(array('success' => false));
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
					$this->_helper->json(array('success' => true));
				} catch (exception $e) {
					$this->_helper->json(array('success' => false));
				}

			} else {
				$this->_helper->json(array('success' => false));
			}
		} else {
			$this->_helper->json(array('success' => false));
		}
	}
	
	public function logoAction(){
		try {
			$upload = new Zend_File_Transfer_Adapter_Http();
			
			$info = @$upload->getFileInfo();
			
			$filename = 'files/'. Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . "account_logo." . $this->_findexts($info['logo']['name']);
						
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
			
			if($upload->receive()){
				$config = Doctrine_Query::create()
					->select()
					->from('ScaAccountRelationConfig arc')
					->where('arc.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
					->addWhere('arc.sca_account_config_id = 2')
					->fetchOne();
					
				if(($config->valor_parametro != $filename)&& (trim($config->valor_parametro) != ""))@unlink($config->valor_parametro);
				$config->valor_parametro = $filename;
				$config->save();
				echo Zend_Json::encode(array('success' => true));
			}
		} 
		catch (Exception $e){
			echo Zend_Json::encode(array('success' => false, 'errormsg' => $e->getMessage()));
		}		
	}
	
	protected function _findexts($filename){
		$filename = strtolower($filename);
		$exts = explode(".", $filename);
		$n = count($exts)-1;
		$exts = $exts[$n];
		return $exts;
	}
	
	
	public function testeAction(){
		try {
			$upload = new Zend_File_Transfer_Adapter_Http();
			
			$info = @$upload->getFileInfo();
			
			print_r($info);
		}
		catch (Exception $e){
			echo Zend_Json::encode(array('success' => false, 'errormsg' => $e->getMessage()));
		}	
	}
}
