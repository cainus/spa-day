var _ = require('lodash');

var config = {

  test : {
    mongo : {
      name : 'test'
    },
    port : 4000
  },

  default : {
    mongo : {
      name : 'spa_day'
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


