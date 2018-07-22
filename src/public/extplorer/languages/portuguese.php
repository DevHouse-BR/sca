<?php

// Portuguese Language Module for joomlaXplorer (translated by Paulo Brito, geral@oitavaesfera.com, http://www.oitavaesfera.com)
global $_VERSION;

$GLOBALS["charset"] = "iso-8859-1";
$GLOBALS["text_dir"] = "ltr"; // ('ltr' for left to right, 'rtl' for right to left)
$GLOBALS["date_fmt"] = "d/m/y H:i";
$GLOBALS["error_msg"] = array(
	// error
	"error"			=> "ERRO(S)",
	"back"			=> "Voltar",
	
	// root
	"home"			=> "O diret&oacute;rio inicial n&atilde;o existe, verifique as configura&ccedil;&otilde;es.",
	"abovehome"		=> "O diret&oacute;rio atual n&atilde;o pode estar acima do diret&oacute;rio inicial.",
	"targetabovehome"	=> "O diret&oacute;rio alvo n&atilde;o pode estar acima do diret&oacute;rio principal.",
	
	// exist
	"direxist"		=> "Este diret&oacute;rio n&atilde;o existe.",
	//"filedoesexist"	=> "Este arquivo j&aacute; existe.",
	"fileexist"		=> "Este arquivo n&atilde;o existe.",
	"itemdoesexist"		=> "Este item j&aacute; existe.",
	"itemexist"		=> "Este item n&atilde;o existe.",
	"targetexist"		=> "O diret&oacute;rio n&atilde;o existe.",
	"targetdoesexist"	=> "O destino j&aacute; existe.",
	
	// open
	"opendir"		=> "N&atilde;o é possível abrir o diret&oacute;rio.",
	"readdir"		=> "N&atilde;o é possível ler o diret&oacute;rio.",
	
	// access
	"accessdir"		=> "N&atilde;o est&aacute; autorizado a aceder a esta directoria.",
	"accessfile"		=> "N&atilde;o est&aacute; autorizado a aceder a este arquivo.",
	"accessitem"		=> "N&atilde;o est&aacute; autorizado a aceder a este item.",
	"accessfunc"		=> "N&atilde;o est&aacute; autorizado a usar esta fun&ccedil;&atilde;o.",
	"accesstarget"		=> "N&atilde;o est&aacute; autorizado a aceder à directoria.",
	
	// actions
	"permread"		=> "N&atilde;o foi possível visualizar as permiss&otilde;es.",
	"permchange"		=> "N&atilde;o foi possível modificar as permiss&otilde;es.",
	"openfile"		=> "N&atilde;o foi possível abrir o arquivo.",
	"savefile"		=> "N&atilde;o foi possível gravar o arquivo.",
	"createfile"		=> "N&atilde;o foi possível criar o arquivo.",
	"createdir"		=> "N&atilde;o foi possível criar o diret&oacute;rio.",
	"uploadfile"		=> "N&atilde;o foi possível o envio do arquivo.",
	"copyitem"		=> "N&atilde;o foi possível a c&oacute;pia.",
	"moveitem"		=> "N&atilde;o foi possível mover.",
	"delitem"		=> "N&atilde;o foi possível apagar o arquivo.",
	"chpass"		=> "N&atilde;o foi possível modificar a password.",
	"deluser"		=> "N&atilde;o foi possível remover o utilizador.",
	"adduser"		=> "N&atilde;o foi possível adicionar o utilizador.",
	"saveuser"		=> "N&atilde;o foi possível gravar o utilizador.",
	"searchnothing"		=> "Deve ser inserido um valor para ser feita a procura.",
	
	// misc
	"miscnofunc"		=> "Fun&ccedil;&atilde;o n&atilde;o disponível.",
	"miscfilesize"		=> "O arquivo ultrapassa o tamanho m&aacute;ximo permitido.",
	"miscfilepart"		=> "O arquivo foi apenas enviado parcialmente.",
	"miscnoname"		=> "Deve ser fornecido um nome.",
	"miscselitems"		=> "N&atilde;o foi seleccionado qualquer item.",
	"miscdelitems"		=> "Tem certeza que deseja apagar este(s) {0} item(s)?",
	"miscdeluser"		=> "Tem certeza que deseja apagar o utilizador '{0}'?",
	"miscnopassdiff"	=> "A nova password n&atilde;o é diferente da actual.",
	"miscnopassmatch"	=> "As passwords n&atilde;o s&atilde;o iguais.",
	"miscfieldmissed"	=> "Um campo importante est&aacute; vazio.",
	"miscnouserpass"	=> "Username ou password incorrectos.",
	"miscselfremove"	=> "N&atilde;o pode remover-se a si pr&oacute;prio.",
	"miscuserexist"		=> "O utilizador j&aacute; existe.",
	"miscnofinduser"	=> "N&atilde;o foi possível encontrar o utilizador.",
	"extract_noarchive" => "O arquivo n&atilde;o é um arquivo de extrac&ccedil;&atilde;o.",
	"extract_unknowntype" => "Tipo de Arquivo Desconhecido",
	
	'chmod_none_not_allowed' => 'Changing Permissions to <none> is not allowed',
	'archive_dir_notexists' => 'The Save-To Directory you have specified does not exist.',
	'archive_dir_unwritable' => 'Please specify a writable directory to save the archive to.',
	'archive_creation_failed' => 'Failed saving the Archive File'
);
$GLOBALS["messages"] = array(
	// links
	"permlink"		=> "MODIFICAR PERMISSÕES",
	"editlink"		=> "EDITAR",
	"downlink"		=> "Download",
	"uplink"		=> "CIMA",
	"homelink"		=> "PÁGINA INICIAL",
	"reloadlink"		=> "Atualizar",
	"copylink"		=> "Copiar",
	"movelink"		=> "Mover",
	"dellink"		=> "Apagar",
	"comprlink"		=> "ARQUIVO",
	"adminlink"		=> "ADMIN",
	"logoutlink"		=> "LOGOUT",
	"uploadlink"		=> "Upload",
	"searchlink"		=> "Procurar",
	"extractlink"	=> "Extrair Arquivo",
	'chmodlink'		=> 'Modificar as Permiss&otilde;es (chmod) (Pasta/arquivo(s))', // new mic
	'mossysinfolink'	=> 'eXtplorer Informa&ccedil;&atilde;o do Sistema (eXtplorer, Server, PHP, mySQL)', // new mic
	'logolink'		=> 'Ir para o site do joomlaXplorer (nova janela)', // new mic
	
	// list
	"nameheader"		=> "Nome",
	"sizeheader"		=> "Tamanho",
	"typeheader"		=> "Tipo",
	"modifheader"		=> "Modificado",
	"permheader"		=> "Permiss&otilde;es",
	"actionheader"		=> "Ac&ccedil;&otilde;es",
	"pathheader"		=> "Caminho",
	
	// buttons
	"btncancel"		=> "Cancelar",
	"btnsave"		=> "Gravar",
	"btnchange"		=> "Modificar",
	"btnreset"		=> "Reiniciar",
	"btnclose"		=> "Fechar",
	"btncreate"		=> "Criar",
	"btnsearch"		=> "Procurar",
	"btnupload"		=> "Upload",
	"btncopy"		=> "Copiar",
	"btnmove"		=> "Mover",
	"btnlogin"		=> "Login",
	"btnlogout"		=> "Logout",
	"btnadd"		=> "Novo",
	"btnedit"		=> "Editar",
	"btnremove"		=> "Remover",
	
	// user messages, new in joomlaXplorer 1.3.0
	'renamelink'	=> 'Renomear',
	'confirm_delete_file' => 'Tem a certeza que deseja apagar este arquivo? \\n%s',
	'success_delete_file' => 'Item(s) apagado com sucesso.',
	'success_rename_file' => 'O diret&oacute;rio/arquivo %s foi renomeado com sucesso para %s.',
	
	
	// actions
	"actdir"		=> "Diret&oacute;rio",
	"actperms"		=> "Modificar permiss&otilde;es",
	"actedit"		=> "Editar arquivo",
	"actsearchresults"	=> "Resultados da procura",
	"actcopyitems"		=> "Copiar item(s)",
	"actcopyfrom"		=> "Copiar de /%s para /%s ",
	"actmoveitems"		=> "Mover item(s)",
	"actmovefrom"		=> "Mover de /%s para /%s ",
	"actlogin"		=> "Login",
	"actloginheader"	=> "Fa&ccedil;a o login para usar o QuiXplorer",
	"actadmin"		=> "Administra&ccedil;&atilde;o",
	"actchpwd"		=> "Modificar password",
	"actusers"		=> "utilizadores",
	"actarchive"		=> "Arquivo de item(s)",
	"actupload"		=> "Upload de arquivo(s)",
	
	// misc
	"miscitems"		=> "Item(s)",
	"miscfree"		=> "Livres",
	"miscusername"		=> "Username",
	"miscpassword"		=> "Password",
	"miscoldpass"		=> "Password antiga",
	"miscnewpass"		=> "Nova password",
	"miscconfpass"		=> "Confirmar password",
	"miscconfnewpass"	=> "Confirmar a nova password",
	"miscchpass"		=> "Modificar password",
	"mischomedir"		=> "Diret&oacute;rio inicial",
	"mischomeurl"		=> "URL da p&aacute;gina inicial",
	"miscshowhidden"	=> "Mostrar items escondidos",
	"mischidepattern"	=> "Esconder esquema",
	"miscperms"		=> "Permiss&otilde;es",
	"miscuseritems"		=> "(nome, diret&oacute;rio inicial, mostrar items escondidos, permiss&otilde;es, ativo)",
	"miscadduser"		=> "novo utilizador",
	"miscedituser"		=> "editar utilizador '%s'",
	"miscactive"		=> "Activo",
	"misclang"		=> "Linguagem",
	"miscnoresult"		=> "N&atilde;o h&aacute; resultados disponíveis.",
	"miscsubdirs"		=> "Procurar subdiret&oacute;rios",
	"miscpermnames"		=> array("Ver apenas","Modificar","Alterar password","Modificar a password",
					"Administrador"),
	"miscyesno"		=> array("Sim","N&atilde;o","Y","N"),
	"miscchmod"		=> array("Propriet&aacute;rio", "Grupo", "Público"),
	// from here all new by mic
	'miscowner'			=> 'Propriet&aacute;rio',
	'miscownerdesc'		=> '<strong>Desccri&ccedil;&atilde;o:</strong><br />Utilizador (UID) /<br />Grupo (GID)<br />Permiss&otilde;es Actuais:<br /><strong> %s ( %s ) </strong>/<br /><strong> %s ( %s )</strong>',

	// sysinfo (new by mic)
	'simamsysinfo'		=> 'eXtplorer Info Sistema',
	'sisysteminfo'		=> 'Info Sistema',
	'sibuilton'			=> 'Sistema Operativo',
	'sidbversion'		=> 'Vers&atilde;o da Base de Dados (MySQL)',
	'siphpversion'		=> 'Vers&atilde;o de PHP',
	'siphpupdate'		=> 'INFORMAÇÃO: <span style="color: red;">A vers&atilde;o de PHP usada <strong>n&atilde;o est&aacute;</strong> atualizada!</span><br />Para garantir todas as fun&ccedil;&otilde;es e possibilidades do eXtplorer e dos addons,<br />deve estar a usar pelo menos a <strong>Vers&atilde;o 4.3 do PHP</strong>!',
	'siwebserver'		=> 'Servidor Web',
	'siwebsphpif'		=> 'Servidor Web - PHP Interface',
	'simamboversion'	=> 'eXtplorer Vers&atilde;o',
	'siuseragent'		=> 'Vers&atilde;o do Browser',
	'sirelevantsettings' => 'Configura&ccedil;&otilde;es de PHP Importantes',
	'sisafemode'		=> 'Safe Mode',
	'sibasedir'			=> 'Open basedir',
	'sidisplayerrors'	=> 'Erros de PHP',
	'sishortopentags'	=> 'Short Open Tags',
	'sifileuploads'		=> 'Datei Uploads',
	'simagicquotes'		=> 'Magic Quotes',
	'siregglobals'		=> 'Registar Globais',
	'sioutputbuf'		=> 'Output Buffer',
	'sisesssavepath'	=> 'Session Savepath',
	'sisessautostart'	=> 'Session auto start',
	'sixmlenabled'		=> 'XML enabled',
	'sizlibenabled'		=> 'ZLIB enabled',
	'sidisabledfuncs'	=> 'Non enabled functions',
	'sieditor'			=> 'Editor WYSIWYG',
	'siconfigfile'		=> 'Configuration File',
	'siphpinfo'			=> 'PHP Info',
	'siphpinformation'	=> 'PHP Information',
	'sipermissions'		=> 'Permissions',
	'sidirperms'		=> 'Directory Permissions',
	'sidirpermsmess'	=> 'Para ter certeza que todas as fun&ccedil;&otilde;es e possibilidades do eXtplorer est&atilde;o a funcionar correctamente, as seguintes pastas devem ter a permiss&atilde;o de escrita [chmod 0777]',
	'sionoff'			=> array( 'On', 'Off' ),
	
	'extract_warning' => "Deseja mesmo extrair este arquivo? Aqui?\\nIsto ir&aacute; apagar arquivos existentes se n&atilde;o for usado com cuidado!",
	'extract_success' => "A extrac&ccedil;&atilde;o foi um sucesso",
	'extract_failure' => "A extra&ccedil;&atilde;o falhou",
	
	'overwrite_files' => 'Sobreescrever arquivos existentes?',
	"viewlink"		=> "VIEW",
	"actview"		=> "Showing source of file",
	
	// added by Paulino Michelazzo (paulino@michelazzo.com.br) to fun_chmod.php file
	'recurse_subdirs'	=> 'Recurse into subdirectories?',
	
	// added by Paulino Michelazzo (paulino@michelazzo.com.br) to footer.php file
	'check_version'	=> 'Check for latest version',
	
	// added by Paulino Michelazzo (paulino@michelazzo.com.br) to fun_rename.php file
	'rename_file'	=>	'Renomear um diretório ou Arquivo',
	'newname'		=>	'Novo Nome',
	
	// added by Paulino Michelazzo (paulino@michelazzo.com.br) to fun_edit.php file
	'returndir'	=>	'Return to directory after saving?',
	'line'		=> 	'Line',
	'column'	=>	'Column',
	'wordwrap'	=>	'Wordwrap: (IE only)',
	'copyfile'	=>	'Copy file into this filename',
	
	// Bookmarks
	'quick_jump' => 'Quick Jump To',
	'already_bookmarked' => 'This directory is already bookmarked',
	'bookmark_was_added' => 'This directory was added to the bookmark list.',
	'not_a_bookmark' => 'This directory is not a bookmark.',
	'bookmark_was_removed' => 'This directory was removed from the bookmark list.',
	'bookmarkfile_not_writable' => "Failed to %s the bookmark.\n The Bookmark File '%s' \nis not writable.",
	
	'lbl_add_bookmark' => 'Add this Directory as Bookmark',
	'lbl_remove_bookmark' => 'Remove this Directory from the Bookmark List',
	
	'enter_alias_name' => 'Please enter the alias name for this bookmark',
	
	'normal_compression' => 'normal compression',
	'good_compression' => 'good compression',
	'best_compression' => 'best compression',
	'no_compression' => 'no compression',
	
	'creating_archive' => 'Creating Archive File...',
	'processed_x_files' => 'Processed %s of %s Files',
	
	'ftp_header' => 'Local FTP Authentication',
	'ftp_login_lbl' => 'Please enter the login credentials for the FTP server',
	'ftp_login_name' => 'FTP User Name',
	'ftp_login_pass' => 'FTP Password',
	'ftp_hostname_port' => 'FTP Server Hostname and Port <br />(Port is optional)',
	'ftp_login_check' => 'Checking FTP connection...',
	'ftp_connection_failed' => "The FTP server could not be contacted. \nPlease check that the FTP server is running on your server.",
	'ftp_login_failed' => "The FTP login failed. Please check the username and password and try again.",
		
	'switch_file_mode' => 'Current mode: <strong>%s</strong>. You could switch to %s mode.',
	'symlink_target' => 'Target of the Symbolic Link',
	
	"permchange"		=> "CHMOD Success:",
	"savefile"		=> "The File was saved.",
	"moveitem"		=> "Moving succeeded.",
	"copyitem"		=> "Copying succeeded.",
	'archive_name' 	=> 'Name of the Archive File',
	'archive_saveToDir' 	=> 'Save the Archive in this directory',
	
	'editor_simple'	=> 'Simple Editor Mode',
	'editor_syntaxhighlight'	=> 'Syntax-Highlighted Mode',

	'newlink'	=> 'Novo Diret&oacute;rio',
	'show_directories' => 'Exibir Diret&oacute;rios',
	'actlogin_success' => 'Login successful!',
	'actlogin_failure' => 'Login failed, try again.',
	'directory_tree' => 'Diret&oacute;rios',
	'browsing_directory' => 'Browsing Directory',
	'filter_grid' => 'Filtro',
	'paging_page' => 'P&aacute;gina',
	'paging_of_X' => 'De {0}',
	'paging_firstpage' => 'Primeira P&aacute;gina',
	'paging_lastpage' => 'Última P&aacute;gina',
	'paging_nextpage' => 'Pr&oacute;xima P&aacute;gina',
	'paging_prevpage' => 'P&aacute;gina Anterior',
	
	'paging_info' => 'Exibindo itens {0} - {1} de {2}',
	'paging_noitems' => 'Diret&oacute;rio Vazio',
	'aboutlink' => 'Sobre...',
	'password_warning_title' => 'Important - Change your Password!',
	'password_warning_text' => 'The user account you are logged in with (admin with password admin) corresponds to the default eXtplorer priviliged account. Your eXtplorer installation is open to intrusion and you should immediately fix this security hole!',
	'change_password_success' => 'Your Password has been changed!',
	'success' => 'Sucesso',
	'failure' => 'Falha',
	'dialog_title' => 'Executar',
	'upload_processing' => 'Processando Upload, por favor aguarde...',
	'upload_completed' => 'Upload realizado com sucesso!',
	'acttransfer' => 'Transferir de outro servidor',
	'transfer_processing' => 'Processing Server-to-Server Transfer, please wait...',
	'transfer_completed' => 'Transfer completed!',
	'max_file_size' => 'Tamanho M&aacute;ximo do Arquivo',
	'max_post_size' => 'Tamanho M&aacute;ximo do Upload',
	'done' => 'Pronto',
	'permissions_processing' => 'Applying Permissions, please wait...',
	'archive_created' => 'The Archive File has been created!',
	'save_processing' => 'Saving File...',
	'current_user' => 'This script currently runs with the permissions of the following user:',
	'your_version' => 'Your Version',
	'search_processing' => 'Procurando, por favor aguarde...',
	'url_to_file' => 'URL do Arquivo',
	'file' => 'Arquivo',
	"tipo"			=> "Tipo",
	"diretorio" => "Diretório",
);
?>
