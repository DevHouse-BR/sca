<?php

class DMG_Portal_Auth_Adapter implements Zend_Auth_Adapter_Interface {
	private $_username;
	private $_password;
	private $_account;

	public function __construct($username, $password, $account) {
                $this->_username = $username;
                $this->_password = $password;
                $this->_account = $account;
	}

	public static function getInstance() {
		if(self::$instance == null){
			self::$instance = new DMG_Portal_Auth_Adapter();
		}

		return self::$instance;
	}

	public function authenticate() {
		try {
			$user = Doctrine_Query::create()
					->from('ScmUser u')
					->where('u.login_usuario = ?', $this->_username)
					->innerJoin('u.ScaAccount a')
					->addWhere('u.senha_usuario = ?', $this->_password)
					->addWhere('u.sca_account_id = ?', $this->_account)
					->addWhere('u.fl_status = ?', 1)
					->addWhere('u.tipo_usuario = ?', 'P')
					->addWhere('a.fl_ativa = ?', true)
					->addWhere('u.ScaClientes.fl_acesso_portal = ?', true)
					->fetchOne();

			if (!$user) {
				return new Zend_Auth_Result(Zend_Auth_Result::FAILURE, null, array('auth.loginerror'));
			} else {
				return new Zend_Auth_Result(Zend_Auth_Result::SUCCESS, $user, array());
			}
		} catch(Exception $e) {
			return new Zend_Auth_Result(Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID, null, array('auth.loginerror'));
		}
	}
}
