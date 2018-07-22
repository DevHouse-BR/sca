<?php

class DMG_Auth_Adapter implements Zend_Auth_Adapter_Interface {
	private $_username;
	private $_password;

	public function __construct($username, $password) {
                $this->_username = $username;
                $this->_password = $password;
	}

	public static function getInstance() {
		if(self::$instance == null){
			self::$instance = new DMG_Auth_Adapter();
		}

		return self::$instance;
	}

	public function authenticate() {
		try {
			$user = Doctrine_Query::create()->from('ScmUser')->where('login_usuario = ?', $this->_username)
					->addWhere('senha_usuario = ?', $this->_password)->addWhere('fl_status = ?', 1)->addWhere('tipo_usuario = ?', 'I')->fetchOne();
			if (!$user) {
				return new Zend_Auth_Result(Zend_Auth_Result::FAILURE, null, array('auth.loginerror'));
			} else {
				return new Zend_Auth_Result(Zend_Auth_Result::SUCCESS, $user, array());
			}
		} catch(Exception $e) {
			return new Zend_Auth_Result(Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID, null, array('auth.loginerror'));
		}
	}

	public function suName() { //retorna o nome do SuperUser
		return 'root';
	}
	public function sgName() { //retorna o nome do SuperGroup
		return 'Root';
	}
	public function scName() { //retorna o nome do SuperAccount
		return 'rootAccount';
	}
}
