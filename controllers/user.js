const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const upload = multer({ dest: 'uploads/' });
const passportConfig = require('../config/passport');

const router = express.Router();

const User = require('../models/User');
const Company = require('../models/Company');
const BrandColor = require('../models/BrandColor');
const Font = require('../models/Font');
const FontColor = require('../models/FontColor');
const Icon = require('../models/Icon');
const Brand = require('../models/Brand');
const Logo = require('../models/Logo');
const Presence = require('../models/Presence');

const { sendChangeEmail } = require('../helpers/sendgrid.helper');

const getUser = async (req, res) => {
  try {
    // const subscriptionDate = new Date(user.subscription.date);
    // const now = new Date();
    // const diffTime = Math.abs(now.getTime() - subscriptionDate.getTime());
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //
    // if (user.subscription.status === 0 && diffDays > 8) {
    //   user.subscription.status = 1;
    //   await user.save();
    // }

    const company = await Company.findOne({ _id: req.user.company });
    res.send({ user: req.user.toAuthJSON(), company });
  } catch (error) {
    res.status(404).json({ errors: { global: { message: 'Invalid User' } } });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: req.body },
      { new: true });
    user.setToken();
    await user.save();
    res.send({ user: user.toAuthJSON() });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { user } = req;
    user.comparePassword(req.body.password, async (error, isMatch) => {
      if (error) { return res.status(400).json({ errors: error.errors }); }
      if (isMatch) {
        user.setEmailToken(req.body.email);
        user.setToken();
        await user.save();
        sendChangeEmail(user);
        return res.send({ user: user.toAuthJSON() });
      }
      return res.status(400).json({ errors: { global: { message: 'Invalid email or password.' } } });
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateEmailConfirm = async (req, res) => {
  const { token } = req.body;
  console.log('[email confirmation]', token);

  try {
    User.findOne({ emailToken: token }).then(async (user) => {
      if (!user) {
        return res
          .status(400)
          .json({ errors: { global: { message: 'This email token does not exist' } } });
      }
      const newEmail = jwt.verify(token, process.env.SESSION_SECRET).email;
      user.email = newEmail;
      user.emailToken = '';
      user.setToken();
      await user.save();
      return res.send({ user: user.toAuthJSON() });
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { user } = req;
    user.comparePassword(req.body.oldPassword, async (error, isMatch) => {
      if (error) { return res.status(400).json({ errors: error.errors }); }
      if (isMatch) {
        user.password = req.body.newPassword;
        user.setToken();
        await user.save();
        res.send({ user: user.toAuthJSON() });
      }
      return res.status(400).json({ errors: { global: { message: 'Invalid email or password.' } } });
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user._id);
    res.send({});
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const clearUser = async (req, res) => {
  try {
    // Delete Normal User Assets
    await BrandColor.deleteMany({ company: req.company });
    await Font.deleteMany({ company: req.company });
    await FontColor.deleteMany({ company: req.company });
    await Icon.deleteMany({ company: req.company });
    await Logo.deleteMany({ company: req.company });
    await Presence.deleteMany({ company: req.company });
    await Brand.deleteMany({ company: req.company, role: 'Public' });

    // Delete Admin User Assets
    const { user } = req;
    if (user.role === 'Admin') {
      await Brand.deleteMany({ company: req.company, role: 'Private' });
    }
    res.send({});
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: { photo: `/uploads/${req.file.filename}` } },
      { new: true });
    await user.save();
    res.send({ user: user.toAuthJSON() });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { $set: { photo: '' } },
      { new: true });
    await user.save();
    res.send({ user: user.toAuthJSON() });
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
