var app = require('./app');
var http = require('http');

http.createServer(app).listen(3000, function(err){
  if (err) throw err;
  console.log("server listening on port 3000");
});

