const express = require('express');

const passportConfig = require('../config/passport');

const FontColor = require('../models/FontColor');

const router = express.Router();

const createFontColor = async (req, res, next) => {
  const fontColor = new FontColor({
    company: req.user.company,
    value: req.body.value
  });

  try {
    await fontColor.save();
    res.send({ fontColor });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getFontColors = async (req, res, next) => {
  try {
    const fontColors = await FontColor.find({ company: req.user.company });
    res.send({ fontColors });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateFontColor = async (req, res, next) => {
  try {
    const fontColor = await FontColor.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ fontColor });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteFontColor = async (req, res, next) => {
  try {
    await FontColor.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getFontColors);
router.post('/', passportConfig.authorize(), createFontColor);
router.put('/:id', passportConfig.authorize(), updateFontColor);
router.delete('/:id', passportConfig.authorize(), deleteFontColor);

module.exports = router;
