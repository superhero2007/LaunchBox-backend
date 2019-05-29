const express = require('express');

const passportConfig = require('../config/passport');

const Presence = require('../models/Presence');

const router = express.Router();

const createPresence = async (req, res, next) => {
  const presence = new Presence({
    user: req.user,
    value: req.body.value
  });

  try {
    await presence.save();
    res.send({ presence });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getPresences = async (req, res, next) => {
  try {
    const presences = await Presence.find({ user: req.user });
    res.send({ presences });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updatePresence = async (req, res, next) => {
  try {
    const presence = await Presence.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ presence });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deletePresence = async (req, res, next) => {
  try {
    await Presence.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getPresences);
router.post('/', passportConfig.authorize(), createPresence);
router.put('/:id', passportConfig.authorize(), updatePresence);
router.delete('/:id', passportConfig.authorize(), deletePresence);

module.exports = router;
