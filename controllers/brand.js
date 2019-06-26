const express = require('express');

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router();

const createBrand = async (req, res, next) => {
  const brand = new Brand({
    company: req.user.company,
    value: req.body.value,
    role: 'Public'
  });

  try {
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ company: req.user.company });
    res.send({ brands });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    await Brand.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getBrands);
router.post('/', passportConfig.authorize(), createBrand);
router.put('/:id', passportConfig.authorize(), updateBrand);
router.delete('/:id', passportConfig.authorize(), deleteBrand);

module.exports = router;
