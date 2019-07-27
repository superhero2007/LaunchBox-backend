const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router({ mergeParams: true });

const createIcon = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const icons = req.files.map(file => (
      {
        name: file.originalname,
        value: `/uploads/${file.filename}`
      }
    ));
    brand.icons = brand.icons.concat(icons);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getIcons = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    res.send({ icons: brand.icons });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateIcon = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const element = brand.icons.find(icon => icon._id === req.params.id);
    element.value = `/uploads/${req.file.filename}`;
    element.name = req.file.originalname;
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteIcon = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.icons = brand.icons.filter(font => font._id.toString() !== req.params.id);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getIcons);
router.post('/', upload.array('value', 12), passportConfig.authorize(), createIcon);
router.put('/:id', passportConfig.authorize(), updateIcon);
router.delete('/:id', passportConfig.authorize(), deleteIcon);

module.exports = router;
