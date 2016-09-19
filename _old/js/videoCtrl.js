var primeiroEnemApp = angular.module('primeiroEnemApp', ['ui.bootstrap']);
 
angular
  .module('primeiroEnemApp')
  .controller('VideoController', VideoController);

function VideoController($scope, $window, SessionService) {    
 
    var test = SessionService.getUserAuthenticated();

    if(!test) {
        $window.location.href = '/index.html';
    }
 
}