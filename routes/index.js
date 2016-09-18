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
    var nome = req.body.nome;
    var email = req.body.email;
    if(!nome || !email) {
        res.status(404).send('Dados inválidos').end();
        return;
    }

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
                    res.status(404).send(err).end();
                }
                else {
                    res.send("Cadastrado com sucesso").end();
                }
                return;
            });
        } else {
            if(contato) {
                res.status(404).send("Email já cadastrado!").end();
            } else {
                insertContato(req, res, nome, email);
            }
            
            return;
        }
    });
    
    // Contato.create({
    //     nome: req.body.nome,
    //     email: req.body.email,
    //     ipaddress: getClientIp(req),
    //     data_contato: new Date(),
    //     done : false
    // }, function(err, contato) {
    //     if (err)
    //         res.status(404).send(err).end();
    //     else
    //         res.send("Cadastrado com sucesso").end();
    // });
 
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
            res.status(404).send(err).end();
        }
        else {
            res.send("Cadastrado com sucesso").end();
        }
        return;
    });
}
 
module.exports = router;