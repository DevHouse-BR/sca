<?php

class Khronos_Menu {
	public function getArray () {
		$menu = array(
			array('nome' => 'menu.administration', 'iconCls' => 'icon-admin', 'filhos' => array(
				array('nome' => 'menu.administration.group', 'permissao' => 7, 'eXtype' => 'administration-group', 'iconCls' => 'silk-group'),
				array('nome' => 'menu.administration.user', 'permissao' => 3, 'eXtype' => 'administration-user', 'iconCls' => 'icon-user'),
				array('nome' => 'menu.administration.configuration', 'permissao' => array(1, 14), 'eXtype' => 'administration-config', 'iconCls' => 'icon-config'),
				array('nome' => 'menu.administration.settings', 'permissao' => 1, 'eXtype' => 'administration-settings', 'iconCls' => 'icon-config'),
				array('nome' => 'menu.administration.extplorer', 'permissao' => 27, 'eXtype'=> 'extplorer', 'iconCls' => 'icon-explorer'),
				array('nome' => 'menu.administration.acc', 'permissao' => 14, 'eXtype'=> 'administration-acc', 'iconCls' => 'icon-config')
			)),
			array('nome' => 'menu.controle', 'iconCls' => 'icon-postagens', 'filhos' => array(
				array('nome' => 'menu.controle.departamentos', 'permissao' => 15, 'eXtype' => 'controle-departamentos', 'iconCls' => 'icon-departamento'),
				array('nome' => 'menu.controle.clientes', 'permissao' => 17, 'eXtype' => 'controle-clientes', 'iconCls' => 'icon-cliente'),
				array('nome' => 'menu.controle', 'permissao' => 21, 'eXtype' => 'controle-postagens', 'iconCls' => 'icon-postagens'),
				array('nome' => 'menu.controle.mensagens', 'permissao' => 24, 'eXtype' => 'controle-mensagens', 'iconCls' => 'icon-mensagens')
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
						'iconCls' => $m['iconCls'],
						'permissao' => $m['permissao'],
						'eXtype' => $m['eXtype']
					);
				}
			}
			if (count($children)) {
				$json[] = array(
					'title' => DMG_Translate::_($k['nome']),
					'iconCls' => $k['iconCls'],
					'bodyStyle'=>'padding-bottom:10px',
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
