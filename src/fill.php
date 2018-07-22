<?php
set_time_limit(0);
@ob_start();

if(!isset($_SERVER["HTTP_USER_AGENT"])) $nova_linha = chr(10) . chr(9);
else $nova_linha = "<br />";

set_include_path(implode(PATH_SEPARATOR, array(get_include_path(), dirname(__FILE__) . '/library/')));

define('APPLICATION_PATH', realpath('./application/'));

function __autoload ($a) {
	$a = explode('_', $a);
	$a = implode('/', $a);
	require_once('library/' . $a . '.php');
}

include_once 'library/Doctrine.php';

$loader = Zend_Loader_Autoloader::getInstance();
$loader->pushAutoloader(array('Doctrine', 'autoload'));
$doctrineConfig = new Zend_Config_Ini('application/configs/application.ini', 'development');
$doctrineConfig = $doctrineConfig->toArray();
$doctrineConfig = $doctrineConfig['doctrine'];
$manager = Doctrine_Manager::getInstance();
$manager->setAttribute(Doctrine::ATTR_USE_DQL_CALLBACKS, true);
$manager->setAttribute(Doctrine::ATTR_MODEL_LOADING, Doctrine::MODEL_LOADING_CONSERVATIVE);
Doctrine::loadModels($doctrineConfig['models_path']);
$manager->setCollate('utf8_unicode_ci');
$manager->setCharset('utf8');
$manager->openConnection($doctrineConfig['connection_string']);

if (!Zend_Auth::getInstance()->authenticate(new DMG_Auth_Adapter('admin', 'uKxlTJDELwM/msauaH3+UQ', 1))->isValid()) {
	throw new Exception('não logou');
}


for($i = 2; $i < 11; $i++){
	$account = new ScaAccount();
	$account->nome_account = "Account de Teste " . $i;
	$account->email_account = "leonardo@devhouse.com.br";
	$account->fl_ativa = true;
	$account->save();
	
	@mkdir('files/' . $i);
	@mkdir('files/' . $i . '/temp');
	@mkdir('public/files/' . $i);
	@copy('public/files/1/account_logo.png', 'public/files/' . $i . '/account_logo.png');
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 1;
	$accountConfig->valor_parametro = 15;
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 2;
	$accountConfig->valor_parametro = 'files/' . $i . '/account_logo.png';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 3;
	$accountConfig->valor_parametro = 'pt_BR';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 4;
	$accountConfig->valor_parametro = 'Bem vindo ao Sistema de Compartilhamento de Arquivos - Account ' . $i;
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 5;
	$accountConfig->valor_parametro = 'Texto a ser exibido no rodapé do Sistema';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 6;
	$accountConfig->valor_parametro = 'Portal do Cliente - Account ' . $i;
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 7;
	$accountConfig->valor_parametro = 'Para suporte, ligue: 0800 999 999';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 8;
	$accountConfig->valor_parametro = 'Bem vindo ao nosso Portal do Cliente';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 9;
	$accountConfig->valor_parametro = 'SIM';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 10;
	$accountConfig->valor_parametro = 'smtp.servidor.com.br';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 11;
	$accountConfig->valor_parametro = '25';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 12;
	$accountConfig->valor_parametro = 'usuario@servidor.com.br';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 13;
	$accountConfig->valor_parametro = '********';
	$accountConfig->save();
	
	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 14;
	$accountConfig->valor_parametro = '100';
	$accountConfig->save();

	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 15;
	$accountConfig->valor_parametro = 'jpg,gif,png,svg,pdf,dwg,rar,zip,xls,doc';
	$accountConfig->save();

	$accountConfig = new ScaAccountRelationConfig();
	$accountConfig->sca_account_id = $account->id;
	$accountConfig->sca_account_config_id = 16;
	$accountConfig->valor_parametro = 'NÃO';
	$accountConfig->save();
	
	unset($accountConfig);
	
	$adminGroup = new ScmGroup();
	$adminGroup->name = "Administradores";
	$adminGroup->sca_account_id = $account->id;
	$adminGroup->save();
	
	for($j = 1; $j < 27; $j++){
		if($j==14) $j++;
		$groupRule = new ScmGroupRule();
		$groupRule->group_id = $adminGroup->id;
		$groupRule->rule_id = $j;
		$groupRule->save();
	}
	
	unset($groupRule);
	
	$opGroup = new ScmGroup();
	$opGroup->name = "Operadores";
	$opGroup->sca_account_id = $account->id;
	$opGroup->save();
	
	$admin = new ScmUser();
	$admin->sca_account_id = $account->id;
	$admin->tipo_usuario = "I";
	$admin->nome_usuario = "Administrador da Account " . $account->id;
	$admin->login_usuario = "admin";
	$admin->senha_usuario = 'uKxlTJDELwM/msauaH3+UQ';
	$admin->recebe_mensagem = true;
	$admin->idioma_usuario = "pt_BR";
	$admin->email = "admin@devhouse.com.br";
	$admin->fl_system = true;
	$admin->fl_status = true;
	$admin->save();
	
	$userGroup = new ScmUserGroup();
	$userGroup->user_id = $admin->id;
	$userGroup->group_id = $adminGroup->id;	
	$userGroup->save();
	
	unset($adminGroup);
	unset($userGroup);
	
	$dpto1 = new ScaDepartamentos();
	$dpto1->cod_departamento = $account->id . str_pad(1, 6, '0');
	$dpto1->nome_departamento = "Departamento 1";
	$dpto1->dt_criacao = DMG_Date::now();
	$dpto1->id_gerente = $admin->id;
	$dpto1->id_criador = $admin->id;
	$dpto1->sca_account_id = $account->id;
	$dpto1->save();
	
	$dpto2 = new ScaDepartamentos();
	$dpto2->cod_departamento = $account->id . str_pad(2, 6, '0');
	$dpto2->nome_departamento = "Departamento 2";
	$dpto2->dt_criacao = DMG_Date::now();
	$dpto2->id_gerente = $admin->id;
	$dpto2->id_criador = $admin->id;
	$dpto2->sca_account_id = $account->id;
	$dpto2->save();
	
	$departamento = 1;
	
	for($j = 1; $j < 50; $j++){
		$usuario = new ScmUser();
		$usuario->sca_account_id = $account->id;
		$usuario->tipo_usuario = "I";
		$usuario->nome_usuario = "Usuário " . $j . " da Account " . $account->id;
		$usuario->login_usuario = "usuario" . $j;
		$usuario->senha_usuario = 'uKxlTJDELwM/msauaH3+UQ';
		$usuario->recebe_mensagem = true;
		$usuario->idioma_usuario = "pt_BR";
		$usuario->email = "email" . $j . "@devhouse.com.br";
		$usuario->fl_system = false;
		$usuario->fl_status = true;
		
		if($departamento == 1){
			$usuario->sca_departamentos_id = $dpto1->id;
			$departamento = 2;
		}
		else{
			$usuario->sca_departamentos_id = $dpto2->id;
			$departamento = 1;
		}		
		$usuario->save();
		
		$userGroup = new ScmUserGroup();
		$userGroup->user_id = $usuario->id;
		$userGroup->group_id = $opGroup->id;		
		$userGroup->save();
	}
	
	unset($opGroup);
	unset($userGroup);
	unset($dpto1);
	unset($dpto2);
	
	for($j = 1; $j < 100; $j++){
		$cliente = new ScaClientes();
		$cliente->cod_cliente = $account->id . str_pad($j, 6, '0');
		$cliente->nome_cliente = "Cliente " . $j . " da Account " . $account->id;
		$cliente->sca_account_id = $account->id;
		$cliente->id_responsavel = $admin->id;
		$cliente->id_criador = $admin->id;
		$cliente->dt_cadastro = DMG_Date::now();
		$cliente->fl_acesso_portal = true;
		$cliente->save();
		
		@copy('public/files/1/client_logo_1', 'public/files/' . $i . '/client_logo_' . $cliente->id);
		
		for($x = 1; $x < 100; $x++){
			$postagem = new ScaPostagens();
			$postagem->sca_account_id = $account->id;
			$postagem->scm_user_id = $admin->id;
			$postagem->data_postagem = DMG_Date::now();
			$postagem->titulo_postagem = "Postagem de Teste " . $x;
			$postagem->sca_clientes_id = $cliente->id;
			$postagem->texto_postagem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dolor justo, laoreet a dictum et, eleifend non risus. Aliquam at magna semper quam interdum congue et eget ligula. Nam blandit sodales lorem non blandit. Pellentesque sed enim eget velit egestas luctus tincidunt nec orci. Pellentesque cursus nibh sit amet nisi sodales iaculis. Duis pharetra erat sed ipsum scelerisque nec vestibulum turpis dapibus. Maecenas vel suscipit nunc. Aenean placerat vehicula dolor, eu pulvinar nunc vestibulum sed. Nunc vitae lacus quis libero blandit interdum. Curabitur eros neque, consectetur in malesuada in, scelerisque sit amet nisi. Cras non ante id elit vehicula ultrices. Curabitur suscipit arcu quis urna porta egestas. Sed ultrices lorem sed orci euismod mattis lacinia erat eleifend. Nulla facilisis tincidunt sodales. Nulla ac nisi ante. Fusce nibh velit, porta in varius in, tristique quis arcu.";
			$postagem->fl_publicado = true;
			$postagem->fl_lida = false;
			$postagem->save();
			
			$anexo = new ScaAnexos();
			$anexo->sca_postagens_id = $postagem->id;
			$anexo->nome_anexo = 'doc1.doc';
			$anexo->caminho_anexo = realpath(APPLICATION_PATH . '/../files') . '/' . $account->id . '/' . $postagem->id . '/doc1.doc';
			$anexo->tipo_anexo = 'application/msword';
			$anexo->save();
			
			$anexo = new ScaAnexos();
			$anexo->sca_postagens_id = $postagem->id;
			$anexo->nome_anexo = 'doc2.doc';
			$anexo->caminho_anexo = realpath(APPLICATION_PATH . '/../files') . '/' . $account->id . '/' . $postagem->id . '/doc2.doc';
			$anexo->tipo_anexo = 'application/msword';
			$anexo->save();
			
			@copy('fill-doc1.doc', 'files/' .  $account->id . '/' . $postagem->id . '/doc1.doc');
			@copy('fill-doc2.doc', 'files/' .  $account->id . '/' . $postagem->id . '/doc2.doc');
			
			$messenger = new Khronos_SendRecMessage();
			$messenger->Send('leonardo@devhouse.com.br,leo.lima.web@gmail.com,leonardo.vasconcellos@gmail.com,leo_lima_jlle@yahoo.com.br', DMG_Translate::_('mensagem.tipo1.assunto'), DMG_Translate::_('mensagem.tipo1.corpo'), 1, $postagem->id);
		}
		
		
		for($x = 1; $x < 10; $x++){
			$usuario = new ScmUser();
			$usuario->sca_account_id = $account->id;
			$usuario->sca_clientes_id = $cliente->id;
			$usuario->tipo_usuario = "P";
			$usuario->nome_usuario = "Usuário " . $x . " do Cliente " . $cliente->id . " da Account " . $account->id;
			$usuario->login_usuario = "usuario_cliente" . $x;
			$usuario->senha_usuario = 'uKxlTJDELwM/msauaH3+UQ';
			$usuario->recebe_mensagem = true;
			$usuario->idioma_usuario = "pt_BR";
			$usuario->email = "email_cliente" . $x . "@devhouse.com.br";
			$usuario->fl_system = false;
			$usuario->fl_status = true;
			$usuario->save();
		}
	}
	
	unset($cliente);
	unset($usuario);
	
	echo("Account " . $i . " Criada. Token de Login: " . DMG_Asc2Hex::toHex($account->nome_account) . $nova_linha);
	@ob_flush();
	@flush();
}
@ob_end_flush();