var User = require('../models/User');

module.exports = {

  GET : function(req, res) {
    if (!req.user){
      return res.status.notFound();
    }
    console.log("req.user: ", req.user);
    User.findByEmailAddress(req.user.email, function(err, user){
      if (err){
        return res.status.internalServerError(err);
      }
      return res.status.ok(user);
    });
  },

  DELETE : function(req, res){
    if (req.user){
      req.logout();
      res.status.noContent();
    } else {
      res.status.notFound();
    }
  }

};
