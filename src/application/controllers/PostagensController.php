<?php

class PostagensController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	
	public function uploadAction(){
		try {
			$maxFileSize = DMG_Config::getAccountCfg(14);
			$allowedFileTypes = DMG_Config::getAccountCfg(15);
			
			$upload = new Zend_File_Transfer_Adapter_Http();
			
			$upload->addValidator('Size', false, ($maxFileSize * 1024 * 1024));
			$allowedFileTypes = explode(",", $allowedFileTypes);
						
			$mimes = array();
			foreach($allowedFileTypes as $ext){
				$allowedMimes = DMG_ExtToMime::get($ext);
				foreach($allowedMimes as $m){
					$mimes[] = $m;
				}
			}
			
			$upload->addValidator('MimeType', false, $mimes);

			$files = $upload->getFileInfo();
			foreach ($files as $file => $info) {
				if($info['name'] != ""){
					
					if (!$upload->isValid()) {
						throw new Exception(DMG_Translate::_('controle.postagens.mime.not.allowed'));
					}
					
					$filename = 'files/'. Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $info['name'];
					$upload->addFilter('Rename', array(
						'target'=> $filename,
						'overwrite' => true
					),$file);
					if (!$upload->receive($file)) {
						$messages = $upload->getMessages();
						$msg = implode("<br />", $messages);
						echo Zend_Json::encode(array('success' => false, 'errormsg' => $msg));
					}
					else{
						if($upload->isReceived($file)){
							echo Zend_Json::encode(array('success' => true));
						}
					}
				}
			}
		} 
		catch (Exception $e){
			echo Zend_Json::encode(array('success' => false, 'errormsg' => $e->getMessage()));
		}		
	}
	
	public function progressAction(){
		$upload  = Zend_File_Transfer_Adapter_Http::getProgress();
		$upload = Zend_File_Transfer_Adapter_Http::getProgress($upload);
		$upload['upload_index'] = $this->getRequest()->getParam('upload_index');
		
		$this->_helper->json($upload);
	}
	
	protected function _findexts($filename){
		$filename = strtolower($filename);
		$exts = explode(".", $filename);
		$n = count($exts)-1;
		$exts = $exts[$n];
		return $exts;
	}
}
