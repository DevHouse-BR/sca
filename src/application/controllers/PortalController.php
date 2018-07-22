<?php

class PortalController extends Zend_Controller_Action {
	
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
	}
	
	public function logoutAction () {
		Zend_Auth::getInstance()->clearIdentity();
		$this->_helper->redirector('index', 'portal');
	}
	public function indexAction () {
		echo $this->view->render('portal/index.phtml');
	}
	
	public function authAction () {
		if (!$this->getRequest()->isPost()) {
			return;
		}
		$auth = Zend_Auth::getInstance();
		$auth->setStorage(new Zend_Auth_Storage_Session('portalAuth'));
		
		$resultado = $auth->authenticate(new DMG_PortalAuth_Adapter($this->getRequest()->getParam('loginUsername'),$this->getRequest()->getParam('loginPassword')));
		$this->getResponse()->setHeader('Content-Type', 'application/json');
		if (!$resultado->isValid()) {
			echo Zend_Json::encode(array('failure' => true, 'errormsg'=>$resultado->getMessages()));
		}
		else echo Zend_Json::encode(array('success' => true));
	}
	
	public function desktopAction () {
		$auth = Zend_Auth::getInstance();
		$auth->setStorage(new Zend_Auth_Storage_Session('portalAuth'));
		if($auth->hasIdentity()) echo $this->view->render('portal/desktop.phtml');
		else echo $this->view->render('portal/index.phtml');
	}
	
	public function jsloginAction () {		
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'text/javascript; charset=UTF-8');
			
		$js = $this->view->render('index/i18n.js');
		$js .= $this->view->render('portal/pt-BR.js');
		
		
		/*$js = str_replace('"images/', '"../images/', $js);
		$js = str_replace("'images/", "'../images/", $js);
		$js = str_replace("'extjs/resources", "'../extjs/resources", $js);
		$js = str_replace('"extjs/resources', '"../extjs/resources', $js);*/
		
		if(getenv('APPLICATION_ENV') == 'development') echo($js);
		else echo(DMG_JSMin::minify($js));
	}
	
	public function jsAction () {
		$auth = Zend_Auth::getInstance();
		$auth->setStorage(new Zend_Auth_Storage_Session('portalAuth'));
		if(!$auth->hasIdentity()) return;
		
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'text/javascript; charset=UTF-8');
			
		$js = $this->view->render('index/i18n.js');
		$js .= $this->view->render('portal/base.js');
		$js .= $this->view->render('portal/pt-BR.js');
		
		
		$js = str_replace('"images/', '"../images/', $js);
		$js = str_replace("'images/", "'../images/", $js);
		$js = str_replace("'extjs/resources", "'../extjs/resources", $js);
		$js = str_replace('"extjs/resources', '"../extjs/resources', $js);
		
		$js .= $this->view->render('portal/consulta-parque-maquinas.js');
		$js .= $this->view->render('portal/consulta-contadores.js');
		
		
		
		if(getenv('APPLICATION_ENV') == 'development') echo($js);
		else echo DMG_JSMin::minify($js);
	}
	
	public function parquelistAction() {
		$auth = Zend_Auth::getInstance();
		$auth->setStorage(new Zend_Auth_Storage_Session('portalAuth'));
		if(!$auth->hasIdentity()) return;
		
		$id_local = Zend_Auth::getInstance()->getIdentity()->id_local;
		
		$query = Doctrine_Query::create()->from('ScmMaquina m');
		$query->where('m.id_local = ' . $id_local);
		$query->innerJoin('m.ScmStatusMaquina s')->addWhere('s.fl_alta = 1');
		
		$limit = (int) $this->getRequest()->getParam('limit');
		if ($limit > 0) $query->limit($limit);
		
		$offset = (int) $this->getRequest()->getParam('start');
		if ($offset > 0) $query->offset($offset);
		
		$sort = (string) $this->getRequest()->getParam('sort');
		$dir = (string) $this->getRequest()->getParam('dir');
		
		if ($sort && ($dir == 'ASC' || $dir == 'DESC')) {
			$query->orderby($sort . ' ' . $dir);
		}
		
		$data = array();
		foreach ($query->execute() as $k) {
			$data[] = array(
				'id' => $k->id,
				'nr_serie_connect' => $k->nr_serie_connect,
				'nr_serie_aux' => $k->nr_serie_aux,
				'nm_jogo' => $k->ScmJogo->nm_jogo,
				'nr_versao_jogo' => $k->nr_versao_jogo,
				'nm_gabinete' => $k->ScmGabinete->nm_gabinete,
				'nm_moeda' => $k->ScmMoeda->nm_moeda,
				'vl_credito' => $k->vl_credito,
				'dt_ultima_movimentacao' => $k->dt_ultima_movimentacao,
				'dt_ultimo_faturamento' => $k->dt_ultimo_faturamento,
				'dt_ultima_transformacao' => $k->dt_ultima_transformacao,
				'dt_ultima_regularizacao' => $k->dt_ultima_regularizacao
			);
		}
		echo Zend_Json::encode(array('success' => true,'total' => $query->count(), 'data' => $data));
	}
	
	public function contadoreslistAction() {
		$auth = Zend_Auth::getInstance();
		$auth->setStorage(new Zend_Auth_Storage_Session('portalAuth'));
		if(!$auth->hasIdentity()) return;
		
		$id_local = Zend_Auth::getInstance()->getIdentity()->id_local;
		
		$query = Doctrine_Query::create()->from('ScmMaquina m');
		$query->where('m.id_local = ' . $id_local);
		$query->innerJoin('m.ScmStatusMaquina s')->addWhere('s.fl_alta = 1');
		
		$limit = (int) $this->getRequest()->getParam('limit');
		if ($limit > 0) $query->limit($limit);
		
		$offset = (int) $this->getRequest()->getParam('start');
		if ($offset > 0) $query->offset($offset);
		
		$sort = (string) $this->getRequest()->getParam('sort');
		$dir = (string) $this->getRequest()->getParam('dir');
		
		if ($sort && ($dir == 'ASC' || $dir == 'DESC')) {
			$query->orderby($sort . ' ' . $dir);
		}
		
		$query->innerJoin('m.ScmFilial f')->innerJoin('f.ScmEmpresa e')->innerJoin('e.ScmUserEmpresa ue')->addWhere('ue.user_id = ' . Zend_Auth::getInstance()->getIdentity()->id);
		$data = array();
		foreach ($query->execute() as $k) {
			$data[] = array(
				'id' => $k->id,
				'nr_serie_connect' => $k->nr_serie_connect,
				'nr_serie_aux' => $k->nr_serie_aux,
				'nm_jogo' => $k->ScmJogo->nm_jogo,
				'nr_versao_jogo' => $k->nr_versao_jogo,
				'nm_status_maquina' => $k->ScmStatusMaquina->nm_status_maquina,
				'nm_moeda' => $k->ScmMoeda->nm_moeda,
				'vl_credito' => $k->vl_credito,
				'id_local' => $k->id_local,
				'id_protocolo' => $k->id_protocolo,
				'dt_ultima_movimentacao' => $k->dt_ultima_movimentacao,
				'dt_ultimo_faturamento' => $k->dt_ultimo_faturamento,
				'dt_ultima_transformacao' => $k->dt_ultima_transformacao,
				'dt_ultima_regularizacao' => $k->dt_ultima_regularizacao			
			);
		}
		echo Zend_Json::encode(array('success' => true,'total' => $query->count(), 'data' => $data));
	}
	
	public function getcontadoresAction() {
		Khronos_Servidor::getContadoresPorMaquinas($this->getRequest()->getParam('id'));
	}
}