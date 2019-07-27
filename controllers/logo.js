const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router({ mergeParams: true });

const createLogo = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.logo.push({
      value: `/uploads/${req.file.filename}`,
      name: req.file.originalname,
    });
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getLogos = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    res.send({ logos: brand.logo });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateLogo = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const element = brand.logo.find(logo => logo._id === req.params.id);
    element.value = `/uploads/${req.file.filename}`;
    element.name = req.file.originalname;
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteLogo = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.logo = brand.logo.filter(logo => logo._id.toString() !== req.params.id);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getLogos);
router.post('/', upload.single('value'), passportConfig.authorize(), createLogo);
router.put('/:id', upload.single('value'), passportConfig.authorize(), updateLogo);
router.delete('/:id', passportConfig.authorize(), deleteLogo);

module.exports = router;
