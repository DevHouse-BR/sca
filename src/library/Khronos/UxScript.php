<?php

class Khronos_UxScript {
	public static function add() {
		$retrn = self::recurciveListing('extjs/ux');
		$retrn = explode("|", $retrn);
		$vazio = array_pop($retrn);
		return $retrn;
	}

	public static function addJsDebug () {
		$retrn = self::recurciveListing('../application/views/scripts');
		$retrn = explode("|", $retrn);
		$vazio = array_pop($retrn);
		return $retrn;
	}

	private static function recurciveListing($dir) {
	        if($dir == "") return "";
	
		{
			$ultimoDirExp = explode('/', $dir);
			$ultimoDir = $ultimoDirExp[ count($ultimoDirExp)-1 ];
	
			if( $ultimoDir[0] == '.' )
				return "";	
		}

		if(is_file($dir)){
			if( strpos($dir, ".js") !== false){
				return $dir . "|";
			}
		}

		if(!is_dir($dir))
			return "";

		$concat = "";
		$dirList = scandir($dir);

		foreach($dirList as $child){
			$concat .= self::recurciveListing($dir.'/'.$child);
		}
		
		return $concat;
	}
}

