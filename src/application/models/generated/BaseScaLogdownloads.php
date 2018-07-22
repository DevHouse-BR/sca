<?php

/**
 * BaseScaLogdownloads
 * 
 * This class has been auto-generated by the Doctrine ORM Framework
 * 
 * @property integer $id
 * @property integer $sca_anexos_id
 * @property timestamp $data_download
 * @property integer $id_usuario
 * @property ScaAnexos $ScaAnexos
 * 
 * @package    ##PACKAGE##
 * @subpackage ##SUBPACKAGE##
 * @author     ##NAME## <##EMAIL##>
 * @version    SVN: $Id: Builder.php 6401 2009-09-24 16:12:04Z guilhermeblanco $
 */
abstract class BaseScaLogdownloads extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('sca_logdownloads');
        $this->hasColumn('id', 'integer', 4, array(
             'type' => 'integer',
             'unsigned' => false,
             'primary' => true,
             'autoincrement' => true,
             'length' => '4',
             ));
        $this->hasColumn('sca_anexos_id', 'integer', 4, array(
             'type' => 'integer',
             'unsigned' => false,
             'notnull' => true,
             'primary' => false,
             'length' => '4',
             ));
        $this->hasColumn('data_download', 'timestamp', 25, array(
             'type' => 'timestamp',
             'notnull' => false,
             'primary' => false,
             'length' => '25',
             ));
        $this->hasColumn('id_usuario', 'integer', 4, array(
             'type' => 'integer',
             'unsigned' => false,
             'notnull' => false,
             'primary' => false,
             'length' => '4',
             ));
    }

    public function setUp()
    {
        parent::setUp();
    $this->hasOne('ScaAnexos', array(
             'local' => 'sca_anexos_id',
             'foreign' => 'id'));
    }
}