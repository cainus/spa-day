var MongoClient = require('mongodb').MongoClient;
var CONFIG = require('./config');
var db = null;

module.exports = {

  get : function(cb){
    if (db) {
      return cb(null, db);
    }
    MongoClient.connect(CONFIG.mongo.connectionString, function(err, theDb) {
      if (err)
        return cb(err);
      db = theDb;
      return cb(null, db);
    });
  },

  getSync : function(){
    if (!db){
      throw new Error("the database is not yet initialized!");
    }
    return db;
  }

}

