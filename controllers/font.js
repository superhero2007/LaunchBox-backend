const express = require('express');

const passportConfig = require('../config/passport');

const Font = require('../models/Font');

const router = express.Router();

const createFont = async (req, res, next) => {
  const font = new Font({
    user: req.user,
    value: req.body.value
  });

  try {
    await font.save();
    res.send({ font });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getFonts = async (req, res, next) => {
  try {
    const fonts = await Font.find({ user: req.user });
    res.send({ fonts });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateFont = async (req, res, next) => {
  try {
    const font = await Font.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ font });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteFont = async (req, res, next) => {
  try {
    await Font.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getFonts);
router.post('/', passportConfig.authorize(), createFont);
router.put('/:id', passportConfig.authorize(), updateFont);
router.delete('/:id', passportConfig.authorize(), deleteFont);

module.exports = router;
