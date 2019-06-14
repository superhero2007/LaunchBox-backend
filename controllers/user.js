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
const nummus = require('../helpers/nummuspay.helper');

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const subscriptionDate = new Date(user.subscription.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - subscriptionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (user.subscription.status === 0 && diffDays > 8) {
      user.subscription.status = 1;
      await user.save();
    }

    res.send({ user: user.toAuthJSON() });
  } catch (error) {
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
    res.send({ user: user.toAuthJSON() });
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
        return res.send({ user: user.toAuthJSON() });
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
      user.subscription.status = 0;
      user.subscription.date = new Date();
      user.subscription.amount = 0;
      user.subscription.method = false;
      user.subscription.users = 0;
      user.subscription.brands = 0;
      user.setToken();
      await user.save();
      return res.send({ user: user.toAuthJSON() });
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
        res.send({ user: user.toAuthJSON() });
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
    res.send({ user: user.toAuthJSON() });
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
    res.send({ user: user.toAuthJSON() });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!(user.paypal && user.paypal.email) && !(user.creditCard && user.creditCard.cardNumber)) {
      res.status(400).json({ errors: { global: 'Invalid Payment Method' } });
    }
    const productsResult = await nummus.getCompanyProducts();
    const companyProducts = productsResult.$values;
    if (!companyProducts.length) {
      res.status(400).json({ errors: { global: 'No Subscription' } });
    }
    const data = {
      PaymentToken: req.body.paymentToken,
      Amount: req.body.amount,
      tax: companyProducts[0].Tax,
      Currency: 'USD',
      ProductTitle: companyProducts[0].Title,
      ProductDescription: companyProducts[0].Description
    };
    await nummus.charge(data);
    user.subscription = {
      amount: req.body.amount,
      method: req.body.method,
      users: req.body.users,
      brands: req.body.brands,
      status: 2,
      date: new Date(),
    };
    await user.save();
    return res.send({ user: user.toAuthJSON() });
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
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

router.post('/subscribe', passportConfig.authorize(), subscribe);

module.exports = router;
