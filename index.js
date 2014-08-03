var getApp = require('./getApp');
var http = require('http');
CONFIG = require('./config');

getApp(function(err, app){
  if (err) throw err;
  http.createServer(app).listen(CONFIG.port, function(err){
    if (err) throw err;
    console.log("server listening on port ", CONFIG.port);
  });
});

