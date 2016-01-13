var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var engine = require('ejs-mate');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env
 */
dotenv.load({ path: '.env' });

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var mapsController = require('./controllers/maps');
var scrapbookController = require('./controllers/scrapbook');

// var routes = require('./routes/index');
// var users = require('./routes/users');

/**
 * API keys and Passport configuration.
 */
var passportConf = require('./config/passport');

/**
 * Create the app
 */
var app = express();

/**
 * Set up view engine
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});





/**
 * Middleware
 */
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB || process.env.MONGOLAB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
/**
 * Middleware to set the app's global project name to "Time Capsule"
 */
app.use(function(req, res, next) {
    app.locals.project = process.env.PROJECT_NAME;
    next();
});
/**
 * Middleware to allow access to user in all ejs templates
 */
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
/**
 * If the request path has the letters "api",
 *  then set the returnTo URL to this path
 */
app.use(function(req, res, next) {
    if (/api/i.test(req.path)) {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);










/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);

app.get('/maps', mapsController.getIndex);
app.get('/scrapbook', scrapbookController.getIndex);


/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
    res.redirect(req.session.returnTo || '/');
});

/*
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback',
        passport.authenticate('instagram', { failureRedirect: '/login' }),
        function(req, res) {
    res.redirect(req.session.returnTo || '/');
});

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
    res.redirect(req.session.returnTo || '/');
});
*/

/**
 * Error Handler.
 */
app.use(errorHandler());



module.exports = app;
