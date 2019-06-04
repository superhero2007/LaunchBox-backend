const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');
const { sendResetPasswordEmail, sendConfirmationEmail } = require('../helpers/sendgrid.helper');

const login = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ errors: { global: info.msg } });
    }

    user.setToken();
    try {
      await user.save();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        confirmed: user.confirmed,
        token: user.token
      }
    });
  })(req, res, next);
};

const register = async (req, res, next) => {
  const {
    email, password, fullName, companyName
  } = req.body;

  const user = new User({
    email,
    password,
    fullName,
    companyName
  });

  user.setConfirmationToken();
  user.setToken();
  try {
    await user.save();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
  sendConfirmationEmail(user);
  res.json({
    user: {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      companyName: user.companyName,
      confirmed: user.confirmed,
      token: user.token
    }
  });
};

const registerConfirmation = (req, res, next) => {
  const { token } = req.body;
  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ errors: { global: 'Invalid token' } });
    } else {
      User.findOne({ _id: decoded._id }).then((user) => {
        if (user) {
          sendConfirmationEmail(user);
          res.json({ user: user.toAuthJSON() });
        } else {
          res.status(404).json({ errors: { global: 'Invalid token' } });
        }
      });
    }
  });
};

const confirmToken = (req, res) => {
  const { token } = req.params;
  console.log('[confirmation]', token);

  User.findOneAndUpdate({ confirmationToken: token },
    { confirmationToken: '', confirmed: true },
    { new: true }).then((user) => {
    if (!user) {
      return res.status(400).json({});
    }
    return res.json({ user: user.toAuthJSON() });
  });
};

const confirmation = (req, res) => {
  const { token } = req.body;
  console.log('[confirmation]', token);

  User.findOneAndUpdate({ confirmationToken: token },
    { confirmationToken: '', confirmed: true },
    { new: true }).then((user) => {
    if (!user) {
      return res.status(400).json({});
    }
    return res.json({ user: user.toAuthJSON() });
  });
};


const resetPasswordRequest = (req, res) => {
  console.log('[reset_password_request]', req.body.email);
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res
        .status(400)
        .json({ errors: { global: 'This email does not exist' } });
    }
    sendResetPasswordEmail(user);
    return res.json({});
  });
};


const resetPassword = (req, res) => {
  const newPassword = req.body.password;
  console.log(req.body);
  const id = jwt.verify(req.body.token, process.env.SESSION_SECRET)._id;
  User.findById(id).then(async (user) => {
    if (!user) {
      return res
        .status(400)
        .json({ errors: { global: 'This email does not exist' } });
    }
    user.password = newPassword;
    try {
      await user.save();
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.json({});
  });
};

router.post('/login', login);
router.post('/register', register);
router.post('/register-confirmation', registerConfirmation);
router.get('/confirmation/:token', confirmToken);
router.post('/confirmation', confirmation);
router.post('/reset_password', resetPassword);
router.post('/reset_password_request', resetPasswordRequest);
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

module.exports = router;
