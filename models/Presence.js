const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Presence = mongoose.model('Presence', presenceSchema);

module.exports = Presence;
