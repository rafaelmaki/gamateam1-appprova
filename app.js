var express  = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

var config = require("./config/config.json");

// conectando ao mongodb no localhost, criando o banco de dados contato
// mongoose.connect('mongodb://localhost/contato');

var uri = config.mongoConfig;
mongoose.connect(uri, function(error) {
  // if error is truthy, the initial connection failed.
  console.log("Erro ao conectar no MongoDB ", error);
})
// Requisição ao arquivo que cria model Contato
require('./models/Contato');

// public static files
app.use(express.static(__dirname + '/public'));
// log http requests
app.use(logger('dev'));
// parse application/x-www-form-urlencoded                                    
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json          
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
 
 // including routes
var index = require('./routes/index');

app.use('/', index);

// Define a porta 8080 onde será executada nossa aplicação
var port = process.env.port || 3000;
app.listen(port);
// Imprime uma mensagem no console
console.log("Aplicação executada na porta ", port);