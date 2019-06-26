/**
 * Module dependencies.
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const passport = require('passport');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const Promise = require('bluebird');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const companyController = require('./controllers/company');
const brandController = require('./controllers/brand');
const presenceController = require('./controllers/presence');
const logoController = require('./controllers/logo');
const fontController = require('./controllers/font');
const fontColorController = require('./controllers/fontColor');
const brandColorController = require('./controllers/brandColor');
const iconController = require('./controllers/icon');
const invitationController = require('./controllers/invitation');
const memberController = require('./controllers/member');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Primary app routes.
 */
app.use('/api/auth', authController);
app.use('/api/user', userController);
app.use('/api/company', companyController);
app.use('/api/brand', brandController);
app.use('/api/presence', presenceController);
app.use('/api/logo', logoController);
app.use('/api/font', fontController);
app.use('/api/font-color', fontColorController);
app.use('/api/brand-color', brandColorController);
app.use('/api/icon', iconController);
app.use('/api/invitation', invitationController);
app.use('/api/member', memberController);

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
