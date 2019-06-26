const express = require('express');

const passportConfig = require('../config/passport');

const BrandColor = require('../models/BrandColor');

const router = express.Router();

const createBrandColor = async (req, res, next) => {
  const brandColor = new BrandColor({
    company: req.user.company,
    value: req.body.value
  });

  try {
    await brandColor.save();
    res.send({ brandColor });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getBrandColors = async (req, res, next) => {
  try {
    const brandColors = await BrandColor.find({ company: req.user.company });
    res.send({ brandColors });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateBrandColor = async (req, res, next) => {
  try {
    const brandColor = await BrandColor.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ brandColor });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteBrandColor = async (req, res, next) => {
  try {
    await BrandColor.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getBrandColors);
router.post('/', passportConfig.authorize(), createBrandColor);
router.put('/:id', passportConfig.authorize(), updateBrandColor);
router.delete('/:id', passportConfig.authorize(), deleteBrandColor);

module.exports = router;
