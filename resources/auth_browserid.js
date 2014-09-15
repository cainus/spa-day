var passport = require('passport');
var User = require('../models/User');

module.exports = {
  POST : function(req, res) {
    console.log("got a post!", req.user, req.body);
    //TODO there's no body parsing yet, so we can't see what is getting sent here
    passport.authenticate('persona', { failureRedirect: '/login' })(req, res, function(err){
      if (err){
        console.log("err from passport: ", err);
      }
      console.log("auth suceeded!");
      console.log("req.user: ", req.user);
      User.ensure(req.user.email, function(err, result){
        if (err){
          res.status.internalServerError(err);
        }
        console.log("result: ", result);
        res.status.redirect('/api');
      })
    });
  }
};
