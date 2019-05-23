const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const passportConfig = require('../config/passport');

const router = express.Router();

const User = require('../models/User');

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
router.post('/', passportConfig.authorize(), updateUser);
router.post('/photo', upload.single('file'), passportConfig.authorize(), uploadPhoto);
router.delete('/photo', passportConfig.authorize(), deletePhoto);

module.exports = router;
