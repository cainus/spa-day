var _ = require('lodash');

var config = {

  test : {
    port : 4000
  },

  default : {
    mongo : {
      connectionString : 'mongodb://localhost:27017/spaday',
    },
    hostname : 'localhost',
    port : 3000,
    cookie_secret : 'kelowna'
  }

};

var returning = config[process.env.ENV] || {};
returning =  _.defaults(returning, config.default);
returning.host = returning.hostname + ':' + returning.port;
module.exports = returning;


