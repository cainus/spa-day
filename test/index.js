var verity = require('verity');
var expect = require('expect.js');
var http = require('http');
var app = require('../app');
var server = null;
var makeServer = function(cb){
  var serv = http.createServer(app).listen(4000, function(err){
    cb(err, serv);
  });
};

describe('root resource', function(req, res){
  before(function(done){
    makeServer(function(err, serv){
      if (err) throw err;
      server = serv;
      done();
    });
  });
  after(function(done){
    server.close(function(err){
      done(err);
    });
  });
  it ('returns "{got here : true}"', function(done){
    var v = verity('http://localhost:4000/api')
      .jsonMode()
      .method('GET')
      .expectStatus(200)
      .expectBody({'got here':true})
      .test(done);
  });
});
