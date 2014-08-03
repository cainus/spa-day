var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var db = null;

// Set up the connection to the local db
var mongoclient = new MongoClient(
    new Server("localhost", 27017), {native_parser: true}
);

module.exports = {

  get : function(cb){
    if (db) {
      return cb(null, db);
    }
    // Open the connection to the server
    mongoclient.open(function(err, mongoclient) {
      if (err)
        return cb(err);
      // Get the first db and do an update document on it
      db = mongoclient.db("tests");
      return cb(null, db);
    });
  }

}

