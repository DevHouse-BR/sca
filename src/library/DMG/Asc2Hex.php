<?php

class DMG_Asc2Hex {
	
	protected function __construct () {
		throw new Exception("This class can't be instanciated.");
	}
	
	public function toHex($ascii) {
		$hex = '';
		for ($i = 0; $i < strlen($ascii); $i++) {
			$byte = strtoupper(dechex(ord($ascii{$i})));
			$byte = str_repeat('0', 2 - strlen($byte)).$byte;
			$hex.=$byte;
		}
		return $hex;
	}
	
	function toAsc($hex){
		$ascii='';
		$hex=trim($hex);
		
		for($i=0; $i<strlen($hex); $i=$i+2) {
			$ascii.=chr(hexdec(substr($hex, $i, 2)));
		}
		
		return($ascii);
	}
	
	public function getLang () {
		if (Zend_Auth::getInstance()->hasIdentity()) {
			$lang = Zend_Auth::getInstance()->getIdentity()->idioma_usuario;
		}
		if (!isset($lang) || is_null($lang)) {
			$lang = DMG_Config::get(1);
		}
		return $lang;
	}
}
