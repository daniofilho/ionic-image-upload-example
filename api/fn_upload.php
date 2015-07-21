<?php
	
	/*
	 * fn_upload.php
	 *
	 * a simple archive to handle file uploads
	 * 
	     
	    * There is no kind of security or error handle here, I made it as fast as possible and just to use on tests,
		so don't use this on production without writing security codes!
		
		* It also logs the process on txt files, so you can debug
		
		* Don't forget to edit the config.php file!
	 
	 *
	 * $_FILES['imagem_upload']: name of the file variable
	 * @return (type)
	 */
		
	include_once('config.php');
	
	ini_set('display_errors',1);
	ini_set('display_startup_erros',1);
	error_reporting(E_ALL);
	
	//Logs
		global $log;
		$log = "\r\n# # # # # # # # # # \r\n\r\n[" . date('d/m/Y H:i:s') ."] File executed.\r\n";
		ob_start();
		var_dump($_POST);
		$post_output = ob_get_clean();
		
		$log .= "\r\n ". $post_output . ".\r\n";
	
	
	
	//Remove special chars
		$filename = tratar_arquivo_upload(utf8_decode($_FILES['imagem_upload']['name']));
	
	//begin
		$dir = PATH_URL . 'uploads/';
		$arquivo = $dir . basename($filename);
	
	// Don't duplicate names
		$i = 2;
		while (file_exists($arquivo)) {
		    $info = pathinfo($arquivo);
		    $arquivo = $info['dirname'] . '/' . $info['filename'] . $i . '.' . $info['extension'];
		    $i++;    
		}
	
	//the upload magic
	if ( move_uploaded_file($_FILES['imagem_upload']['tmp_name'], $arquivo) ) {
		
		//get the path of the file
	    $caminho = str_replace( PATH_URL, '', $arquivo);
		$caminho = BASE_URL . $caminho;
		
		//timthumb the image to return a thumb version of original image
		$timthumb = BASE_URL . '/timthumb/timthumb.php?src=' . $caminho . "&w=400&h=500";
		
		
		$data = array( 
						'img_original' => $caminho, 
						'img_redimensionada' => $timthumb, 
					);
		//return
	    echo json_encode($data);
	
	}
    		
    //save the log
		$hoje = date("Y_m_d");
		$arquivo = fopen("logs/log_$hoje.txt", "ab");
		$hora = date("H:i:s T");
		fwrite($arquivo, $log);
		fclose($arquivo);
    
    /*
     * tratar_arquivo_upload
     *
     * just remove special chars
     *
     * @string(string) the name of the original file
     * @return (string) returns the file without the special chars
     */
    function tratar_arquivo_upload($string){
	   // pegando a extensao do arquivo
	   $partes 	= explode(".", $string);
	   $extensao 	= $partes[count($partes)-1];	
	   // somente o nome do arquivo
	   $nome	= preg_replace('/\.[^.]*$/', '', $string);	
	   // removendo simbolos, acentos etc
	   $a = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýýþÿŔŕ?';
	   $b = 'aaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuuyybyRr-';
	   $nome = strtr($nome, utf8_decode($a), $b);
	   $nome = str_replace(".","-",$nome);
	   $nome = preg_replace( "/[^0-9a-zA-Z\.]+/",'-',$nome);
	   return utf8_decode(strtolower($nome.".".$extensao));
	}
?>