var app = angular.module('primeiroEnemAdmin', ['ngJsonExportExcel']);

app.constant('_', _);
app.constant('moment', moment);

app.controller('AdminController', function($scope, $http, $window, _, moment) {

    $scope.total = 0;
    $scope.contatos = [];
    $scope.mostrarTotal = false;
    $scope.mostrarLista = false;
    $scope.user = "";
    $scope.password = "";
    $scope.error = "";

    $scope.listarContatos = function() {

        $http({
            url: "/api/token", 
            method: "GET",
            params: {user: $scope.user, password: $scope.password}
        })
        .success(function(data) {
            // gravação do token de acesso
            $window.sessionStorage.token = data.token;
            $scope.error = "";

            $http.get('/api/restrito/contatos/total')
            .then(function (response) {
                $scope.total = response.data;
                $scope.mostrarTotal = true;
            });

            $http.get('/api/restrito/contatos')
            .then(function (response) {
                var lista = _.map(response.data, function(contato) {
                            return {
                                nome: contato.nome,
                                email: contato.email,
                                ipaddress: contato.ipaddress.split(':')[0],
                                data_contato: ' ' + moment.utc(contato.data_contato).local().format("DD-MM-YYYY HH:mm:SS")
                            }
                        });
                $scope.contatos = lista;
                $scope.mostrarLista = true;
            });
        })
        .error(function(err) {
            $scope.total = 0;
            $scope.contatos = [];
            $scope.mostrarTotal = false;
            $scope.mostrarLista = false;
            $scope.error = err;
            delete $window.sessionStorage.token;
        });

        
    }
    
});

app.factory('authInterceptor', function ($rootScope, $q, $window) {
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

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});