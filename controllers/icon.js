const express = require('express');

const passportConfig = require('../config/passport');

const Icon = require('../models/Icon');

const router = express.Router();

const createIcon = async (req, res, next) => {
  const icon = new Icon({
    user: req.user,
    value: req.body.value
  });

  try {
    await icon.save();
    res.send({ icon });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getIcons = async (req, res, next) => {
  try {
    const icons = await Icon.find();
    res.send({ icons });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateIcon = async (req, res, next) => {
  try {
    const icon = await Icon.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ icon });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteIcon = async (req, res, next) => {
  try {
    await Icon.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getIcons);
router.post('/', passportConfig.authorize(), createIcon);
router.put('/:id', passportConfig.authorize(), updateIcon);
router.delete('/:id', passportConfig.authorize(), deleteIcon);

module.exports = router;
