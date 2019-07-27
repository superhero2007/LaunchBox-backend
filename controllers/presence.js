const express = require('express');

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router({ mergeParams: true });

const createPresence = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.social.push({
      value: req.body.value,
      type: req.body.type,
    });
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const getPresences = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    res.send({ presences: brand.social });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updatePresence = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const presence = brand.social.find(presence => presence._id === req.params.id);
    presence.type = req.body.type;
    presence.value = req.body.value;
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deletePresence = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.social = brand.social.filter(presence => presence._id.toString() !== req.params.id);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getPresences);
router.post('/', passportConfig.authorize(), createPresence);
router.put('/:id', passportConfig.authorize(), updatePresence);
router.delete('/:id', passportConfig.authorize(), deletePresence);

module.exports = router;
