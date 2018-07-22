<?php 
	$root = realpath(getcwd()."/../../files/".Zend_Auth::getInstance()->getIdentity()->sca_account_id . "/repositorio");
	if(!file_exists($root)){
		die("Internal Server Error #2340");
	}

	/** ensure this file is being included by a parent file */
	defined( "_VALID_MOS" ) or die( "Direct Access to this location is not allowed." );
	$GLOBALS["users"]=array(
	array("admin","369caa2a10b5a91c1dd0e162b40f3754","C:/wamp/www/","http://localhost",1,"",7,1),
	array("sca","89328e64d93584903759f61054b68a0b",$root,"http://localhost",0,"",1,1),
); 
?>
