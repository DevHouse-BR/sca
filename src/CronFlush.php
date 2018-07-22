<?php

function dirList ($directory) {

    $results = array();
    $handler = opendir($directory);

    while ($file = readdir($handler)) {
        if ($file != '.' && $file != '..')
            $results[] = $file;
    }

    closedir($handler);
    return $results;

}

function integrateLoad() {
	$accountsDirList = dirList('files');

	foreach($accountsDirList as $subDir){
		$subDir = $subDir.'/temp';

		if(is_dir('files/'.$subDir)){
			$uploadedFiles = dirList('files/'.$subDir);

			foreach($uploadedFiles as $upFile){
				$upFile = 'files/'.$subDir.'/'.$upFile;	

				if(is_file($upFile)){
					if(filemtime($upFile) < (time() + 86400)) //now() + 60 * 60 * 24 - um dia
						unlink($upFile);
				}
			}
		}
	}
}


integrateLoad();
