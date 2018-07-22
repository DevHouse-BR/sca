<?php

class AccountController extends Zend_Controller_Action {
	public function init () {
		$this->_helper->viewRenderer->setNoRender(true);
		$this->view->headMeta()->appendHttpEquiv('Content-Type', 'application/json; charset=UTF-8');
	}
	public function listaccAction () {
		if (DMG_Acl::canAccess(14)) {
			echo DMG_Crud::index('ScaAccount', 'id, nome_account, email_account, fl_ativa');
		} else {
			echo Zend_Json::encode(array('success' => false));
		}
	}
}
