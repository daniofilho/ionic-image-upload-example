(function(){
	
	var app = angular.module('cordova-camera', ['ionic', 'ngCordova'] );
	
	app.controller('CameraCtrl', function($scope, $cordovaCamera, $timeout, $cordovaFileTransfer ) {
		
		$scope.pictureUrl = "https://placeimg.com/200/100/games";
		$scope.picturePath = "";
		$scope.liveConsole = "Console: \n";
		
		$scope.takePicture = function(){
			
			var options = {
				destinationType: Camera.DestinationType.FILE_URL,
				encodingType: Camera.EncodingType.JPEG
			}
			
			$cordovaCamera.getPicture(options)
			.then(function(data){
				$scope.liveConsole += " -- caminho da imagem: " + data + " -- ";
				$scope.pictureUrl = "data:image/jpeg;base64," + data;
				$scope.picturePath = data;
				console.log(JSON.stringify(data));
			}, function(error){
				$scope.liveConsole = error;
				console.log(JSON.stringify(error));
			});
		};
		
		$scope.sendPicture = function(){
			
			if( $scope.picturePath != "" ) {
				
				$scope.liveConsole = " -- vou enviar a foto: " + $scope.picturePath + " -- ";
				
				
				var options = {
					fileKey: "imagem_upload",
				    fileName: "teste-app.jpeg",
				    chunkedMode: false,
				    mimeType: "image/jpeg"
				};
				
				var server = "http://daniofilho.com/estudo/ionic/upload-imagens/fn_upload.php";
				var filePath = $scope.picturePath;
				/*
				var options = new Object();//new FileUploadOptions();
		        options.fileKey="userfile";
		        options.fileName=imageURI.substr(picturePath.lastIndexOf('/')+1);
		        options.mimeType="image/jpeg";
		
		        var params = new Object();
		        params.value1 = "test";
		        params.value2 = "param";
		
		        options.params = params;
		        options.chunkedMode = false;*/
				
				$cordovaFileTransfer.upload(server, filePath, options)
			      .then(function(result) {
			        $scope.liveConsole += " -- imagem enviada! -- ";
			        console.log(JSON.stringify(result));
			      }, function(err) {
			        $scope.liveConsole += "( " + err + " )";
			        console.log(JSON.stringify(err));
			      }, function (progress) {
			        $scope.liveConsole = "[ " + (progress.loaded / progress.total) * 100 + " ]";
			      });
				
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