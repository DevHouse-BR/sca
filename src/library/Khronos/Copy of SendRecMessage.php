<?php
/*
 * USO:
 *  $messenger = new Khronos_SendRecMessage();
 *	if(!$messenger->Send($destinatarios, $assunto, $corpo, $tipoMensagem, $postagem)){
 *		$this->_helper->json(array('success' => false, 'errormsg' => $messenger->getError()));
 *	}
 */

class Khronos_SendRecMessage {
	var $errormsg = null;

	public function getError() {
		return $this->errormsg;
	}
	
	public function Send($destinatarios, $assunto, $corpo, $tipoMensagem, $postagem) {
		try{
			if(!Zend_Auth::getInstance()->hasIdentity()){
				throw new Exception(DMG_Translate::_('mensagem.erro.2'));
			}
			if(!($destinatarios || $assunto || $corpo || $tipoMensagem) ){
				throw new Exception(DMG_Translate::_('mensagem.erro.1'));
			}
			
			$mensagem = new ScaMensagens();

			$mensagem->sca_account_id = Zend_Auth::getInstance()->getIdentity()->sca_account_id;
			$mensagem->sca_tipo_mensagem_id = $tipoMensagem;
			$mensagem->sca_status_mensagem_id = 1;
			$mensagem->sca_postagens_id = $postagem;
			$mensagem->data_mensagem = DMG_Date::now();
			$mensagem->remetente = DMG_Config::getAccountCfg(12);
			$mensagem->destinatarios = $destinatarios;
			$mensagem->assunto = $assunto;
			$mensagem->corpo = $corpo;

			$mensagem->save();

			return true;
			
		}
		catch(exception $e){
			$this->errormsg = $e->getMessage();
			return false;
		}
	}
	
	public function ExecSend() {
		try{
			$accounts = Doctrine_Query::create()
				->from('ScaAccount a');
			
			foreach($accounts->execute() as $account){
				$accountConfig = Doctrine_Query::create()				
					->from('ScaAccountRelationConfig c')
					->where('c.sca_account_id = ?', $account->id);
				
				foreach($accountConfig->execute() as $config){
					switch($config->sca_account_config_id){
						case 9:
							if(strtolower($config->valor_parametro) == 'sim' || strtolower($config->valor_parametro) == 'yes' || strtolower($config->valor_parametro) == 'si')
								$SMTPUse = true;
							break;
						case 10:
							$SMTPServer = $config->valor_parametro;
							break;
						case 11:
							$SMTPPort = $config->valor_parametro;
							break;
						case 12:
							$SMTPUser = $config->valor_parametro;
							break;
						case 13: 
							$SMTPPass = $config->valor_parametro;
							break;
					}
				}
				
				unset($accountConfig);
				
				if($SMTPUse){
					$config = array(
						'auth' => 'login',
						'username' => $SMTPUser,
						'password' => $SMTPPass,
						'port' => $SMTPPort
					);
					$transport = new Zend_Mail_Transport_Smtp($SMTPServer, $config);
				}
				else{
					$transport = new Zend_Mail_Transport_Sendmail();
				}
				
				$messages = Doctrine_Query::create()
					->from('ScaMensagens m')
					->innerJoin('m.ScaTipoMensagem t')
					->where('m.sca_account_id = ' . $account->id)
					->addWhere('m.sca_status_mensagem_id = 1 OR m.sca_status_mensagem_id = 3')
					->orderBy('m.data_mensagem ASC');
				
				foreach($messages->execute() as $message){
					
					$mail = new Zend_Mail();
					$mail->setFrom($message->remetente);
					$mail->setSubject($message->assunto);
					
					$mail->setBodyText(str_replace(chr(13) . chr(10) . chr(13) . chr(10), "", str_replace(chr(9), "", $this->remove_HTML($message->corpo))));					
					$mail->setBodyHtml($message->corpo);
					
					if(strpos($message->destinatarios, ",") === false){
						$recipientes = array($message->destinatarios);
					}
					else{
						$recipientes = explode(',', $message->destinatarios);
					}
					
					$status = 0;
					$flag_error_log = false;
					
					foreach($recipientes as $email){
						$mail->addTo($email);
						try{
							$mail->send($transport);
						}
						catch(Zend_Mail_Exception $e){
							$status = 3;
							
							if(!$flag_error_log){
								$log = new ScaMensagensLog();
								$log->sca_mensagens_id = $message->id;
								$log->data_log = DMG_Date::now();
								$log->texto_log = DMG_Translate::_('mensagem.log.erro') . " - " . $e->getMessage();
								$log->save();
								$flag_error_log = true;
							}
							
							echo($e->getMessage() . "\n");
						}
						$mail->clearRecipients();
					}
					
					if($status == 0){
						$status = 2;
						
						$log = new ScaMensagensLog();
						$log->sca_mensagens_id = $message->id;
						$log->data_log = DMG_Date::now();
						$log->texto_log = DMG_Translate::_('mensagem.log.success');
						$log->save();
					} 
					
					$message->sca_status_mensagem_id = $status;
					$message->save();
				}
			}
			
			echo('Script END = ' . date_format(date_create(DMG_Date::now()), 'd/m/Y H:i:s \\h\\s'));
		}
		catch(Exception $e){
			echo($e->getMessage() . "\n");
		}
	}
	
	public function remove_HTML($s , $keep = '' , $expand = 'script|style|noframes|select|option|title'){
		/**///prep the string
		$s = ' ' . $s;
	   
		/**///initialize keep tag logic
		if(strlen($keep) > 0){
			$k = explode('|',$keep);
			for($i=0;$i<count($k);$i++){
				$s = str_replace('<' . $k[$i],'[{(' . $k[$i],$s);
				$s = str_replace('</' . $k[$i],'[{(/' . $k[$i],$s);
			}
		}
	   
		//begin removal
		/**///remove comment blocks
		while(stripos($s,'<!--') > 0){
			$pos[1] = stripos($s,'<!--');
			$pos[2] = stripos($s,'-->', $pos[1]);
			$len[1] = $pos[2] - $pos[1] + 3;
			$x = substr($s,$pos[1],$len[1]);
			$s = str_replace($x,'',$s);
		}
	   
		/**///remove tags with content between them
		if(strlen($expand) > 0){
			$e = explode('|',$expand);
			for($i=0;$i<count($e);$i++){
				while(stripos($s,'<' . $e[$i]) > 0){
					$len[1] = strlen('<' . $e[$i]);
					$pos[1] = stripos($s,'<' . $e[$i]);
					$pos[2] = stripos($s,$e[$i] . '>', $pos[1] + $len[1]);
					$len[2] = $pos[2] - $pos[1] + $len[1];
					$x = substr($s,$pos[1],$len[2]);
					$s = str_replace($x,'',$s);
				}
			}
		}
	   
		/**///remove remaining tags
		while(stripos($s,'<') > 0){
			$pos[1] = stripos($s,'<');
			$pos[2] = stripos($s,'>', $pos[1]);
			$len[1] = $pos[2] - $pos[1] + 1;
			$x = substr($s,$pos[1],$len[1]);
			$s = str_replace($x,'',$s);
		}
	   
		/**///finalize keep tag
		for($i=0;$i<count($k);$i++){
			$s = str_replace('[{(' . $k[$i],'<' . $k[$i],$s);
			$s = str_replace('[{(/' . $k[$i],'</' . $k[$i],$s);
		}
	   
		return trim($s);
	}
}