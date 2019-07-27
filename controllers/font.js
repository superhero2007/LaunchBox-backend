const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router({ mergeParams: true });

const createFont = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const fonts = req.files.map(file => (
      {
        name: file.originalname,
        value: `/uploads/${file.filename}`
      }
    ));
    brand.fonts = brand.fonts.concat(fonts);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getFonts = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    res.send({ fonts: brand.fonts });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateFont = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    const element = brand.fonts.find(font => font._id === req.params.id);
    element.value = `/uploads/${req.file.filename}`;
    element.name = req.file.originalname;
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteFont = async (req, res) => {
  try {
    const brand = await Brand.findOne({ _id: req.params.brandId });
    brand.fonts = brand.fonts.filter(font => font._id.toString() !== req.params.id);
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getFonts);
router.post('/', upload.array('value'), passportConfig.authorize(), createFont);
router.put('/:id', upload.single('value'), passportConfig.authorize(), updateFont);
router.delete('/:id', passportConfig.authorize(), deleteFont);

module.exports = router;
