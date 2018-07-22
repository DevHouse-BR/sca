<?php
error_reporting(0);
define('APPLICATION_ENV', 'development');
defined('APPLICATION_PATH') || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../../application'));

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

if(!Zend_Auth::getInstance()->hasIdentity() || (!DMG_Acl::canAccess(27))){
	die(utf8_decode(DMG_Translate::_('administration.group.permission.denied')));
}


/**
 * @version $Id: index.php 107 2008-07-22 17:27:12Z soeren $
 * @package eXtplorer
 * @copyright soeren 2007-2009
 * @author The eXtplorer project (http://joomlacode.org/gf/project/joomlaxplorer/)
 * @author The  The QuiX project (http://quixplorer.sourceforge.net)
 * 
 * @license
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * 
 * Alternatively, the contents of this file may be used under the terms
 * of the GNU General Public License Version 2 or later (the "GPL"), in
 * which case the provisions of the GPL are applicable instead of
 * those above. If you wish to allow use of your version of this file only
 * under the terms of the GPL and not to allow others to use
 * your version of this file under the MPL, indicate your decision by
 * deleting  the provisions above and replace  them with the notice and
 * other provisions required by the GPL.  If you do not delete
 * the provisions above, a recipient may use your version of this file
 * under either the MPL or the GPL."
 * 
 * Main File for the standalone version
 */
// When eXtplorer is running as a component in Joomla! or Mambo, we deny access to this standalone version
if( stristr( $_SERVER['SCRIPT_NAME'], 'administrator/components/com_extplorer')) {
	header( 'HTTP/1.0 404 Not Found');
	header( 'Location: http://'.$_SERVER['HTTP_HOST']);
	exit;
}

// Set flag that this is a parent file
define( '_VALID_MOS', 1 );
define( '_VALID_EXT', 1 );

require_once( dirname(__FILE__).'/libraries/standalone.php');
ob_start();
include( dirname(__FILE__).'/admin.extplorer.php' );
$mainbody = ob_get_contents();
ob_end_clean();

extInitGzip();
header( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
header( 'Cache-Control: no-store, no-cache, must-revalidate' );
header( 'Cache-Control: post-check=0, pre-check=0', false );
header( 'Pragma: no-cache' );

echo '<?xml version="1.0" encoding="'. $GLOBALS["charset"].'">';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<?php echo $mainframe->getHead(); ?>
		<link rel="shortcut icon" href="<?php echo _EXT_URL ?>/eXtplorer.ico" />
		<meta http-equiv="Content-Type" content="text/html; <?php echo $GLOBALS["charset"]; ?>" />
		<meta name="robots" content="noindex, nofollow" />
	</head>
	<body>
		<?php echo $mainbody; ?>
	</body>
</html>
<?php
extDoGzip();

?>
