(function(){
	
	var app = angular.module('cordova-camera', ['ionic', 'ngCordova'] );
	
	app.config(function( $stateProvider, $urlRouterProvider ) {
		
		$stateProvider.state('home',{
			url: '/home',
			views: {
				'tab-home': {
					templateUrl: 'templates/home.html'
				}
			}
		});
		
		$stateProvider.state('config',{
			url: '/config',
			views: {
				'tab-config': {
					templateUrl: 'templates/config.html'
				}
			}
			
		});
		
		$urlRouterProvider.otherwise('home');
		
	});
	
	app.controller('CameraCtrl', function($scope, $cordovaCamera, $timeout, $cordovaFileTransfer, $cordovaFile ) {
		
		//variables
		$scope.picturePath = "";
		$scope.lastImage = "http://placehold.it/200x100&text=sem.foto"; //just to preview the sent photo
		
		$scope.liveConsole = "Console:"; //variable acting as a console on app
		
		$scope.server = "http://daniofilho.com/estudo/ionic/upload-imagens/fn_upload.php";
		
		$scope.progressBar = 0;
		$scope.retries = 0;
		$scope.images = [];
		
		//let user define quality and size
		/*
			Not working yet, I don't know how, but even if the user change the value, it does not auto change
			on the scope... will look it later!	
		*/
		$scope.phtQuality = 90;
		$scope.phtWidth = 1920;
		$scope.phtHeight = 1080;
		
		//returns the path for the image
	    $scope.urlForImage = function(imageName) {
	        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
			var trueOrigin = cordova.file.dataDirectory + name;
			return trueOrigin;
    	}
		
		//take picture functions
		$scope.takePicture = function(){
			
			//options set up
			var options = {
				quality: $scope.phtQuality,
				pictureSource: navigator.camera.PictureSourceType.CAMERA,
				destinationType: Camera.DestinationType.FILE_URL,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: $scope.phtWidth,
				targetHeight: $scope.phtHeight,
				saveToPhotoAlbum: false,
				allowEdit : true
			}
			
			//call the $cordovaCamera to take the picture
			$cordovaCamera.getPicture(options)
				.then(function(data){
					
					//try base64 the image to preview
					$scope.pictureUrl = "data:image/jpeg;base64," + data;
					
					//store the path
					$scope.picturePath = data;
					
					//debug
					$scope.liveConsole = "Tirando a foto";
					console.log( 'tirando foto => q: ' + $scope.phtQuality + ' | w=' + $scope.phtWidth + ' | h=' + $scope.phtHeight );
			
					console.log("caminho da imagem: " + JSON.stringify(data));
					console.log('resolvendo o filesystem...');
					
					//Retrieve a fileEntry based on it's local URL
					// params => (url, callback success, callback error)
					//font: http://docs.appgyver.com/en/edge/cordova_file_localfilesystem_localfilesystem.md.html
					window.resolveLocalFileSystemURL(data, copyFile, fail);
					
				}, function(error){
					//debug error
					$scope.liveConsole = error;
					console.log(JSON.stringify(error));
				});
			
			
			//copy the file to the location
			function copyFile(fileEntry) {
				
				//debug
				$scope.liveConsole = "Preparando para copiar para local seguro";
				console.log('resolvido, resultado: ' + fileEntry.fullPath );
				
				//make new file name
				var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
				var newName = makeid() + name;
				
				//resolve fileentry after copy the imagem to cordova.file.directory 
				window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
					 fileEntry.copyTo(
						 fileSystem2,
						 newName,
						 onCopySuccess,
						 fail
					 );
				 },fail);
			}
			
			//after copy success
			function onCopySuccess(entry) {
				
				//debug
				$scope.liveConsole = "Copiado para local seguro";
				console.log (" -- arquivo movido: " + entry.nativeURL + " -- ");
				
				//apply changes to #scope		
				$scope.$apply(function () {
					
					//add the photo to images array
					$scope.images.push(entry.nativeURL);
					
					//define last taken image as the one to send
					/*
						TO DO: Use the array to send multiple files, or at least one at time
					*/
					$scope.picturePath = entry.nativeURL;
			 	});
			}
			
			//if fails, debug 
			function fail(error) {
				$scope.liveConsole = "Erro ao copiar:" + error.code;
			 	console.log("fail: " + error.code);
			}
			
			//just make an id for the image to prevent duplicates overwrite 
			function makeid() {
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				 
				for (var i=0; i < 5; i++) {
				 	text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				return text;
			}
			
		};
		
		
		//Action that sends the photo
		$scope.sendPicture = function(){
			
			//if the user took a photo
			if( $scope.picturePath != "" ) {
				
				//gets the image filename
				var fileName = $scope.picturePath.substr($scope.picturePath.lastIndexOf('/')+1);
				
				//debug
				console.log( 'filename: ' + fileName );
				console.log( 'cordova file:' + cordova.file.dataDirectory );
				console.log( 'picturePath: ' +  $scope.picturePath);
				$scope.liveConsole = "preparando para enviar a foto";
				
				//server options		
				var server = $scope.server;
				
				//set the filepath
				var filePath = $scope.picturePath;
				
				//additional parameters if need, just saving the code for later use
		        var params = new Object();
			        params.value1 = "test";
			        params.value2 = "param";
			        
				//options
				var options = new FileUploadOptions();
			        options.fileKey="imagem_upload";
			        options.fileName=filePath.substr(filePath.lastIndexOf('/')+1);
			        options.mimeType="image/jpeg";
					options.params = params;
					options.chunkedMode = false;
				
				//try uploading	
				tryUpload();
				 
				
				//function that try the upload
				// I made a function, so I can call it later one more time if it fails
				// *I read somewhere that it's a Cordova bug and trying again "fix" it
				function tryUpload(){
					
					//debug
					console.log( 'enviando para: ' + encodeURI(server) );
					$scope.liveConsole = "enviando";
					
					//the action / the magic
					$cordovaFileTransfer.upload( encodeURI(server), filePath, options)
					    .then(function(result) {
						    uploadSucces(result);
					    }, function(err) {
					        uploadError(err);
					    }, function (progress) {
						    //updates the progressbar
					        $scope.progressBar = (progress.loaded / progress.total) * 100;
					    });
					
				}
				
				//if success
				var uploadSucces = function (result) {
			        //will study this clearcache later
			        //clearCache();
			          
			        //reset retries
			        $scope.retries  = 0;
			        
			        //debug
			        console.log("Imagem enviada, retorno do server:" + JSON.stringify(result));
					console.log(result.response);
					
					//return server message on console
					$scope.liveConsole = result.response.msg;
					
					//put the image on the img tag to preview sent image
					$scope.lastImage = result.response.img_thumb;
			    }
			    
			    //if fail, try one more time
			    var uploadError = function (error) {
			        
			        //debug
			        console.log('Erro:' + error);
			        
			        if ($scope.retries  == 0) {
				        //debug
			            $scope.liveConsole += "vou tentar mais uma vez";
			           
			            //try one more time
			            $scope.retries++;
			            setTimeout(function() {
			                tryUpload();
			            }, 1000)
			        } else {
				        
				        //reset retries
			            $scope.retries  = 0;
			            
			            //clearCache();
			            
			            //debug
			            $scope.liveConsole += "não deu certo mesmo";
			        }
			    }
	
			} else {
				//debug and show error message if no photo was taken
				$scope.liveConsole = "tire uma foto primeiro";
				console.log(JSON.stringify("tire uma foto primeiro"));
			}
			
		};
		
	});
	
	//ionic generated
	app.run(function($ionicPlatform) {
	  $ionicPlatform.ready(function() {
	    if(window.StatusBar) {
	      StatusBar.styleDefault();
	    }
	  });
	});

}());