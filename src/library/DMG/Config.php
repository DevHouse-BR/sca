<?php

class DMG_Config {
	protected function __construct () {
		throw new Exception("This class can't be instanciated.");
	}
	public static function get ($id) {
		static $configs = array();
		if (empty($configs)) {
			foreach (Doctrine::getTable('ScmConfig')->findAll() as $k) {
				$configs[$k->id] = $k->value;
			}
		}
		return $configs[$id];
	}
	public static function getAccountCfg($id) {
		$config = $query = Doctrine_Query::create()
				->select('valor_parametro')
				->from('ScaAccountRelationConfig c')
				->where('c.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id)
				->addWhere('c.sca_account_config_id = ?', $id);
				
		foreach ($query->execute(array(), Doctrine::HYDRATE_SCALAR) as $k) {
			return $k['c_valor_parametro'];
		}
	}
	
	public static function getAccountCfgWithId($id, $account) {
		$config = $query = Doctrine_Query::create()
				->select('valor_parametro')
				->from('ScaAccountRelationConfig c')
				->where('c.sca_account_id = ?', $account)
				->addWhere('c.sca_account_config_id = ?', $id);
				
		foreach ($query->execute(array(), Doctrine::HYDRATE_SCALAR) as $k) {
			return $k['c_valor_parametro'];
		}
	}
}