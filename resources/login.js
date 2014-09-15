var fs = require('fs');

module.exports = {
  GET : function(req, res){
    console.log("req.user: ", req.user);
    var path = (req.user) ? './html/loggedIn.html' : './html/login.html';
    fs.readFile(path, function(err, html){
      if (err){
        return res.status.internalServerError(err);
      }
      res.setHeader('content-type', 'text/html');
      res.end(html);
    });
  }
};
