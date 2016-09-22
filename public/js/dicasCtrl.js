var primeiroEnemApp = angular.module('primeiroEnemApp', ['ui.bootstrap']);
 
primeiroEnemApp.controller('DicasController', DicasController);

function DicasController($scope, $http, $window) {    

    $scope.showDicas = false;

    //verificar se usuário possui token de acesso válido
    $http({url: '/api/restrito/dicas', method: 'GET'})
        .success(function (data, status, headers, config) {
            console.log("ok");
            $scope.showDicas = true;
        })
        .error(function(err) {
            console.log('Error: ' + err);
            $scope.showDicas = false;
            $window.location.href = '/';
        });
 
}

primeiroEnemApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

primeiroEnemApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});