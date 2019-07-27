const express = require('express');

const passportConfig = require('../config/passport');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const getMembers = async (req, res) => {
  try {
    const members = await User.find({ company: req.user.company });
    res.send({ members });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await User.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ member });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteMember = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id,
      { $set: { role: '' } },
      { new: true });
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getMembers);
router.put('/:id', passportConfig.authorize(), updateMember);
router.delete('/:id', passportConfig.authorize(), deleteMember);

module.exports = router;
