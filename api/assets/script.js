$(function() {
	$("#dropbox, #file_input").html5Uploader({
       
        //Nome do post para usar na função em php que faz o handle do upload
        name: "imagem_upload",
       
        //url que faz o handle do upload
        postUrl: "fn_upload.php",
       
        //Ao arrastar a imagem para o box
        onClientLoad: function(e, file) {
	        
	        //limpa o log
	        $('.console div').html("");
	        
	        //log
	        console_log("Usuário arrastou imagem para o quadro ou selecionou no input file");
	        console_log("Defini a imagem de pré visualização");
            console_log("Iniciei upload da imagem, acompanhe a barra de progresso");
	        
            //Mostra a imagem que vai fazer upload para pré visualização
            // (obs: Ainda não é a imagem do server... vamos atualizar isso depois na função ao final)
            $("#imagem-alvo").attr('src', e.target.result);
            
            //Apenas um efeito frescurento pra ficar visível que está rolando alguma alteração aqui
            for(i=0;i<5;i++) {
			    $("#imagem-alvo").fadeTo(2, 0.5).fadeTo(2, 1);
			}
			 
        
        },
        
        //Quando o servidor começar a fazer o upload
        onServerLoadStart: function(e, file) {
	        $(".progress .progress-bar").css('width', '0%');
        },
        
        //Em progresso de upload
        onServerProgress: function(e, file) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                //atualiza a progressbar
                $(".progress .progress-bar").css('width', percentComplete + "%");
            }
        },
        
        //Ao finalizar o upload
        onServerLoad: function(e, file) {
	        console_log("Finalizei Upload");
            $(".progress .progress-bar").css('width', '100%');
        },
        
        onSuccess: function(e, file, json){
	        
	        //Pego o retorno em json
	        var data = $.parseJSON(json);
						
			//Altero a imagem de prévia para a imagem já carregada no servidor
			// Pode-se usar o link da imagem original ou da já redimensionada como eu tinha sugerido, você que escolhe			
	        $("#imagem-alvo").attr('src', data.img_redimensionada);
			
			//Efeito frescurento
			for(i=0;i<5;i++) {
			    $("#imagem-alvo").fadeTo(2, 0.5).fadeTo(2, 1);
			}
			
	        //log
	        console_log("Alterando a imagem de visualização para a url da imagem do servidor mesmo");
	        console_log("Imagem Original: <a target='_blank' href='" + data.img_original + "'>" + data.img_original + "</a>");
	        console_log("Imagem Redimensionada: <a target='_blank' href='" + data.img_redimensionada + "'>" + data.img_redimensionada + "</a>");
	        console_log("E é isso :)");
	    }
        
    });
    
    
    function console_log(msg){
	    var d = new Date(); // for now
		d.getHours(); // => 9
		d.getMinutes(); // =>  30
		d.getSeconds(); // => 51
		
	    $('.console div').append("<pre><small>" + d + "</small>: " + msg + "</pre>");
    }
});
		