var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Contato = mongoose.model('Contato');
var util = require('util');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var moment = require('moment');

var config = require("../config/configDev.json");
var secret = config.jwtSecret;

// API acessar video
router.get('/api/restrito/video', function(req, res) {
    res.send("ok").end();
});

// API listar contatos
router.get('/api/restrito/contatos', function(req, res) {
    Contato.find(function(err, contatos) {
        if (err) {
            res.send(err).end();
            return;
        } else {
            res.json(contatos).end();
        }
    });
});

// API Criar contato
router.post('/api/contatos', function(req, res) {

    req.checkBody('nome', 'Nome inválido').notEmpty();
    req.checkBody('email', 'Email inválido').notEmpty().isEmail();

    var errors = req.validationErrors();
    if (errors) {
        var msg = errors[0].msg;
        // res.status(400).send('Ocorreram problemas de validação: ' + util.inspect(errors));
        res.status(400).send(msg);
        return;
    }

    var nome = req.body.nome;
    var email = req.body.email;

    Contato.findOne({ 'email': email}, function (err, contato) {
        if (err) {
            insertContato(req, res, nome, email);
        } else {
            if(contato) {
                // res.send("Email já cadastrado!").end();
                res.json({ token: gerarJwt(contato) });
            } else {
                insertContato(req, res, nome, email);
            }
            return;
        }
    });

});

// API listar total contatos
router.get('/api/restrito/contatos/total', function(req, res) {
    Contato.find(function(err, contatos) {
        if (err)
            res.send(err)
        // Retorna número de contatos encontrados no BD
        res.json(contatos.length); 
    });
});

// API listar total contatos
router.get('/api/token', function(req, res) {
    var user = req.query.user;
    var password = req.query.password;

    if(!user || !password) {
        res.status(401).send("Acesso não autorizado!");
        return;
    } else {
        if(user === config.painelAdminLogin && password === config.painelAdminPass) {
            var profile = {
                user: user
            };

            token = jwt.sign(profile, secret, { expiresIn: 180 });
            res.json({ token: token });
            return;
        } else {
            res.status(401).send("Acesso não autorizado!");
            return;
        }
    }
});


 
// Rota para index.html
router.get('/', function(req, res) {   
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
            res.json({ token: gerarJwt(contato) });
            // res.send("Cadastrado com sucesso").end();
        }
        return;
    });
}

function gerarJwt(contato) {
    var profile = {
        nome: contato.nome,
        email: contato.email,
        ip: contato.ip
    };

    return token = jwt.sign(profile, secret, { expiresIn: 600 });
}
 
module.exports = router;