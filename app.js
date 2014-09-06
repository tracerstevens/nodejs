var http = require('http');
var cluster = require('cluster');
var restify = require('restify');
var bson = require('bson');
var util = require('util');
var cors = require('cors');

var MongoClient = require('mongodb').MongoClient;
var db;

var numCPUs = require('os').cpus().length;


/**
 * DB Connection
 */
MongoClient.connect("mongodb://127.0.0.1:27017/exampleDb", function(err, database) {
  if(err) throw err;

  db = database;
});

/**
 * Multi Core Ability
 */
if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('worker ' + worker.process.pid + ' online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {


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
    console.log('Request on worker #' + cluster.worker.id);
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
}