<?php

class DMG_Crud {
	public function rawIndex ($model, $fields) {
                $query = Doctrine_Query::create()->from($model.' u')->select($fields);
                $limit = (int) $this->getRequest()->getParam('limit');
                if ($limit > 0) {
                        $query->limit($limit);
                }
                $offset = (int) $this->getRequest()->getParam('start');
                if ($offset > 0) {
                        $query->offset($offset);
                }
                $sort = (string) $this->getRequest()->getParam('sort');
                $dir = (string) $this->getRequest()->getParam('dir');
                if ($sort && ($dir == 'ASC' || $dir == 'DESC')) {
                        $query->orderby($sort . ' ' . $dir);
                }
                $filter = $this->getRequest()->getParam('filter');
                if (is_array($filter)) {
                        foreach ($filter as $k) {
                                switch ($k['data']['type']) {
                                        case 'string':
                                                $query->addWhere($k['field'] . ' LIKE ?', '%' . $k['data']['value'] . '%');
                                        break;
                                        case 'list':
                                                $l = explode(',', $k['data']['value']);
                                                foreach ($l as $m) {
                                                        $query->orWhere($k['field'] . ' = ?', $m);
                                                }
                                        break;
                                }
                        }
                }
		
		return $query;
	}
	public function accIndex($model, $fields){
		$query = DMG_Crud::rawIndex($model, $fields);
		$query->addWhere('u.sca_account_id = ?', Zend_Auth::getInstance()->getIdentity()->sca_account_id);

                $varsExp = explode(',', $fields);
                $vars = array();
                foreach($varsExp as $k){
                        $vars[] = trim($k);
                }

                $data=array();

                foreach($query->execute() as $k){
                        $dTemp = array();
                        foreach($vars as $l){
                                if(strpos($l, '.')) {
                                        $du = explode('.', $l);
                                        $t2 = $k->{$du[0]};
                                        $dTemp[$du[1]] = $t2->{$du[1]};
                                } else {
                                        $dTemp[$l] = $k->{$l};
                                }
                        }
                        $data[]=$dTemp;
                }
	
		return Zend_Json::encode(array('total' => $query->count(), 'data' => $data ));
	}
	public function index ($model, $fields) {
		$query = DMG_Crud::rawIndex($model, $fields);

		$varsExp = explode(',', $fields);
		$vars = array();
		foreach($varsExp as $k){
			$vars[] = trim($k);
		}	
		
		$data=array();

		foreach($query->execute() as $k){
			$dTemp = array();
			foreach($vars as $l){
				if(strpos($l, '.')) {
					$du = explode('.', $l);
					$t2 = $k->{$du[0]};
					$dTemp[$du[1]] = $t2->{$du[1]};
				} else {
					$dTemp[$l] = $k->{$l};
				}
			}
			$data[]=$dTemp;
		}

		return Zend_Json::encode(array('total' => $query->count(), 'data' => $data ));
	}
	public function rawGet( $model, $id ) {
		$obj = Doctrine::getTable($model)->find($id);
		return $obj;
	}
	public function accGet( $model, $id ) {
		$obj = DMG_Crud::rawGet( $model, $id );

		if($obj->sca_account_id == Zend_Auth::getInstance()->getIdentity()->sca_account_id)
			return $obj;
		else
			return null;
	}
	public function get ($model, $id) {
		$obj = Doctrine::getTable($model)->find($id);
		if ($obj) {
			return Zend_Json::encode(array('success' => true, 'data' => $obj->toArray()));
		}
	}
	public function save ($model, $id, $fields) {
		if ($id == 0) {
			$obj = new $model();
		} else {
			$obj = Doctrine::getTable($model)->find($id);
		}
		foreach ($fields as $k) {
			$obj->$k = $this->getRequest()->getParam($k);
		}
		$obj->save();
		return Zend_Json::encode(array('success' => true, 'data' => $obj->toArray()));
	}
	public function delete ($model, $id) {
		if (!is_array($id)) {
			$id = array($id);
		}
		foreach ($id as $k) {
			$obj = Doctrine::getTable($model)->find($k);
			if ($obj) {
				try {
					$obj->delete();
				} catch (Exception $e) {
					#
				}
			}
		}
		return Zend_Json::encode(array('success' => true));
	}
	public function paginate (&$query, $limit, $start, $sort, $dir) {
		$limit = (int) $limit;
		if ($limit > 0) {
			$query->limit($limit);
		}
		$offset = (int) $start;
		if ($offset > 0) {
			$query->offset($offset);
		}
		$sort = (string) $sort;
		$dir = (string) $dir;
		if ($sort && ($dir == 'ASC' || $dir == 'DESC')) {
			$query->orderby($sort . ' ' . $dir);
		}
		$filter = $this->getRequest()->getParam('filter');
		if (is_array($filter)) {
			foreach ($filter as $k) {
				switch ($k['data']['type']) {
					case 'string':
						$query->addWhere($k['field'] . ' LIKE ?', '%' . $k['data']['value'] . '%');
					break;
					case 'list':
						$l = explode(',', $k['data']['value']);
						foreach ($l as $m) {
							$query->orWhere($k['field'] . ' = ?', $m);
						}
					break;
				}
			}
		}
	}
}
