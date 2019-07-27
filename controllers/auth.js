/* eslint-disable max-len */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router({ mergeParams: true });

const passportConfig = require('../config/passport');
const User = require('../models/User');
const Company = require('../models/Company');
const Invitation = require('../models/Invitation');
const { sendResetPasswordEmail, sendConfirmationEmail } = require('../helpers/sendgrid.helper');
const recurly = require('../helpers/recurly.helper');

const login = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ errors: { global: { message: info.msg } } });
    }

    user.setToken();
    try {
      await user.save();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
    const company = await Company.findOne({ _id: user.company });
    res.send({ user: user.toAuthJSON(), company });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    const { user } = req;
    user.token = '';
    await user.save();

    res.send({ user: user.toAuthJSON() });
  } catch (error) {
    res.status(404).json({ errors: { global: { message: 'Invalid token' } } });
  }
};

const register = async (req, res) => {
  const {
    email, password, fullName
  } = req.body;
  let { companyName } = req.body;
  try {
    let role;
    let company;

    // Check Invitation Model to check if this is invited user or admin user.
    const invitation = await Invitation.findOne({ value: email.toLowerCase() });

    // Create / Get Company & Set role
    if (invitation) {
      company = await Company.findOne({ _id: invitation.company });
      companyName = company.name;
      invitation.remove();
      role = 'Member';
    } else {
      // Auto-Create Subscription Free Trial (method = '')
      company = new Company({
        name: companyName,
        method: '',
      });
      await company.save();
      role = 'Admin';
    }

    // Create User
    const user = new User({
      email,
      password,
      fullName,
      companyName,
      role
    });

    user.setConfirmationToken();
    user.setToken();
    user.company = company;
    await user.save();
    sendConfirmationEmail(user);

    // Create Account of Recurly
    const accountCode = `${company._id}`;
    const account = await recurly.fetchAccount(accountCode);
    if (!account) {
      const accountData = {
        account: {
          account_code: accountCode,
          email,
          first_name: fullName.split(' ').slice(0, -1).join(' '),
          last_name: fullName.split(' ').slice(-1).join(' '),
          username: fullName,
          company_name: companyName
        }
      };
      await recurly.createAccount(accountData);
    }

    res.send({ user: user.toAuthJSON() });
  } catch (error) {
    console.log(error);
    res.status(400).json({ errors: error.errors });
  }
};

const registerConfirmation = (req, res) => {
  const { token } = req.body;
  jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ errors: { global: { message: 'Invalid token' } } });
    } else {
      User.findOne({ _id: decoded._id }).then((user) => {
        if (user) {
          sendConfirmationEmail(user);
          res.json({ user: user.toAuthJSON() });
        } else {
          res.status(404).json({ errors: { global: { message: 'Invalid token' } } });
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
        .json({ errors: { global: { message: 'This email does not exist' } } });
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
        .json({ errors: { global: { message: 'This email does not exist' } } });
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
router.post('/logout', passportConfig.authorize(), logout);
router.post('/register', register);
router.post('/register-confirmation', registerConfirmation);
router.get('/confirmation/:token', confirmToken);
router.post('/confirmation', confirmation);
router.post('/reset_password', resetPassword);
router.post('/reset_password_request', resetPasswordRequest);
// router.get('/twitter', passport.authenticate('twitter'));
// router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
// router.get('/google', passport.authenticate('google', { scope: 'profile email' }));
// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });

module.exports = router;
