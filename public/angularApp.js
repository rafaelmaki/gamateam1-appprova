// public/angularApp.js
 
// Criamos um módulo Angular chamado listaContatos
var contatos = angular.module('contatos', []);
 
function mainController($scope, $http) {    
 
    // Quando clicar no botão Criar, envia informações para a API Node
    $scope.criarContato = function() {
        $http.post('/api/contatos', $scope.formContato)
            .success(function(data) {
                // Limpa o formulário para criação de outros contatos
                $scope.formContato = {};
                $scope.contatos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
 
}