var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Contato = mongoose.model('Contato');
 
// API listar contatos
router.get('/api/contatos', function(req, res) {
    Contato.find(function(err, contatos) {
        if (err)
            res.send(err)
        // Retorna todos os contatos encontrados no BD
        res.json(contatos); 
    });
});
 
// API Criar contato
router.post('/api/contatos', function(req, res) {
    Contato.create({
        nome: req.body.nome,
        email: req.body.email,
        ipaddress: req.ip,
        data_contato: new Date(),
        done : false
    }, function(err, contato) {
        if (err)
            res.send(err);
        else
            res.send("Cadastrado com sucesso");
    });
 
});

// API listar total contatos
router.get('/api/contatos/total', function(req, res) {
    Contato.find(function(err, contatos) {
        if (err)
            res.send(err)
        // Retorna número de contatos encontrados no BD
        res.json(contatos.length); 
    });
});
 
// Rota para index.html
router.get('*', function(req, res) {   
    var options = {
    root: __dirname + '/../public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});
 
module.exports = router;