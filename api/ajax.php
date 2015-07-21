<?php
	
	define( 'PATH_URL', dirname( __FILE__ ) . "/" );
	define( 'UPLOAD_PATH', PATH_URL . 'uploads/' );
	
	
	$act = $_POST['a'];
	
	if( $act == "" )
		$act = "upload";
	
	global $log;
	$log = "\r\n# # # # # # # # # # \r\n\r\n[" . date('d/m/Y H:i:s') ."] Arquivo foi chamado.\r\n";
	ob_start();
	var_dump($_POST);
	$post_output = ob_get_clean();
	
	$log .= "\r\n ". $post_output . ".\r\n";
	
	
	switch($act){
		
		case 'upload':
			
			//Faz o upload
			$uploaddir = $uploaddir . $path;
			$uploadfile = $uploaddir . basename($_FILES['file']['name']);
			
			
			// Evita subir imagens com nomes duplicados
			$i = 2;
			while (file_exists($uploadfile)) {
			    $info = pathinfo($uploadfile);
			    $uploadfile = $info['dirname'] . '/' . $info['filename'] . $i . '.' . $info['extension'];
			    $i++;    
			}
			
			//the magic...
			$sucesso = move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile );
	
			if ( $sucesso ) {
			    $retorno = "Arquivo válido e enviado com sucesso.\n";
			    $log .= "Arquivo válido e enviado com sucesso ( ".$_FILES['userfile']['name']." ).\n";
						
			} else {
			    $retorno = "Possível ataque de upload de arquivo!\n";
			    $log    .= "Possível ataque de upload de arquivo ( ".$_FILES['userfile']['name']." )!\n";
			}
			
			echo json_encode($retorno);
				
			break;
		default:
			$log .= "Arquivo executado mas nenhuma função chamada. a = " . $act;
			break;
		
	}
	
	//salva log
	$hoje = date("Y_m_d");
	$arquivo = fopen("logs/log_$hoje.txt", "ab");
	$hora = date("H:i:s T");
	fwrite($arquivo, $log);
	fclose($arquivo);
			
	
	
	
?>