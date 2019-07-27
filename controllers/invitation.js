const express = require('express');

const passportConfig = require('../config/passport');

const Invitation = require('../models/Invitation');
const Company = require('../models/Company');

const router = express.Router({ mergeParams: true });

const { sendInvitationEmail } = require('../helpers/sendgrid.helper');

const createInvitation = async (req, res, next) => {
  const invitation = new Invitation({
    company: req.user.company,
    value: req.body.value
  });
  const company = await Company.findOne({ _id: req.user.company });

  sendInvitationEmail(company, req.body.value, req.user.fullName);

  try {
    await invitation.save();
    res.send({ invitation });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const getInvitations = async (req, res, next) => {
  try {
    const invitations = await Invitation.find({ company: req.user.company });
    res.send({ invitations });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};


const updateInvitation = async (req, res, next) => {
  try {
    const invitation = await Invitation.findByIdAndUpdate(req.params.id,
      { $set: req.body },
      { new: true });
    res.send({ invitation });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const deleteInvitation = async (req, res, next) => {
  try {
    await Invitation.findByIdAndRemove(req.params.id);
    res.send({ _id: req.params.id });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getInvitations);
router.post('/', passportConfig.authorize(), createInvitation);
router.put('/:id', passportConfig.authorize(), updateInvitation);
router.delete('/:id', passportConfig.authorize(), deleteInvitation);

module.exports = router;
