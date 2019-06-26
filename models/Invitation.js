const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
