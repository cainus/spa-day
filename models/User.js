var recollection = require('recollection');


var User = function(){

};

User.prototype.findByEmailAddress = function(emailAddress, cb){
  return cb(null, {login : "cainus"});
};


module.exports = User;
