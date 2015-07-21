<?php include_once('config.php'); ?>

<html>
	
	<head>
		<title>Upload de Arquivo</title>
		
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
		<link rel="stylesheet" href="assets/estilo.css">
		<meta name="viewport" content="width=device-width; initial-scale=1.0">
		<meta charset="utf-8">
		
	</head>
	
	<body>
		
		<div class="container">
			
			<div class="jumbotron">
			   	
			   	<div class="row">	 
				    <div class="col-sm-8 text-center">
				       
				        <p>Arraste a imagem para este quadrado <br/>para enviar a imagem ou use o campo file</p>
				      
				        <img id="dropbox" src="http://placehold.it/400x200&text=Arraste-a-imagem-aqui">
						<br/><br/>
						<input id="file_input" type="file">
						<br/><br/>
				        <div class="progress">
							<div class="progress-bar" role="progressbar" aria-valuenow="00" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
					    </div>
						
				    </div><!-- .col-sm-6 -->
				    
				    <div class="col-sm-4">
					     <img id="imagem-alvo" src="http://placehold.it/400x500&text=a-imagem-aparecera-aqui">
				    </div>
				    
			   	</div>
			   	
			    
			</div><!-- .jumbotron -->
		
		</div><!-- .container -->
		
		<div class="container">
			
			<div class="console jumbotron">
				
				<h2>Console</h2>
				<div>
					<pre>Vou mostrar o log de eventos</pre>
				</div>
				
			</div>
		</div>
		
		<div class="container">
			
			<div class="jumbotron">
				
				<h3>Imagens da pasta:</h3>
    
			    <div class="row">
		    
					    <?php
						    // get all images from uploads folder, just to check if the upload was sucessfull
						    
						    $timthumb = BASE_URL . '/timthumb/timthumb.php';
						    //lista as imagens da pasta para verificar se deu certo
							$files = glob("uploads/*.*");
							
							$colCnt=0;
							
							for ($i=0; $i<count ($files); $i++) {
							  $colCnt++;
							  
							  echo '<div class="col-sm-3">';
							 
							  $num = $files[$i];
							 ?>
							  <a href="<?php echo $num; ?>" target="_blank">
								<img src="<?php echo $timthumb . '?src=' . $num .'&w=150&h=100'; ?>" />
							  </a>
						<?php	  
							  echo '</div>';
							
							  if ($colCnt==4) {
							    echo '';
							    $colCnt=0;
							    }
							  }
							
						?>
				    
			    </div>
	    		
			</div>
			
		</div>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
		<script src="assets/jquery.html5uploader.js"></script>
		<script type="text/javascript" src="assets/script.js"></script>
		
	</body>
	
</html>