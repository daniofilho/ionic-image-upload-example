(function(){
var app = angular.module('cordova-camera', ['ionic', 'ngCordova'])
	
	app.controller('CameraCtrl', function($scope, $cordovaCamera){
		
		$scope.pictureUrl = "https://placeimg.com/200/200/games";
		$scope.liveConsole = "...Console...";
		
		$scope.takePicture = function(){
			
			var options = {
				destinationType: Camera.DestinationType.DATA_URL,
				encodingType: Camera.EncodingType.JPEG
			}
			
			$cordovaCamera.getPicture(options)
			.then(function(data){
				$scope.liveConsole = "img ok";
				$scope.pictureUrl = "data:image/jpeg;base64," + data;
			}, function(error){
				$scope.liveConsole = error;
			});
		};
		
	});
	
	app.run(function($ionicPlatform) {
	  $ionicPlatform.ready(function() {
	    if(window.StatusBar) {
	      StatusBar.styleDefault();
	    }
	  });
	})

}());