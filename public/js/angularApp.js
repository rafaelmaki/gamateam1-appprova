// public/angularApp.js
 
// Criamos um módulo Angular chamado listaContatos
var primeiroEnemApp = angular.module('primeiroEnemApp', ['ui.bootstrap']);
 
primeiroEnemApp.controller('MainController', MainController);

function MainController($scope, $http, $window, $uibModal) {    
 
    $scope.openModalContato = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'cadastroModal.html',
        controller: 'ModalContatoInstanceCtrl',
        controllerAs: '$ctrl'
      });
    };
 
}

primeiroEnemApp.controller('ModalContatoInstanceCtrl', function ($uibModalInstance, $http, $window) {
    var $ctrl = this;

    $ctrl.model = {};
    $ctrl.erros = {
        nome: null,
        email: null,
        mensagem: null
    };

    $ctrl.close = function () {
      $uibModalInstance.close();
    };

    // Quando clicar no botão Criar, envia informações para a API Node
    $ctrl.criarContato = function() {
        $ctrl.erros = {
            nome: null,
            email: null,
            mensagem: null
        };

        var nome = $ctrl.model.nome;
        var email = $ctrl.model.email;

        if(!nome) {
            $ctrl.erros.nome = "Campo nome é obrigatório";
        }

        if(!email) {
            $ctrl.erros.email = "Campo email é obrigatório";
        }

        if(!nome || !email) {
            delete $window.sessionStorage.token;
            return;
        }

        $http.post('/api/contatos', $ctrl.model)
            .success(function(data) {
                // Limpa o formulário para criação de outros contatos
                $ctrl.formContato = {};
                $ctrl.contatos = data;
                console.log(data);
                // gravação do token de acesso
                $window.sessionStorage.token = data.token;
                $window.location.href = '/views/videos/';
                $uibModalInstance.close();
            })
            .error(function(err) {
                console.log('Error: ' + err);
                $ctrl.erros.mensagem = err;
                delete $window.sessionStorage.token;
            });
    };

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1796519727300376',
            cookie     : true, 
            xfbml      : true, 
            version    : 'v2.7'
        });

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });

    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $ctrl.FBLogin = function() {
        FB.login(function(response) {
            if(response.authResponse) {
                FB.api('/me', {fields: ['name','email']}, function(response) {
                    $ctrl.model.nome = response.name;
                    $ctrl.model.email = response.email;
                    $ctrl.criarContato();
                });
            } else {
                console.log('Usuário não logado');
            }
        });
    };
});
