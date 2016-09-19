// public/angularApp.js
 
// Criamos um módulo Angular chamado listaContatos
var contatos = angular.module('contatos', ['ui.bootstrap']);
 
angular
  .module('contatos')
  .controller('MainController', MainController);

function MainController($scope, $http, $window, $uibModal) {    
 
    $scope.openModalContato = function () {
      var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'cadastroModal.html',
        controller: 'ModalContatoInstanceCtrl',
        controllerAs: '$ctrl'
      });
    };

    // Quando clicar no botão Criar, envia informações para a API Node
    $scope.criarContato = function() {
        $http.post('/api/contatos', $scope.formContato)
            .success(function(data) {
                // Limpa o formulário para criação de outros contatos
                $scope.formContato = {};
                $scope.contatos = data;
                console.log(data);
                $window.alert("Cadastrado com sucesso");
            })
            .error(function(err) {
                console.log('Error: ' + err);
                $window.alert("Erro ao cadastrar: " + err);
            });
    };
 
}

angular.module('contatos')
    .controller('ModalContatoInstanceCtrl', function ($uibModalInstance, $http, $window) {
    var $ctrl = this;

    $ctrl.model = {};

    $ctrl.close = function () {
      $uibModalInstance.close();
    };

    // Quando clicar no botão Criar, envia informações para a API Node
    $ctrl.criarContato = function() {
        $http.post('/api/contatos', $ctrl.model)
            .success(function(data) {
                // Limpa o formulário para criação de outros contatos
                $ctrl.formContato = {};
                $ctrl.contatos = data;
                console.log(data);
                // $window.alert("Cadastrado com sucesso");
                $uibModalInstance.close();
            })
            .error(function(err) {
                console.log('Error: ' + err);
                // $window.alert("Erro ao cadastrar: " + err);
            });
    };

  });

