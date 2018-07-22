<?php

class AnexosController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	
	public function listAction(){
		try{
			$data = array();
			
			$postagem = (int) $this->getRequest()->getParam('postagem');
			
			$query = Doctrine_Query::create()
				->from('ScaAnexos a')
				->innerJoin('a.ScaPostagens p')
				->where('a.sca_postagens_id = ?', $postagem)
				->addWhere('p.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
				
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			if(strlen($sort)>0) $query->orderBy($sort . " " . $dir);
				
			foreach($query->execute() as $k){
				$data[] = array(
					'id' => $k->id,
					'nome_anexo' => $k->nome_anexo,
					'tipo_anexo' => $k->tipo_anexo,
					'tamanho_anexo' => $this->bytesToSize($k->tamanho_anexo)
				);
			}
			$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}
	
	public function downloadAction(){
		try{
			$anexo = (int) $this->getRequest()->getParam('anexo');
			
			$anexo = Doctrine_Query::create()
				->from('ScaAnexos a')
				->innerJoin('a.ScaPostagens p')
				->addWhere('p.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
				->addWhere('a.id = ?', $anexo)
				->fetchOne()
				;
			
			if($anexo->count() == 0){
				throw new Exception(DMG_Translate::_('controle.postagens.erro.download.1'));
			}
			
			header('Content-Description: File Transfer');
			header("Content-Type: " . $anexo->tipo_anexo);
			header('Content-Disposition: attachment; filename=' . $anexo->nome_anexo);
			header('Content-Transfer-Encoding: binary');
			header('Expires: 0');
			header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
			header('Pragma: public');
			header('Content-Length: ' . $anexo->tamanho_anexo);
			ob_clean();
			flush();
			
			readfile(realpath(APPLICATION_PATH . '/../') . '/' . $anexo->caminho_anexo);
			
			$logdownload = new ScaLogdownloads();
			$logdownload->sca_anexos_id = $anexo->id;
			$logdownload->data_download = DMG_Date::now();
			$logdownload->id_usuario = Zend_Auth::getInstance()->getIdentity()->id;
			$logdownload->save();
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}
	
	private function bytesToSize($bytes, $precision = 2){
		$kilobyte = 1024;
		$megabyte = $kilobyte * 1024;
		$gigabyte = $megabyte * 1024;
		$terabyte = $gigabyte * 1024;
		if (($bytes >= 0) && ($bytes < $kilobyte)) {
			return $bytes . ' B';
		}
		elseif (($bytes >= $kilobyte) && ($bytes < $megabyte)) {
			return round($bytes / $kilobyte, $precision) . ' KB';
		}
		elseif (($bytes >= $megabyte) && ($bytes < $gigabyte)) {
			return round($bytes / $megabyte, $precision) . ' MB';
		}
		elseif (($bytes >= $gigabyte) && ($bytes < $terabyte)) {
			return round($bytes / $gigabyte, $precision) . ' GB';
		}
		elseif ($bytes >= $terabyte) {
			return round($bytes / $gigabyte, $precision) . ' TB';
		}
		else {
			return $bytes . ' B';
		}
	}
}
