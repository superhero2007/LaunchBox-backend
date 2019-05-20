/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  let token;

  if (header) {
    token = header.split(' ')[1];
  }

  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ errors: { global: 'Invalid token' } });
      }
      User.findOne({ email: decoded.email }).then((user) => {
        req.currentUser = user;
        next();
      }).catch(() => res.status(401).json({ errors: { global: 'No such token' } }));
    });
  } else {
    return res.status(401).json({ errors: { global: 'No token' } });
  }
};
