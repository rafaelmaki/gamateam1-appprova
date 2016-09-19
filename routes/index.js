var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Contato = mongoose.model('Contato');
var util = require('util');

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

    req.checkBody('nome', 'Nome inválido').notEmpty();
    req.checkBody('email', 'Email inválido').notEmpty().isEmail();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('Ocorreram problemas de validação: ' + util.inspect(errors));
        return;
    }

    var nome = req.body.nome;
    var email = req.body.email;

    Contato.findOne({ 'email': email}, function (err, contato) {
        if (err) {
            Contato.create({
                nome: nome,
                email: email,
                ipaddress: getClientIp(req),
                data_contato: new Date(),
                done : false
            }, function(err, contato) {
                if (err) {
                    res.status(400).send(err).end();
                }
                else {
                    res.send("Cadastrado com sucesso").end();
                }
                return;
            });
        } else {
            if(contato) {
                res.status(400).send("Email já cadastrado!").end();
            } else {
                insertContato(req, res, nome, email);
            }
            
            return;
        }
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
    root: __dirname + '/../landing/',
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

function getClientIp(req) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    var forwardedIps = req.connection.remoteAddress.split(',');
    ipAddress = forwardedIps[0];
  }
  return ipAddress;
};

function emailExists(email) {
    Contato.findOne({ 'email': email}, function (err, contato) {
        if (err) {
            return null;
        } else {
            return contato;
        }
    });
};

function insertContato(req, res, nome, email) {
    Contato.create({
        nome: nome,
        email: email,
        ipaddress: getClientIp(req),
        data_contato: new Date(),
        done : false
    }, function(err, contato) {
        if (err) {
            res.status(400).send(err).end();
        }
        else {
            res.send("Cadastrado com sucesso").end();
        }
        return;
    });
}
 
module.exports = router;