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
var bodyParser = require('body-parser');

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

    app.use(serveStatic('public'));
    var statusMiddleware = JsonStatus.connectMiddleware({
      onError : function(data){
        console.log("error: ", data.type, data.message, data.detail);
      },
      quiet500 : false
    });

    app.use(statusMiddleware);
    app.use(function(req, res, next){
      res.redirect = function(url){
        return res.status.redirect(url);
      };
      return next();
    });
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended : false}));
    var redisStoreOptions = { };
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
    app.use(router.middleware);

    router.route('/api', require('./resources/index'));
    router.route('/auth/browserid', require('./resources/auth_browserid'));
    router.route('/login', require('./resources/login'));
    router.route('/api/session', require('./resources/session'));

    /*
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// POST /auth/browserid
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  BrowserID authentication will verify the assertion obtained from
//   the browser via the JavaScript API.
app.post('/auth/browserid', 
  passport.authenticate('persona', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
    */

    return cb(null, app);

  });

};


module.exports = getApp;
