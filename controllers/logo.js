const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const passportConfig = require('../config/passport');

const Logo = require('../models/Logo');

const router = express.Router();

const createLogo = async (req, res, next) => {
  const logo = new Logo({
    company: req.user.company,
    value: `/uploads/${req.file.filename}`
  });

  try {
    await logo.save();
    res.send({ logo });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getLogos = async (req, res, next) => {
  try {
    const logos = await Logo.find({ company: req.user.company });
    res.send({ logos });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateLogo = async (req, res, next) => {
  try {
    const logo = await Logo.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ logo });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteLogo = async (req, res, next) => {
  try {
    await Logo.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getLogos);
router.post('/', upload.single('file'), passportConfig.authorize(), createLogo);
router.put('/:id', passportConfig.authorize(), updateLogo);
router.delete('/:id', passportConfig.authorize(), deleteLogo);

module.exports = router;
