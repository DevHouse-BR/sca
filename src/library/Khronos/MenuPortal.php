<?php
class Khronos_MenuPortal {
	public function getArray () {
		$menu = array(
			array('nome' => 'menu.portal.menu', 'iconCls' => 'icon-admin', 'filhos' => array(
				array('nome' => 'menu.portal.view_posts', 'iconCls' => 'icon-postagens', 'permissao' => '', 'eXtype' => 'pcontrole-postagens')
			))
		);
		$json = array();
		foreach ($menu as $k) {
			$children = array();
			if (!isset($k['filhos']) || !count($k['filhos'])) {
				continue;
			}
			foreach ($k['filhos'] as $m) {
				$children[] = array(
					'text' => DMG_Translate::_($m['nome']),
					'leaf' => true,
					'iconCls' => $m['iconCls'],
					'eXtype' => $m['eXtype']
				);
			}
			if (count($children)) {
				$json[] = array(
					'title' => DMG_Translate::_($k['nome']),
					'iconCls' => $k['iconCls'],
					'root' => array('children' => $children)
				);
			}
		}
		return $json;
	}
	public function getJson () {
		return Zend_Json::encode(Khronos_MenuPortal::getArray());
	}
}
