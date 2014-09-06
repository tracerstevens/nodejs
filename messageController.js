
getMessage = function(db, req, res, util) {
  db.collection("test").find().toArray(function(err,items) {
    res.send(util.inspect(items));
  });
}

postMessage = function(db, req, res, util) {
  db.collection("test").insert({message : req.params.message}, function(err, result) {});
  res.send("Insert Complete");
}


exports.getMessage = getMessage;
exports.postMessage = postMessage;




function testMessage(req, res, next, db) {
  db.collection("test").find().toArray(function(err,items) {
    res.send(util.inspect(items));
  });

  return next();
}



exports.testMessage = testMessage;