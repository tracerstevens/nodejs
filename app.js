var http = require('http');
var restify = require('restify');
var bson = require('bson');
var util = require('util');
var messageController = require('./messageController');

var MongoClient = require('mongodb').MongoClient;
var db;


/**
 * DB Connection
 */
MongoClient.connect("mongodb://127.0.0.1:27017/exampleDb", function(err, database) {
  if(err) throw err;

  db = database;
});


/**
 * Server
 * @type {*}
 */
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


/**
 * Routes
 */
server.get('/message/:id', function(req, res, next) {messageController.getMessage(db, req, res, util); return next();});
server.post('/message/:id', function(req, res, next) {messageController.postMessage(db, req, res, util); return next();});


/**
 * Listen
 */
server.listen(3000, function() {
	console.log('%s listening at %s', server.name, server.url);
});