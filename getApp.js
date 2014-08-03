var database = require('./database');
var connect = require('connect');
var serveStatic = require('serve-static');
var JsonStatus = require('json-status');
var router = require('detour')();
var passport = require('passport');
var PersonaStrategy = require('passport-persona').Strategy;
var mongodb = require('mongodb');
var _ = require('lodash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisSessionStore = require('connect-redis')(session);

var CONFIG = require('./config');

var app = connect();

var getApp = function(cb){
  database.get(function(err, db){
    if (err) throw err;

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the BrowserID verified email address
    //   is serialized and deserialized.
    passport.serializeUser(function(user, done) {
      done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
      done(null, { email: email });
    });

    // Use the PersonaStrategy within Passport.
    //   Strategies in passport require a `verify` function, which accept
    //   credentials (in this case, a BrowserID verified email address), and invoke
    //   a callback with a user object.
    passport.use(new PersonaStrategy({
        audience: 'http://' + CONFIG.host
      },
      function(email, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          // To keep the example simple, the user's email address is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the email address with a user record in your database, and
          // return that user instead.
          return done(null, { email: email });
        });
      }
    ));

    var statusMiddleware = JsonStatus.connectMiddleware({
      onError : function(data){
        console.log("error: ", data.type, data.message, data.detail);
      },
      quiet500 : false
    });

    app.use(serveStatic('public'));
    app.use(cookieParser());
    var redisStoreOptions = {

    };
    app.use(
      session({
        store: new RedisSessionStore(redisStoreOptions),
        secret: CONFIG.cookie_secret,
        resave: true,
        saveUninitialized: true
      })
    );
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(statusMiddleware);
    app.use(router.middleware);

    router.route('/api', require('./resources/index'));

    return cb(null, app);

  });

};


module.exports = getApp;
