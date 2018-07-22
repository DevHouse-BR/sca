<?php

class MensagensController extends Zend_Controller_Action {
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

	public function alllistAction(){
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == "P"){
				die('Permiçao negada');
			}

			$accountID = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$usrID = Zend_Auth::getInstance()->getIdentity()->id;

			$conn = Doctrine_Manager::getInstance()->getCurrentConnection();
			$dbhandler = $conn->getDbh();
			 
			$query = '
				SELECT *, TO_CHAR(mem.data_mensagem, \'YYYY-MM-DD HH:MI:SS\') AS data_mensagem_c, mem.id as id_da_mensagem_
				FROM sca_mensagens mem 

				INNER JOIN sca_tipo_mensagem tipoMens ON tipoMens.id = mem.sca_tipo_mensagem_id
				INNER JOIN sca_status_mensagem statMem ON statMem.id = mem.sca_status_mensagem_id
	
				INNER JOIN sca_postagens post ON post.id = mem.sca_postagens_id
				INNER JOIN scm_user usr ON post.scm_user_id = usr.id

				LEFT JOIN sca_departamentos dept ON dept.id = usr.sca_departamentos_id
				LEFT JOIN scm_user gerent ON gerent.id = dept.id_gerente
		
				LEFT JOIN sca_clientes cli ON cli.id = usr.sca_clientes_id
				LEFT JOIN scm_user resp ON resp.id = cli.id_responsavel WHERE ';
			
			if(!DMG_Acl::canAccess(25)){
				$query .= ' (usr.id = '.$usrID.' OR gerent.id = '.$usrID.' OR resp.id = '.$usrID.') AND ';
			} 

			$query .= ' mem.sca_account_id = '.$accountID.' ';

			$dir = (string) $this->getRequest()->getParam('dir');
			$sort = (string) $this->getRequest()->getParam('sort');

			if(($sort == 'tipo')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY tipoMens.nome_tipo_mensagem " . $dir . " ";
			} else if(($sort == 'data')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY mem.data_mensagem " . $dir . " ";
			} else if(($sort == 'assunto')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY mem.assunto " . $dir . " ";
			} else if(($sort == 'status')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY statMem.nome_status " . $dir . " ";
			} else if(($sort == 'remetente')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY mem.remetente " . $dir . " ";
			} else if(($sort == 'destinatario')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY mem.destinatarios " . $dir . " ";
			}

			$mensagens = $dbhandler->query($query);

			$data = array();

			foreach($mensagens as $loop){
				$data[] = array(
					'id' => $loop['id_da_mensagem_'],
					'tipo' => $loop['nome_tipo_mensagem'],
					'assunto' => $loop['assunto'],
					'data' => $loop['data_mensagem_c'],
					'status' => $loop['nome_status'],
					'remetente' => $loop['remetente'],
					'destinatario' => $loop['destinatarios']
				);
			}

			$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
	}

	public function loginfoAction() {
		if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario != 'I' or !DMG_Acl::canAccess(26)){
			$this->_helper->json(array('success' => true, 'total' => 0, 'data' => array()));
		}

		$query = Doctrine_Query::create()
			->from('ScaMensagensLog ml')
			->innerJoin('ml.ScaMensagens sm')
			->where('sm.id = ?', $this->getRequest()->getParam('id'))
			->addWhere('sm.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
			
		$sort = (string) $this->getRequest()->getParam('sort');
		$dir = (string) $this->getRequest()->getParam('dir');
		if(strlen($sort)>0) $query->orderBy($sort . " " . $dir);

		$answer = array();

		foreach($query->execute() as $loop){
			$answer[] = array(
				'data_log' => $loop->data_log,
				'texto_log' => $loop->texto_log
			);
		}

		$this->_helper->json(array('success' => true, 'total' => count($answer), 'data' => $answer));
	}
}
