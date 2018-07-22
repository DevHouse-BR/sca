<?php

class PpostagensController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	
	public function uploadAction(){
		try {
			$session = new Zend_Session_Namespace("uploads");
			if(!isset($session->upload_queue)){
				$session->upload_queue = array();
			}
			
			if(!isset($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')])){
				$session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')] = array();
			}
			
			$usemime = DMG_Config::getAccountCfg(16);
			$upload = new Zend_File_Transfer_Adapter_Http();
			
			$allowedFileTypes = DMG_Config::getAccountCfg(15);
			
			if($usemime == "SIM"){
				$allowedFileTypes = explode(",", $allowedFileTypes);
				
				$mimes = array();
				foreach($allowedFileTypes as $ext){
					$allowedMimes = DMG_ExtToMime::get($ext);
					foreach($allowedMimes as $m){
						$mimes[] = $m;
					}
				}
				$upload->addValidator('MimeType', false, $mimes);
			}
			else{
				$upload->addValidator('Extension', false, $allowedFileTypes);
			}
			if (!$upload->isValid()) {
				throw new Exception(DMG_Translate::_('controle.postagens.mime.not.allowed'));
			}
			$files = $upload->getFileInfo();
			
			foreach ($files as $file => $info) {
				$accMaxFileSize = DMG_Config::getAccountCfg(14);
				
				if($usemime == "SIM"){
					$maxFileSize = $accMaxFileSize . "MB";
					$upload->addValidator('Size', false, array('min' => '0kB', 'max' => $maxFileSize, 'bytestring' => false));
					
					if (!$upload->isValid()) {
						throw new Exception(DMG_Translate::_('controle.postagens.erro.tamanho') . $maxFileSize);
					}
				}
				else{
					$maxFileSize = (int) $accMaxFileSize * 1024 * 1024;
					$filesize = (int) $info['size'];
					
					if($filesize > $maxFileSize){
						throw new Exception(DMG_Translate::_('controle.postagens.erro.tamanho') . $accMaxFileSize . "MB");
					}
				}

				if($info['name'] != ""){
					$temp_name = uniqid (rand (),true);
					
					$filename = realpath(APPLICATION_PATH . '/../files') . '/'. Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $temp_name;
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
							$session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')][] = array(
								'filename' => $info['name'],
								'tmp_name' => $temp_name,
								'type' => $info['type'],
								'size' => $info['size']
							);
							echo Zend_Json::encode(array('success' => true, 'tmp_name' => $temp_name));
						}
					}
				}
			}
		} 
		catch (Exception $e){
			echo Zend_Json::encode(array('success' => false, 'errormsg' => $e->getMessage()));
		}		
	}
	

	public function listmyrecentsAction() {
		$data = array();
		$podeAcessar = false;
		if (DMG_Acl::canAccess(21)) {
			$podeAcessar = true;
		}
		else if(Zend_Auth::getInstance()->hasIdentity()){
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == 'P')
				$podeAcessar = true;
		}

		if($podeAcessar) {		
			$conn = Doctrine_Manager::getInstance()->getCurrentConnection();
			$dbhandler = $conn->getDbh();

			$query = "
					SELECT
					p.id,
					p.titulo_postagem,
					p.scm_user_id,
					p.fl_publicado,
					p.fl_lida as lida,
					TO_CHAR(p.data_postagem, 'YYYY-MM-DD HH24:MI:SS') AS data_postagem ,
					u.nome_usuario,
					c.cod_cliente,
					c.nome_cliente,
					COALESCE(l.leituras, 0) as leituras,
					COALESCE(d.downloads, 0) as downloads					
					
					FROM sca_postagens p 
					INNER JOIN scm_user u ON u.id = p.scm_user_id
					INNER JOIN sca_clientes c ON c.id = p.sca_clientes_id
					LEFT OUTER JOIN  (
						SELECT count(id) as leituras, sca_postagens_id FROM sca_logleituras GROUP BY sca_postagens_id
					) l ON l.sca_postagens_id = p.id
					LEFT OUTER JOIN  (
						SELECT count(d.id) as downloads, a.sca_postagens_id FROM sca_logdownloads d INNER JOIN sca_anexos a ON a.id = d.sca_anexos_id GROUP BY a.sca_postagens_id
					) d ON d.sca_postagens_id = p.id
					";
			$query .= " WHERE p.sca_account_id = " . Zend_Auth::getInstance()->getIdentity()->sca_account_id . " ";
			$query .= " AND (u.sca_clientes_id = " . Zend_Auth::getInstance()->getIdentity()->sca_clientes_id . " OR p.sca_clientes_id =  " . Zend_Auth::getInstance()->getIdentity()->sca_clientes_id . " ) ";
			$query .= " and p.fl_publicado = true " . " ";	

			$filter = $this->getRequest()->getParam('filter');
			if (is_array($filter)) {
				foreach ($filter as $k) {
					if(isset($k['data']['value']) && $k['data']['type'] != 'string') {
						$dataExp = explode('/' ,$k['data']['value']);
						$k['data']['value'] = $dataExp[1].'/'.$dataExp[0].'/'.$dataExp[2];
					}

					switch ($k['data']['type']) {
						case 'string':
							$query .= " AND " . $k['field'] . ' ILIKE ' . "'%" . $k['data']['value'] . "%' ";
							break;
						case 'date':
							if($k['data']['comparison'] == 'lt'){
								$query .= " AND CAST(" . $k['field'] . " AS date) <= CAST('" . $k['data']['value'] . "' AS date) ";
							}
							if($k['data']['comparison'] == 'gt'){
								$query .= " AND CAST(" . $k['field'] . " AS date) >= CAST('" . $k['data']['value'] . "' AS date) ";
							}
							if($k['data']['comparison'] == 'eq'){
								$query .= " AND CAST(" . $k['field'] . " AS date) = CAST('" . $k['data']['value'] . "' AS date) ";
							}
							break;
					}
				}
			}
					
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			
			if(($sort == 'id')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY lida ASC, data_postagem DESC ";
			}
			elseif(($sort == 'nome_usuario')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY u.nome_usuario " . $dir . " ";
			}
			elseif(($sort == 'cliente')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY c.nome_cliente " . $dir . " ";
			}
			elseif(($sort == 'leituras')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY l.leituras " . $dir . " ";
			}
			elseif(($sort == 'downloads')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY d.downloads " . $dir . " ";
			}
			else{
				$query .= " ORDER BY " . $sort . " " . $dir . " ";
			}
						
			$limit = (int) $this->getRequest()->getParam('limit');
			if ($limit > 0) {
				$query .= " LIMIT " . $limit . " ";
			}
			$offset = (int) $this->getRequest()->getParam('start');
			if ($offset > 0) {
				$query .= " OFFSET " . $offset . " ";
			}
			
			$postagens = $dbhandler->query($query);
			
			foreach($postagens as $k){
				$data[] = array(
					'id' => $k['id'],
					'titulo_postagem' => $k['titulo_postagem'],
					'scm_user_id' => $k['scm_user_id'],
					'fl_publicado' => $k['fl_publicado'],
					'fl_lida' => $k['lida'],
					'nome_usuario' => $k['nome_usuario'],
					'data_postagem' => $k['data_postagem'],
					'cliente' => (strlen($k['cod_cliente'])>0)? ($k['cod_cliente'] . " - " . $k['nome_cliente']) : $k['nome_cliente'],
					'leituras' => $k['leituras'],
					'downloads' => $k['downloads']
				);
			}
			
		}

		$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
	}

	public function listmypendentesAction() {
		$data = array();
		$podeAcessar = false;
		if (DMG_Acl::canAccess(21)) {
			$podeAcessar = true;
		}
		else if(Zend_Auth::getInstance()->hasIdentity()){
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == 'P')
				$podeAcessar = true;
		}

		if($podeAcessar) {		
			$conn = Doctrine_Manager::getInstance()->getCurrentConnection();
			$dbhandler = $conn->getDbh();

			$query = "
					SELECT
					p.id,
					p.titulo_postagem,
					p.scm_user_id,
					p.fl_publicado,
					p.fl_lida as lida,
					TO_CHAR(p.data_postagem, 'YYYY-MM-DD HH24:MI:SS') AS data_postagem ,
					u.nome_usuario,
					c.cod_cliente,
					c.nome_cliente,
					COALESCE(l.leituras, 0) as leituras,
					COALESCE(d.downloads, 0) as downloads					
					
					FROM sca_postagens p 
					INNER JOIN scm_user u ON u.id = p.scm_user_id
					INNER JOIN sca_clientes c ON c.id = p.sca_clientes_id
					LEFT OUTER JOIN  (
						SELECT count(id) as leituras, sca_postagens_id FROM sca_logleituras GROUP BY sca_postagens_id
					) l ON l.sca_postagens_id = p.id
					LEFT OUTER JOIN  (
						SELECT count(d.id) as downloads, a.sca_postagens_id FROM sca_logdownloads d INNER JOIN sca_anexos a ON a.id = d.sca_anexos_id GROUP BY a.sca_postagens_id
					) d ON d.sca_postagens_id = p.id
					";
			$query .= " WHERE p.sca_account_id = " . Zend_Auth::getInstance()->getIdentity()->sca_account_id . " ";
			$query .= " AND p.sca_clientes_id =  " . Zend_Auth::getInstance()->getIdentity()->sca_clientes_id . " ";
			$query .= " AND p.fl_lida = false";
			$query .= " AND u.tipo_usuario = 'I' ";
			$query .= " and p.fl_publicado = true " . " ";

			$filter = $this->getRequest()->getParam('filter');
			if (is_array($filter)) {
				foreach ($filter as $k) {
					if(isset($k['data']['value']) && $k['data']['type'] != 'string') {
						$dataExp = explode('/' ,$k['data']['value']);
						$k['data']['value'] = $dataExp[1].'/'.$dataExp[0].'/'.$dataExp[2];
					}

					switch ($k['data']['type']) {
						case 'string':
							$query .= " AND " . $k['field'] . ' ILIKE ' . "'%" . $k['data']['value'] . "%' ";
							break;
						case 'date':
							if($k['data']['comparison'] == 'lt'){
								$query .= " AND CAST(" . $k['field'] . " AS date) <= CAST('" . $k['data']['value'] . "' AS date) ";
							}
							if($k['data']['comparison'] == 'gt'){
								$query .= " AND CAST(" . $k['field'] . " AS date) >= CAST('" . $k['data']['value'] . "' AS date) ";
							}
							if($k['data']['comparison'] == 'eq'){
								$query .= " AND CAST(" . $k['field'] . " AS date) = CAST('" . $k['data']['value'] . "' AS date) ";
							}
							break;
					}
				}
			}
					
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			
			if(($sort == 'id')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY lida ASC, data_postagem DESC ";
			}
			elseif(($sort == 'nome_usuario')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY u.nome_usuario " . $dir . " ";
			}
			elseif(($sort == 'cliente')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY c.nome_cliente " . $dir . " ";
			}
			elseif(($sort == 'leituras')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY l.leituras " . $dir . " ";
			}
			elseif(($sort == 'downloads')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY d.downloads " . $dir . " ";
			}
			else{
				$query .= " ORDER BY " . $sort . " " . $dir . " ";
			}
						
			$postagens = $dbhandler->query($query);
			
			foreach($postagens as $k){
				$data[] = array(
					'id' => $k['id'],
					'titulo_postagem' => $k['titulo_postagem'],
					'scm_user_id' => $k['scm_user_id'],
					'fl_publicado' => $k['fl_publicado'],
					'fl_lida' => $k['lida'],
					'nome_usuario' => $k['nome_usuario'],
					'data_postagem' => $k['data_postagem'],
					'cliente' => (strlen($k['cod_cliente'])>0)? ($k['cod_cliente'] . " - " . $k['nome_cliente']) : $k['nome_cliente'],
					'leituras' => $k['leituras'],
					'downloads' => $k['downloads']
				);
			}
			
		}

		$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
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
	
	public function cleanonefileAction(){
		$session = new Zend_Session_Namespace("uploads");
		foreach($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')] as $key => $file){
			if($file['tmp_name'] == $this->getRequest()->getParam('tmp_name')){
				@unlink(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $file['tmp_name']);
				unset($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')][$key]);
				break;
			}
		}
		$this->_helper->json(array('success'=>true));
	}
	
	public function cleantempAction(){
		$session = new Zend_Session_Namespace("uploads");
		foreach($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')] as $file){
			@unlink(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $file['tmp_name']);
		}
		$this->_helper->json(array('success'=>true));
	}
	
	public function saveAction(){
		try{
			$session = new Zend_Session_Namespace("uploads");
			
			$titulo_postagem = $this->getRequest()->getParam('titulo_postagem');
			if($titulo_postagem == ""){
				throw new Exception(DMG_Translate::_('controle.postagens.erro.titulo'));
			}
			
			$sca_clientes_id = Zend_Auth::getInstance()->getIdentity()->sca_clientes_id;
			if($sca_clientes_id == 0){
				throw new Exception(DMG_Translate::_('administration.group.permission.denied'));
			}
			
			$texto_postagem = $this->getRequest()->getParam('texto_postagem');
			$anexos = $this->getRequest()->getParam('anexos');
			
			$postagem = new ScaPostagens();
			$postagem->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$postagem->scm_user_id = Zend_Auth::getInstance()->getIdentity()->id;
			$postagem->data_postagem = DMG_Date::now();
			$postagem->titulo_postagem = $titulo_postagem;
			$postagem->sca_clientes_id = $sca_clientes_id;
			$postagem->texto_postagem = $texto_postagem;
			$postagem->fl_publicado = true;
			$postagem->fl_lida = false;
			
			$postagem->save();
			
			if(!is_dir(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id)){
				mkdir(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id);
			}
			
			foreach($anexos as $arquivo){
				foreach($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')] as $file){
					if($arquivo == $file['tmp_name']){
						$newFilePath = realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id . '/' . $file['filename'];
						if(rename(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $file['tmp_name'], $newFilePath)){
							
							$caminho = 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id . '/' . $file['filename'];
							
							$anexo = new ScaAnexos();
							$anexo->sca_postagens_id = $postagem->id;
							$anexo->nome_anexo = $file['filename'];
							$anexo->caminho_anexo = $caminho;
							$anexo->tipo_anexo = $file['type'];
							$anexo->tamanho_anexo = $file['size'];
							$anexo->save();
						}
						break;
					}
				}
			}
			
			unset($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')]);
			
			$usuarios = Doctrine_Query::create()
					->from('ScmUser u')
					->where('u.sca_account_id = ' . $postagem->sca_account_id)
					->addWhere('u.recebe_mensagem = ?', true)
					->addWhere('u.tipo_usuario = ?', "I");
			
			$destinatarios = "";
			foreach($usuarios->execute() as $user){
				$destinatarios .= $user->email . ",";
			}
			$destinatarios = substr($destinatarios, 0, -1);
			
			if(strlen($destinatarios)>0){
				$email_template = file_get_contents(realpath(APPLICATION_PATH . '/../files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/email_templates/novaPostagemTemplate.phtml'));
				$email_template = str_replace ('{assunto}', DMG_Translate::_('mensagem.tipo1.assunto') . $titulo_postagem, $email_template);
				$email_template = str_replace ('{titulo_postagem}', DMG_Translate::_('mensagem.tipo1.assunto') . $titulo_postagem, $email_template);
				$email_template = str_replace ('{mensagem.template.postadopor}', DMG_Translate::_('mensagem.template.postadopor'), $email_template);
				$email_template = str_replace ('{mensagem.template.data}', DMG_Translate::_('mensagem.template.data'), $email_template);
				$email_template = str_replace ('{mensagem.template.cliente}', DMG_Translate::_('mensagem.template.cliente'), $email_template);
				$email_template = str_replace ('{mensagem.template.comentario}', DMG_Translate::_('mensagem.template.comentario'), $email_template);
				$email_template = str_replace ('{nome_usuario}', Zend_Auth::getInstance()->getIdentity()->nome_usuario, $email_template);
				$email_template = str_replace ('{data_postagem}', $postagem->data_postagem, $email_template);
				$email_template = str_replace ('{nome_cliente}', $postagem->ScaClientes->nome_cliente, $email_template);
				$email_template = str_replace ('{texto_postagem}', $texto_postagem, $email_template);
				$email_template = str_replace ('{footer}', DMG_Config::getAccountCfg(5), $email_template);
				$email_template = str_replace ('{copyright}', DMG_Config::get(3), $email_template);
				$email_template = str_replace ('{logoaccount}', DMG_Config::get(4) . 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/account_logo.png', $email_template);
				$email_template = str_replace ('{nome_sistema}', DMG_Config::get(2), $email_template);
				
				$messenger = new Khronos_SendRecMessage();
				if(!$messenger->Send($destinatarios, DMG_Translate::_('mensagem.tipo1.assunto') . $titulo_postagem, $email_template, 1, $postagem->id)){
					//$this->_helper->json(array('success' => false, 'errormsg' => $messenger->getError()));
				}
			}
			
			$this->_helper->json(array('success'=>true));
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}
	
	public function listAction(){
		$data = array();
		$podeAcessar = false;
		if(Zend_Auth::getInstance()->hasIdentity()){
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario == "P")
				$podeAcessar = true;
		}

		if($podeAcessar) {		
			$conn = Doctrine_Manager::getInstance()->getCurrentConnection();
			$dbhandler = $conn->getDbh();

			$query = "
				SELECT
				p.id,
				p.titulo_postagem,
				p.scm_user_id,
				p.fl_publicado,
				p.fl_lida as lida,
				TO_CHAR(p.data_postagem, 'YYYY-MM-DD HH24:MI:SS') AS data_postagem ,
				u.nome_usuario,
				u.tipo_usuario,
				c.cod_cliente,
				c.nome_cliente,
				COALESCE(l.leituras, 0) as leituras,
				COALESCE(d.downloads, 0) as downloads                                   
				
				FROM sca_postagens p 
				INNER JOIN scm_user u ON u.id = p.scm_user_id
				INNER JOIN sca_clientes c ON c.id = p.sca_clientes_id
				LEFT OUTER JOIN  (
					SELECT count(id) as leituras, sca_postagens_id FROM sca_logleituras GROUP BY sca_postagens_id
				) l ON l.sca_postagens_id = p.id
				LEFT OUTER JOIN  (
					SELECT count(d.id) as downloads, a.sca_postagens_id FROM sca_logdownloads d INNER JOIN sca_anexos a ON a.id = d.sca_anexos_id GROUP BY a.sca_postagens_id
				) d ON d.sca_postagens_id = p.id
			";


			$query .= " WHERE p.sca_account_id = " . Zend_Auth::getInstance()->getIdentity()->sca_account_id . " ";
			$query .= " and p.fl_publicado = true " . " ";
			$query .= " and p.sca_clientes_id = " . Zend_Auth::getInstance()->getIdentity()->sca_clientes_id . " ";
			
			$filter = $this->getRequest()->getParam('filter');
			if (is_array($filter)) {
				foreach ($filter as $k) {
					if(isset($k['data']['value']) && $k['data']['type'] != 'string') {
						$dataExp = explode('/' ,$k['data']['value']);
						$k['data']['value'] = $dataExp[1].'/'.$dataExp[0].'/'.$dataExp[2];
					}

					switch ($k['data']['type']) {
						case 'string':
							$query .= " AND " . $k['field'] . ' ILIKE ' . "'%" . $k['data']['value'] . "%' ";
							break;
						case 'date':
							if($k['data']['comparison'] == 'lt'){
								$query .= " AND CAST(" . $k['field'] . " AS date) <= CAST('" . $k['data']['value'] . "' AS date) ";
							}
							if($k['data']['comparison'] == 'gt'){
								$query .= " AND CAST(" . $k['field'] . " AS date) >= CAST('" . $k['data']['value'] . "' AS date) ";
							}
							if($k['data']['comparison'] == 'eq'){
								$query .= " AND CAST(" . $k['field'] . " AS date) = CAST('" . $k['data']['value'] . "' AS date) ";
							}
							break;
					}
				}
			}
					
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			
			if(($sort == 'id')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY lida ASC, p.data_postagem DESC ";
			}
			elseif(($sort == 'nome_usuario')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY u.nome_usuario " . $dir . " ";
			}
			elseif(($sort == 'cliente')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY c.nome_cliente " . $dir . " ";
			}
			elseif(($sort == 'leituras')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY l.leituras " . $dir . " ";
			}
			elseif(($sort == 'downloads')&& ($dir == 'ASC' || $dir == 'DESC')){
				$query .= " ORDER BY d.downloads " . $dir . " ";
			}
			else{
				$query .= " ORDER BY " . $sort . " " . $dir . " ";
			}
						
			$limit = (int) $this->getRequest()->getParam('limit');
			if ($limit > 0) {
				$query .= " LIMIT " . $limit . " ";
			}
			$offset = (int) $this->getRequest()->getParam('start');
			if ($offset > 0) {
				$query .= " OFFSET " . $offset . " ";
			}
			
			$postagens = $dbhandler->query($query);
			
			foreach($postagens as $k){
				$data[] = array(
					'id' => $k['id'],
					'titulo_postagem' => $k['titulo_postagem'],
					'scm_user_id' => $k['scm_user_id'],
					'fl_publicado' => $k['fl_publicado'],
					'fl_lida' => $k['lida'],
					'nome_usuario' => $k['nome_usuario'],
					'data_postagem' => $k['data_postagem'],
					'cliente' => (strlen($k['cod_cliente'])>0)? ($k['cod_cliente'] . " - " . $k['nome_cliente']) : $k['nome_cliente'],
					'leituras' => $k['leituras'],
					'downloads' => $k['downloads']
				);
			}
		}
		$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
	}
	
	public function keepaliveAction(){
		$this->_helper->json(array('success' => true));
	}
	
	public function getAction () {
		try{
			if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario != "P"){
				die();//retorna falso...
			}

			$id = (int) $this->getRequest()->getParam('id');
			
			$conn = Doctrine_Manager::getInstance()->getCurrentConnection();
			$dbhandler = $conn->getDbh();
			
			$query = "
					SELECT
					p.id,
					p.titulo_postagem,
					p.texto_postagem,
					p.sca_clientes_id,
					p.scm_user_id,
					p.fl_publicado,
					p.fl_lida,
					TO_CHAR(p.data_postagem, 'YYYY-MM-DD HH24:MI:SS') AS data_postagem ,
					u.nome_usuario,
					u.tipo_usuario,
					c.cod_cliente,
					c.nome_cliente,
					COALESCE(l.leituras, 0) as leituras,
					COALESCE(d.downloads, 0) as downloads					
					
					FROM sca_postagens p 
					INNER JOIN scm_user u ON u.id = p.scm_user_id
					INNER JOIN sca_clientes c ON c.id = p.sca_clientes_id
					LEFT OUTER JOIN  (
						SELECT count(id) as leituras, sca_postagens_id FROM sca_logleituras GROUP BY sca_postagens_id
					) l ON l.sca_postagens_id = p.id
					LEFT OUTER JOIN  (
						SELECT count(d.id) as downloads, a.sca_postagens_id FROM sca_logdownloads d INNER JOIN sca_anexos a ON a.id = d.sca_anexos_id GROUP BY a.sca_postagens_id
					) d ON d.sca_postagens_id = p.id
					";
			$query .= " WHERE p.sca_account_id = " . Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$query .= " AND p.id = " . $id;
			
			$postagens = $dbhandler->query($query);
	
			foreach($postagens as $k){
				$data = array(
					'id' => $k['id'],
					'titulo_postagem' => $k['titulo_postagem'],
					'texto_postagem' => $k['texto_postagem'],
					'scm_user_id' => $k['scm_user_id'],
					'fl_lida' => $k['fl_lida'],
					'nome_usuario' => $k['nome_usuario'],
					'data_postagem' => date_format(date_create($k['data_postagem']), 'd/m/Y H:i \\h\\s'),
					'leituras' => $k['leituras'],
					'downloads' => $k['downloads']
				);
				$pst = $k;
			}
			
			if($pst['tipo_usuario'] != Zend_Auth::getInstance()->getIdentity()->tipo_usuario){
				$postagem = Doctrine::getTable('ScaPostagens')->find($id);
				$postagem->fl_lida = true;
				$postagem->save();
				
				$usuarios = Doctrine_Query::create()
						->from('ScmUser u')
						->innerJoin('u.ScaClientes c ON c.id_responsavel = u.id')
						->where('c.id = ' . $pst['sca_clientes_id']);
				
				$destinatarios = "";
				foreach($usuarios->execute() as $user){
					$destinatarios .= $user->email . ",";
				}
				$destinatarios = substr($destinatarios, 0, -1);
				
				if(strlen($destinatarios)>0){
					$email_template = file_get_contents(realpath(APPLICATION_PATH . '/../files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/email_templates/leituraPostagemTemplate.phtml'));
					$email_template = str_replace ('{assunto}', DMG_Translate::_('mensagem.tipo2.assunto') . $pst['titulo_postagem'], $email_template);
					$email_template = str_replace ('{titulo_postagem}', DMG_Translate::_('mensagem.tipo2.assunto') . $pst['titulo_postagem'], $email_template);
					$email_template = str_replace ('{mensagem.template.postadopor}', DMG_Translate::_('mensagem.template.postadopor'), $email_template);
					$email_template = str_replace ('{mensagem.template.data}', DMG_Translate::_('mensagem.template.data'), $email_template);
					$email_template = str_replace ('{mensagem.template.cliente}', DMG_Translate::_('mensagem.template.cliente'), $email_template);
					$email_template = str_replace ('{mensagem.template.comentario}', DMG_Translate::_('mensagem.template.comentario'), $email_template);
					$email_template = str_replace ('{nome_usuario}', $pst['nome_usuario'], $email_template);
					$email_template = str_replace ('{data_postagem}', $pst['data_postagem'], $email_template);
					$email_template = str_replace ('{nome_cliente}', $pst['nome_cliente'], $email_template);
					$email_template = str_replace ('{texto_postagem}', $pst['texto_postagem'], $email_template);
					$email_template = str_replace ('{footer}', DMG_Config::getAccountCfg(5), $email_template);
					$email_template = str_replace ('{copyright}', DMG_Config::get(3), $email_template);
					$email_template = str_replace ('{logoaccount}', DMG_Config::get(4) . 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/account_logo.png', $email_template);
					$email_template = str_replace ('{nome_sistema}', DMG_Config::get(2), $email_template);
					
					$messenger = new Khronos_SendRecMessage();
					if(!$messenger->Send($destinatarios, DMG_Translate::_('mensagem.tipo2.assunto') . $pst['titulo_postagem'], $email_template, 2, $postagem->id)){
						//$this->_helper->json(array('success' => false, 'errormsg' => $messenger->getError()));
					}
				}
			}
			
			$logleitura = new ScaLogleituras();
			$logleitura->sca_postagens_id = $id;
			$logleitura->data_leitura = DMG_Date::now();
			$logleitura->id_usuario = Zend_Auth::getInstance()->getIdentity()->id;
			$logleitura->save();
			
			$this->_helper->json(array('success' => true, 'data' => $data));
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}
	
	public function leiturasAction(){
		if(!Zend_Auth::getInstance()->hasIdentity())
			return;
		else if(Zend_Auth::getInstance()->getIdentity()->tipo_usuario != "P")
			return;

		try{
			$data = array();
			
			$postagem = (int) $this->getRequest()->getParam('postagem');
			
			$query = Doctrine_Query::create()
				->select('l.id')
				->addSelect('l.data_leitura')
				->addSelect('u.nome_usuario')
				->addSelect('p.id')
				->addSelect('l.id_usuario')
				->from('ScaLogleituras l')
				->innerJoin('l.ScaPostagens p')
				->innerJoin('p.ScmUser u')
				->where('l.sca_postagens_id = ?', $postagem)
				->addWhere('p.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
				
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			if(strlen($sort)>0) $query->orderBy($sort . " " . $dir);

			foreach($query->execute() as $k){
				$data[] = array(
					'id' => $k->id,
					'data_leitura' => $k->data_leitura,
					'nome_usuario' => $k->ScmUser->nome_usuario
				);
			}
			$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}
	
	public function downloadsAction(){
		try{
			$data = array();
			
			$postagem = (int) $this->getRequest()->getParam('postagem');
			
			$query = Doctrine_Query::create()
				->select('d.*')
				->addSelect('a.*')
				->addSelect('u.*')
				->from('ScaLogdownloads d')
				->innerJoin('d.ScaAnexos a')
				->innerJoin('a.ScaPostagens p')
				->innerJoin('d.ScmUser u')
				->where('p.id = ?', $postagem)
				->addWhere('p.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);
				
			$sort = (string) $this->getRequest()->getParam('sort');
			$dir = (string) $this->getRequest()->getParam('dir');
			if(strlen($sort)>0) $query->orderBy($sort . " " . $dir);

			foreach($query->execute() as $k){
				$data[] = array(
					'id' => $k->id,
					'data_download' => $k->data_download,
					'nome_anexo' => $k->ScaAnexos->nome_anexo,
					'nome_usuario' => $k->ScmUser->nome_usuario
				);
			}
			$this->_helper->json(array('success' => true, 'total' => count($data), 'data' => $data));
		}
		catch (Exception $e){
			$this->_helper->json(array('success' => false, 'errormsg' => $e->getMessage()));
		}
	}

	public function fastsaveAction(){
		try {
			$session = new Zend_Session_Namespace("uploadsFast");
			if(!isset($session->upload_queue)){
				$session->upload_queue = array();
			}
			
			if(!isset($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')])){
				$session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')] = array();
			}
			
			$usemime = DMG_Config::getAccountCfg(16);

			$upload = new Zend_File_Transfer_Adapter_Http();
			
			$allowedFileTypes = DMG_Config::getAccountCfg(15);
			
			if($usemime == "SIM"){
				$allowedFileTypes = explode(",", $allowedFileTypes);
				
				$mimes = array();
				foreach($allowedFileTypes as $ext){
					$allowedMimes = DMG_ExtToMime::get($ext);
					foreach($allowedMimes as $m){
						$mimes[] = $m;
					}
				}
				$upload->addValidator('MimeType', false, $mimes);
			}
			else{
				$upload->addValidator('Extension', false, $allowedFileTypes);
			}
			if (!$upload->isValid()) {
				throw new Exception(DMG_Translate::_('controle.postagens.mime.not.allowed'));
			}
			$files = $upload->getFileInfo();
			
			foreach ($files as $file => $info) {
				$accMaxFileSize = DMG_Config::getAccountCfg(14);
				
				if($usemime == "SIM"){
					$maxFileSize = $accMaxFileSize . "MB";
					$upload->addValidator('Size', false, array('min' => '0kB', 'max' => $maxFileSize, 'bytestring' => false));
					
					if (!$upload->isValid()) {
						throw new Exception(DMG_Translate::_('controle.postagens.erro.tamanho') . $maxFileSize);
					}
				}
				else{
					$maxFileSize = (int) $accMaxFileSize * 1024 * 1024;
					$filesize = (int) $info['size'];
					
					if($filesize > $maxFileSize){
						throw new Exception(DMG_Translate::_('controle.postagens.erro.tamanho') . $accMaxFileSize . "MB");
					}
				}
				
				if($info['name'] != ""){
					$temp_name = uniqid (rand (),true);
					
					$filename = realpath(APPLICATION_PATH . '/../files') . '/'. Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $temp_name;
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
							$session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')][] = array(
								'filename' => $info['name'],
								'tmp_name' => $temp_name,
								'type' => $info['type'],
								'size' => $info['size']
							);
						}
					}
				}
			}

			$titulo_postagem = $this->getRequest()->getParam('titulo_postagem');
			if($titulo_postagem == ""){
				throw new Exception(DMG_Translate::_('controle.postagens.erro.titulo'));
			}
			
			$postagem = new ScaPostagens();
			$postagem->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$postagem->scm_user_id = Zend_Auth::getInstance()->getIdentity()->id;
			$postagem->data_postagem = DMG_Date::now();
			$postagem->titulo_postagem = $titulo_postagem;
			$postagem->sca_clientes_id = Zend_Auth::getInstance()->getIdentity()->sca_clientes_id;
			$postagem->texto_postagem = "";
			$postagem->fl_publicado = true;
			$postagem->fl_lida = false;
			
			$postagem->save();
					
			if(!is_dir(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id)){
				mkdir(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id);
			}
			foreach($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')] as $file){
				$newFilePath = realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id . '/' . $file['filename'];
				if(rename(realpath(APPLICATION_PATH . '/../files') . '/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/temp/' . $file['tmp_name'], $newFilePath)){
					
					$caminho = 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/' . $postagem->id . '/' . $file['filename'];
					
					$anexo = new ScaAnexos();
					$anexo->sca_postagens_id = $postagem->id;
					$anexo->nome_anexo = $file['filename'];
					$anexo->caminho_anexo = $caminho;
					$anexo->tipo_anexo = $file['type'];
					$anexo->tamanho_anexo = $file['size'];
					$anexo->save();
				}
			}
			
			unset($session->upload_queue[$this->getRequest()->getParam('UPLOAD_IDENTIFIER')]);
			
			$usuarios = Doctrine_Query::create()
					->from('ScmUser u')
					->where('u.sca_clientes_id = ' . $postagem->sca_clientes_id)
					->addWhere('u.recebe_mensagem = ?', true);
			
			$destinatarios = "";
			foreach($usuarios->execute() as $user){
				$destinatarios .= $user->email . ",";
			}
			$destinatarios = substr($destinatarios, 0, -1);
			
			if(strlen($destinatarios)>0){
				$email_template = file_get_contents(realpath(APPLICATION_PATH . '/../files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/email_templates/novaPostagemTemplate.phtml'));
				$email_template = str_replace ('{assunto}', DMG_Translate::_('mensagem.tipo1.assunto') . $titulo_postagem, $email_template);
				$email_template = str_replace ('{titulo_postagem}', DMG_Translate::_('mensagem.tipo1.assunto') . $titulo_postagem, $email_template);
				$email_template = str_replace ('{mensagem.template.postadopor}', DMG_Translate::_('mensagem.template.postadopor'), $email_template);
				$email_template = str_replace ('{mensagem.template.data}', DMG_Translate::_('mensagem.template.data'), $email_template);
				$email_template = str_replace ('{mensagem.template.cliente}', DMG_Translate::_('mensagem.template.cliente'), $email_template);
				$email_template = str_replace ('{mensagem.template.comentario}', DMG_Translate::_('mensagem.template.comentario'), $email_template);
				$email_template = str_replace ('{nome_usuario}', Zend_Auth::getInstance()->getIdentity()->nome_usuario, $email_template);
				$email_template = str_replace ('{data_postagem}', $postagem->data_postagem, $email_template);
				$email_template = str_replace ('{nome_cliente}', $postagem->ScaClientes->nome_cliente, $email_template);
				$email_template = str_replace ('{texto_postagem}', "", $email_template);
				$email_template = str_replace ('{footer}', DMG_Config::getAccountCfg(5), $email_template);
				$email_template = str_replace ('{copyright}', DMG_Config::get(3), $email_template);
				$email_template = str_replace ('{logoaccount}', DMG_Config::get(4) . 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/account_logo.png', $email_template);
				$email_template = str_replace ('{logocliente}', DMG_Config::get(4) . 'files/' . Zend_Auth::getInstance()->getIdentity()->sca_account_id . '/client_logo_' . $postagem->sca_clientes_id, $email_template);
				
				$messenger = new Khronos_SendRecMessage();
				if(!$messenger->Send($destinatarios, DMG_Translate::_('mensagem.tipo1.assunto') . $titulo_postagem, $email_template, 1, $postagem->id)){
//					echo Zend_Json::encode(array('success' => false, 'errormsg' => $messenger->getError()));
				}
				echo Zend_Json::encode(array('success' => true));
			}			

		} 
		catch (Exception $e){
			echo Zend_Json::encode(array('success' => false, 'errormsg' => $e->getMessage()));
		}		
	}

}
