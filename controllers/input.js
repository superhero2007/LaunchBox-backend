const express = require('express');

const passportConfig = require('../config/passport');

const Input = require('../models/Input');

const router = express.Router();

const createInput = async (req, res, next) => {
  const input = new Input({
    user: req.user,
    label: req.body.label,
    value: req.body.value
  });

  try {
    await input.save();
    res.send({ inputElement: input });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getInputs = async (req, res, next) => {
  try {
    const inputElements = await Input.find({ user: req.user });
    res.send({ inputElements });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateInput = async (req, res, next) => {
  try {
    const input = await Input.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.send({ inputElement: input });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteInput = async (req, res, next) => {
  try {
    await Input.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getInputs);
router.post('/', passportConfig.authorize(), createInput);
router.put('/:id', passportConfig.authorize(), updateInput);
router.delete('/:id', passportConfig.authorize(), deleteInput);

module.exports = router;
