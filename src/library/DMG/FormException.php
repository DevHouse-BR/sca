<?php
/**
* Autor: LEONARDO LIMA DE VASCONCELLOS
*/

class DMG_FormException extends Exception {
	private $errors;
	
	public function __construct ($message, $erros) {
		$this->errors = $erros;
		parent::__construct($message, 0);
	}
	
	public function getErrors(){
		return array(
			'success' => false,
			'errormsg' => $this->getMessage(),
			'errors' => array(
				$this->errors['field'] => $this->errors['message']
			)
		);
	}
}

?>