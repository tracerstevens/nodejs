var http = require('http');
var restify = require('restify');
var bson = require('bson');
var util = require('util');
var cors = require('cors');

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
server.use(cors());


/**
 * Routes
 */
server.get('/message/:id', function(req, res, next) {
  db.collection("test").find({user_id : 10}).toArray(function(err,items){
    res.send(items);
  });

  return next();
});

server.post('/messages', function(req, res, next) {
  db.collection("test").insert({user_id : 10, message : req.params.message}, function(err, result) {});

  res.send("Insert Complete");
  return next();
});


/**
 * Listen
 */
server.listen(3000, function() {
	console.log('%s listening at %s', server.name, server.url);
});