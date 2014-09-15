var recollection = require('recollection');
var db = require('../database').getSync();

var userSchema = {
  emailAddress : {
    type : 'string',
    required : true
  }
};

var base = new recollection('user', userSchema, db);

var User = {
  ensure : function(emailAddress, cb){
    base.ensure({emailAddress : emailAddress}, function(err, user){
      if (err) {
        return cb(err);
      }
      return cb(null, user);
    });
  },

  findByEmailAddress : function(emailAddress, cb){
    base.findOne({emailAddress : emailAddress}, function(err, user){
      return cb(err, user);
    });
  }
};


module.exports = User;
