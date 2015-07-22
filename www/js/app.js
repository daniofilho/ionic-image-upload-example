(function(){
	
	var app = angular.module('cordova-camera', ['ionic', 'ngCordova'] );
	
	
	app.controller('CameraCtrl', function($scope, $cordovaCamera, $timeout, $cordovaFileTransfer, $cordovaFile ) {
		
		//variables
		$scope.pictureUrl = "https://placeimg.com/200/100";
		$scope.picturePath = "";
		$scope.liveConsole = "Console:"; //variable acting as a console on app
		$scope.progressBar = 0;
		$scope.retries = 0;
		$scope.images = [];
 
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
				quality: 5,
				pictureSource: navigator.camera.PictureSourceType.CAMERA,
				destinationType: Camera.DestinationType.FILE_URL,
				encodingType: Camera.EncodingType.JPEG
			}
			
			//call the $cordovaCamera to take the picture
			$cordovaCamera.getPicture(options)
				.then(function(data){
					
					//try base64 the image to preview
					$scope.pictureUrl = "data:image/jpeg;base64," + data;
					
					//store the path
					$scope.picturePath = data;
					
					//debug
					$scope.liveConsole += " -- caminho da imagem: " + data + " -- ";
					console.log(JSON.stringify(data));
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
			
			/*
			function createFileEntry(fileURI) {
				window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
			}*/
			
			//copy the file to the location
			function copyFile(fileEntry) {
				
				//debug
				console.log('resolvido, resultado: ' + fileEntry );
				
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
				$scope.liveConsole = " -- arquivo movido: " + entry.nativeURL + " -- ";
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
				$scope.liveConsole = " -- vou enviar a foto: " + $scope.picturePath + " -- ";
				
				//server options		
				var server = "http://daniofilho.com/estudo/ionic/upload-imagens/fn_upload.php";
				
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
					
					//the  action
					var ft = new FileTransfer();
					ft.upload(filePath, encodeURI(server), win, fail, options);
					
				}
				
				//if success
				var win = function (r) {
			        //will study this clearcache later
			        //clearCache();
			          
			        //reset retries
			        $scope.retries  = 0;
			        
			        //debug
			        $scope.liveConsole += " -- imagem enviada! -- ";
			        console.log(JSON.stringify(result));
			    }
			    
			    //if fail, try one more time
			    var fail = function (error) {
			        if ($scope.retries  == 0) {
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
			            $scope.liveConsole += "( " + error + " )";
			        }
			    }

						/*
							
							just saving this piece of code for later use if needed
							
						  $cordovaFileTransfer.upload(server, filePath, options)
					      .then(function(result) {
					        $scope.liveConsole += " -- imagem enviada! -- ";
					        console.log(JSON.stringify(result));
					        //$cordovaProgress.hide();
					      }, function(err) {
					        $scope.liveConsole += "( " + err + " )";
					        console.log(JSON.stringify(err));
					      }, function (progress) {
					        $scope.progressBar = (progress.loaded / progress.total) * 100;
					      });
					   
		      		}, function (error) {
			  			//debug
			  			$scope.liveConsole = " -- erro ao mover o arquivo: " + error + " -- ";
			  		});
						 */		
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