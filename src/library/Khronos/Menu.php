<?php

class Khronos_Menu {
	public function getArray () {
		$menu = array(
			array('nome' => 'menu.administration', 'filhos' => array(
				array('nome' => 'menu.administration.group', 'permissao' => 7, 'eXtype' => 'administration-group'),
				array('nome' => 'menu.administration.user', 'permissao' => 3, 'eXtype' => 'administration-user'),
				array('nome' => 'menu.administration.configuration', 'permissao' => array(1, 14), 'eXtype' => 'administration-config'),
				array('nome' => 'menu.administration.settings', 'permissao' => 1, 'eXtype' => 'administration-settings'),
				array('nome' => 'menu.administration.acc', 'permissao' => 14, 'eXtype'=> 'administration-acc'),
			)),
			array('nome' => 'menu.controle', 'filhos' => array(
				array('nome' => 'menu.controle.departamentos', 'permissao' => 15, 'eXtype' => 'controle-departamentos'),
				array('nome' => 'menu.controle.clientes', 'permissao' => 17, 'eXtype' => 'controle-clientes'),
			)),
		);
		$json = array();
		foreach ($menu as $k) {
			$children = array();
			if (!isset($k['filhos']) || !count($k['filhos'])) {
				continue;
			}
			foreach ($k['filhos'] as $m) {
				$permite = true;
				if (is_array($m['permissao'])){
					foreach($m['permissao'] as $x){
						if (!DMG_Acl::canAccess($x))
							$permite=false;
					}
				} else {
					if (!DMG_Acl::canAccess($m['permissao']))
						$permite=false;
				}
				if ($permite) {
					$children[] = array(
						'text' => DMG_Translate::_($m['nome']),
						'leaf' => true,
						'iconCls' => 'no-icon',
						'eXtype' => $m['eXtype']
					);
				}
			}
			if (count($children)) {
				$json[] = array(
					'title' => DMG_Translate::_($k['nome']),
					'iconCls' => 'silk-cog',
					'root' => array('children' => $children)
				);
			}
		}
		return $json;
	}
	public function getJson () {
		return Zend_Json::encode(Khronos_Menu::getArray());
	}
}
