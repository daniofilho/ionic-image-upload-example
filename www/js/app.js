(function(){
	
	var app = angular.module('cordova-camera', ['ionic', 'ngCordova'] );
	
	
	app.controller('CameraCtrl', function($scope, $cordovaCamera, $timeout, $cordovaFileTransfer, $cordovaFile ) {
		
		$scope.pictureUrl = "https://placeimg.com/200/100";
		$scope.picturePath = "";
		$scope.liveConsole = "Console:";
		$scope.progressBar = 0;
		
		$scope.images = [];
 
	    $scope.urlForImage = function(imageName) {
	        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
			var trueOrigin = cordova.file.dataDirectory + name;
			return trueOrigin;
    	}
		
		
		$scope.takePicture = function(){
			
			var options = {
				quality: 50,
				pictureSource: navigator.camera.PictureSourceType.CAMERA,
				destinationType: Camera.DestinationType.FILE_URL,
				encodingType: Camera.EncodingType.JPEG
			}
			
			$cordovaCamera.getPicture(options)
			.then(function(data){
				$scope.liveConsole += " -- caminho da imagem: " + data + " -- ";
				$scope.pictureUrl = "data:image/jpeg;base64," + data;
				$scope.picturePath = data;
				console.log(JSON.stringify(data));
				
				resolveLocalFileSystemURL(data, copyFile, fail)
				
			}, function(error){
				$scope.liveConsole = error;
				console.log(JSON.stringify(error));
			});
			
			
			function createFileEntry(fileURI) {
				window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
			}
			
			function copyFile(fileEntry) {
				 var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
				 var newName = makeid() + name;
				 
				 window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
					 fileEntry.copyTo(
						 fileSystem2,
						 newName,
						 onCopySuccess,
						 fail
					 );
				 },fail);
			}
			function onCopySuccess(entry) {
				$scope.liveConsole = " -- arquivo movido: " + entry.nativeURL + " -- ";
						
				$scope.$apply(function () {
					$scope.images.push(entry.nativeURL);
					$scope.picturePath = entry.nativeURL;
			 	});
			 }
			 
			function fail(error) {
			 	console.log("fail: " + error.code);
			}
			 
			function makeid() {
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				 
				for (var i=0; i < 5; i++) {
				 	text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				return text;
			}
			
		};
		
		$scope.sendPicture = function(){
			
			if( $scope.picturePath != "" ) {
				
				var fileName = $scope.picturePath.substr($scope.picturePath.lastIndexOf('/')+1);
				
				console.log( 'filename: ' + fileName );
				console.log( 'cordova file:' + cordova.file.dataDirectory );
				console.log( 'picturePath: ' +  $scope.picturePath);
				//MOVE TO A SAFE DIRECTORY
				//$cordovaFile.moveFile( $scope.picturePath, fileName, cordova.file.dataDirectory, "nova-foto.jpeg")
				//	.then(function (success) {
						//$scope.picturePath = cordova.file.dataDirectory + fileName;
						
						//SEND
						$scope.liveConsole = " -- vou enviar a foto: " + $scope.picturePath + " -- ";
						/*
						var options = {
							fileKey: "imagem_upload",
						    fileName: "teste-app.jpeg",
						    chunkedMode: false,
						    mimeType: "image/jpeg"
						};*/
						
						var server = "http://daniofilho.com/estudo/ionic/upload-imagens/fn_upload.php";
						var filePath = $scope.picturePath;
						
						var options = new FileUploadOptions();
				        options.fileKey="imagem_upload";
				        options.fileName=filePath.substr(filePath.lastIndexOf('/')+1);
				        options.mimeType="image/jpeg";
				
				        var params = new Object();
				        params.value1 = "test";
				        params.value2 = "param";
				
				        options.params = params;
				        options.chunkedMode = false;
						
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

						
		      		//}, function (error) {
			  	//		$scope.liveConsole = " -- erro ao mover o arquivo: " + error + " -- ";
				//
		      	//	});
								
			} else {
				$scope.liveConsole = "tire uma foto primeiro";
				console.log(JSON.stringify("tire uma foto primeiro"));
			}
			
		};
		
	});
	
	app.run(function($ionicPlatform) {
	  $ionicPlatform.ready(function() {
	    if(window.StatusBar) {
	      StatusBar.styleDefault();
	    }
	  });
	});

}());