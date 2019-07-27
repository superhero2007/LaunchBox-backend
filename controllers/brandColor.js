const express = require('express');

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router({ mergeParams: true });

const createBrandColor = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.colors.push({
      value: req.body.value,
      type: req.body.type,
    });
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getBrandColors = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    res.send({ brandColors: brand.colors });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateBrandColor = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const element = brand.colors.find(presence => presence._id === req.params.id);
    element.value = req.body.value;
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteBrandColor = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.colors = brand.colors.filter(presence => presence._id.toString() !== req.params.id);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getBrandColors);
router.post('/', passportConfig.authorize(), createBrandColor);
router.put('/:id', passportConfig.authorize(), updateBrandColor);
router.delete('/:id', passportConfig.authorize(), deleteBrandColor);

module.exports = router;
