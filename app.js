var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var JsonStatus = require('json-status');
var router = require('detour')();


var statusMiddleware = JsonStatus.connectMiddleware({
  onError : function(data){
    console.log("error: ", data.type, data.message, data.detail);
  },
  quiet500 : false
});

var app = connect();
app.use(serveStatic('public'));
app.use(statusMiddleware);
app.use(router.middleware);

router.route('/api', {
  GET : function(req, res){
    res.status.ok({"got here" : true});
  }
});

module.exports = app;





