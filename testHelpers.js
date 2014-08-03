var http = require('http');
var getApp = require('./getApp');
verity = require('verity');
expect = require('expect.js');
var difflet = require('difflet');
var deepEqual = require('deep-equal');
var traverse = require('traverse');
var assert = require('assert');

process.env.ENV = 'test';
console.log("set process.env.ENV to ", process.env.ENV);

CONFIG = require('./config');

var serv;

testServer = {
  open : function(cb){
    getApp(function(err, app){
      if (err) throw err;
      serv = http.createServer(app).listen(CONFIG.port, function(err){
        return cb(err);
      });
    });
  },

  port : CONFIG.port,

  close : function(cb){
    serv.close(cb);
  }

};

apiVerity = function(){
  return verity('http://localhost:' + CONFIG.port + '/api').jsonMode();
};

failOnError = function(err){
  if (err){
    console.error("");
    console.error("unexpected error: ", (err.message || err));
    console.error(err);
    console.error(new Error().stack);
    console.error("");
    throw "unexpected error: " + JSON.stringify((err.message || err));
  }
};

assertObjectEquals = function(actual, expected, options){
  if (options && options.unordered) {
    actual = actual.map(JSON.stringify).sort().map(JSON.parse);
    expected = expected.map(JSON.stringify).sort().map(JSON.parse);
  }

  // strip the milliseconds off all dates
  traverse(expected).forEach(function (x) {
    if (_.isDate(x)) {
      x.setMilliseconds(0);
      this.update(x);
    }
  });
  // strip the milliseconds off all dates
  traverse(actual).forEach(function (x) {
    if (_.isDate(x)) {
      x.setMilliseconds(0);
      this.update(x);
    }
  });
  if (!deepEqual(actual, expected)){
    process.stdout.write(difflet.compare(actual, expected));
    console.log("\n\nactual");
    console.log(JSON.stringify(actual, null, 2));
    console.log("\n\nexpected");
    console.log(JSON.stringify(expected, null, 2));
    console.log("\n\n");
    assert.fail(actual, expected);
    return false;
  }
  return true;
};

