<?php

class PmensagensController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	
	public function listAction(){
		try{
			$data = array();
			
			$postagem = (int) $this->getRequest()->getParam('postagem');
			
			$query = Doctrine_Query::create()
				->from('ScaMensagens m')
				->innerJoin('m.ScaStatusMensagem s')
				->innerJoin('m.ScaTipoMensagem t')
				->innerJoin('m.ScaPostagens p')
				->where('m.sca_postagens_id = ?', $postagem)
				->addWhere('p.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
				
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			if(strlen($sort)>0) $query->orderBy($sort . " " . $dir);
				
			foreach($query->execute() as $k){
				$data[] = array(
					'id' => $k->id,
					'sca_tipo_mensagem_id' => $k->sca_tipo_mensagem_id,
					'sca_status_mensagem_id' => $k->sca_status_mensagem_id,
					'data_mensagem' => $k->data_mensagem,
					'remetente' => $k->remetente,
					'destinatarios' => $k->destinatarios,
					'assunto' => $k->assunto,
					'nome_status' => $k->ScaStatusMensagem->nome_status,
					'nome_tipo_mensagem' => $k->ScaTipoMensagem->nome_tipo_mensagem
				);
			}
			$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}
}
