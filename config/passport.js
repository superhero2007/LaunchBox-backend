const passport = require('passport');
const Promise = require('bluebird');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));

passport.use(new JWTstrategy({
  secretOrKey: process.env.SESSION_SECRET,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (user, done) => {
  try {
    return done(null, user);
  } catch (err) {
    done(err, null);
  }
}));


const handleJWT = (req, res, next) => async (err, _user, info) => {
  const logIn = Promise.promisify(req.logIn);
  const apiError = new Error('Unauthorized');
  apiError.status = 401;

  console.log('authorize');

  if (err || !_user) {
    return next(apiError);
  }

  try {
    await logIn(_user, { session: false });
  } catch (e) {
    return next(apiError);
  }

  try {
    req.user = await User.findOne({ email: _user.email.toLowerCase() });
  } catch (e) {
    return next(apiError);
  }

  return next();
};

exports.authorize = () => (req, res, next) =>
  passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next),
  )(req, res, next);