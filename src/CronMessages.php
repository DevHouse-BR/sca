<?php
define('APPLICATION_ENV', 'development');
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/application'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));

/** Zend_Application */
require_once 'Zend/Application.php';  

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV, 
    APPLICATION_PATH . '/configs/application.ini'
);

Zend_Loader_Autoloader::getInstance()->registerNamespace('DMG');
Zend_Loader_Autoloader::getInstance()->registerNamespace('Khronos');

require_once 'Doctrine.php';

$loader = Zend_Loader_Autoloader::getInstance();
$loader->pushAutoloader(array('Doctrine', 'autoload'));
$doctrineConfig = $application->getOption('doctrine');
$manager = Doctrine_Manager::getInstance();
$manager->setAttribute(Doctrine::ATTR_USE_DQL_CALLBACKS, true);
$manager->setAttribute(Doctrine::ATTR_MODEL_LOADING, Doctrine::MODEL_LOADING_CONSERVATIVE);
Doctrine::loadModels($doctrineConfig['models_path']);
$manager->setCollate('utf8_unicode_ci');
$manager->setCharset('utf8');
$manager->openConnection($doctrineConfig['connection_string']);

Khronos_SendRecMessage::ExecSend();
