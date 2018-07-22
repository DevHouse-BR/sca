<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {
	public function _initDMG () {
		Zend_Loader_Autoloader::getInstance()->registerNamespace('DMG');
		Zend_Loader_Autoloader::getInstance()->registerNamespace('Khronos');
	}
	public function _initRouter () {
		Zend_Controller_Front::getInstance()->getRouter()->addRoute('css', new Zend_Controller_Router_Route_Regex(
			'extjs\/resources\/css\/([a-zA-Z0-9-_.]*)\.css',
			array('action' => 'compressedcss', 'controller' => 'index', 'module' => 'default'),
			array(1 => 'slug'),
			'extjs/resources/css/%s.css'
		));
		
		Zend_Controller_Front::getInstance()->getRouter()->addRoute('login', new Zend_Controller_Router_Route('login/:token', array(
			'module'=> 'default',  
			'controller' => 'index',  
			'action'=> 'index'
		)));
	}
	public function _initDoctrine () {
		require_once 'Doctrine.php';
		$loader = Zend_Loader_Autoloader::getInstance();
		$loader->pushAutoloader(array('Doctrine', 'autoload'));
		$doctrineConfig = $this->getOption('doctrine');
		$manager = Doctrine_Manager::getInstance();
		$manager->setAttribute(Doctrine::ATTR_USE_DQL_CALLBACKS, true);
		$manager->setAttribute(Doctrine::ATTR_MODEL_LOADING, Doctrine::MODEL_LOADING_CONSERVATIVE);
		Doctrine::loadModels($doctrineConfig['models_path']);
		$manager->setCollate('utf8_unicode_ci');
		$manager->setCharset('utf8');
		$manager->openConnection($doctrineConfig['connection_string']);
		return $manager;
	}
	public function _initPlugins () {
		$this->getPluginResource('frontcontroller')->getFrontController()->registerPlugin(new DMG_Auth_Plugin());
	}
}