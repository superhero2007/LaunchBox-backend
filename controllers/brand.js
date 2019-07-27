const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const passportConfig = require('../config/passport');

const Brand = require('../models/Brand');

const router = express.Router({ mergeParams: true });

const createBrand = async (req, res) => {
  const brand = new Brand({
    company: req.user.company,
    value: req.body.value,
    site: req.body.site,
    logo: [{ value: `/uploads/${req.files.logo[0].filename}`, name: req.files.logo[0].originalname }],
    colors: (typeof req.body.colors === 'string' ? [req.body.colors] : req.body.colors).map(color => ({ value: color })),
    fonts: req.files.fonts.map(font => ({ value: `/uploads/${font.filename}`, name: font.originalname })),
    social: typeof req.body.social === 'string' ? [JSON.parse(req.body.social)] : req.body.social.map(value => JSON.parse(value)),
    role: 'Public'
  });

  try {
    await brand.save();
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ company: req.user.company });
    res.send({ brands });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.send({ brand });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'fonts' }]);

router.get('/', passportConfig.authorize(), getBrands);
router.post('/', cpUpload, passportConfig.authorize(), createBrand);
router.put('/:id', cpUpload, passportConfig.authorize(), updateBrand);
router.delete('/:id', passportConfig.authorize(), deleteBrand);

module.exports = router;
