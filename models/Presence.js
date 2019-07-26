const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  value: {
    type: String,
    required: true
  },
  type: Number,
}, { timestamps: true });

const Presence = mongoose.model('Presence', presenceSchema);

module.exports = Presence;
