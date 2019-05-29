const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const upload = multer({ dest: 'uploads/' });
const passportConfig = require('../config/passport');

const router = express.Router();

const User = require('../models/User');
const BrandColor = require('../models/BrandColor');
const Font = require('../models/Font');
const FontColor = require('../models/FontColor');
const Icon = require('../models/Icon');
const Input = require('../models/Input');
const Logo = require('../models/Logo');
const Presence = require('../models/Presence');

const { sendChangeEmail } = require('../helpers/sendgrid.helper');

const getUser = (req, res, next) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(404).json({ errors: { global: 'Invalid token' } });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: req.body },
      { new: true });
    user.setToken();
    await user.save();
    res.send({ user });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.comparePassword(req.body.password, async (error, isMatch) => {
      if (error) { return res.status(400).json({ errors: error.errors }); }
      if (isMatch) {
        user.setEmailToken(req.body.email);
        user.setToken();
        await user.save();
        sendChangeEmail(user);
        return res.send({ user });
      }
      return res.status(400).json({ errors: { global: { msg: 'Invalid email or password.' } } });
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateEmailConfirm = async (req, res, next) => {
  const { token } = req.body;
  console.log('[email confirmation]', token);

  try {
    User.findOne({ emailToken: token }).then(async (user) => {
      if (!user) {
        return res
          .status(400)
          .json({ errors: { global: 'This email token does not exist' } });
      }
      const newEmail = jwt.verify(token, process.env.SESSION_SECRET).email;
      user.email = newEmail;
      user.emailToken = '';
      user.setToken();
      await user.save();
      return res.send({ user });
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.comparePassword(req.body.oldPassword, async (error, isMatch) => {
      if (error) { return res.status(400).json({ errors: error.errors }); }
      if (isMatch) {
        user.password = req.body.newPassword;
        user.setToken();
        await user.save();
        res.send({ user });
      }
      return res.status(400).json({ errors: { global: { msg: 'Invalid email or password.' } } });
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndRemove(req.user._id);
    res.send({});
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const clearUser = async (req, res, next) => {
  try {
    await BrandColor.deleteMany({ user: req.user });
    await Font.deleteMany({ user: req.user });
    await FontColor.deleteMany({ user: req.user });
    await Icon.deleteMany({ user: req.user });
    await Input.deleteMany({ user: req.user });
    await Logo.deleteMany({ user: req.user });
    await Presence.deleteMany({ user: req.user });
    res.send({});
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const uploadPhoto = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: { photo: `/uploads/${req.file.filename}` } },
      { new: true });
    await user.save();
    res.send({ user });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deletePhoto = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: { photo: '' } },
      { new: true });
    await user.save();
    res.send({ user });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getUser);
router.post('/email', passportConfig.authorize(), updateEmail);
router.post('/email-confirm', passportConfig.authorize(), updateEmailConfirm);
router.post('/password', passportConfig.authorize(), updatePassword);
router.post('/', passportConfig.authorize(), updateUser);
router.post('/clear', passportConfig.authorize(), clearUser);
router.delete('/', passportConfig.authorize(), deleteUser);
router.post('/photo', upload.single('file'), passportConfig.authorize(), uploadPhoto);
router.delete('/photo', passportConfig.authorize(), deletePhoto);

module.exports = router;
