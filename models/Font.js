const mongoose = require('mongoose');

const fontSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Font = mongoose.model('Font', fontSchema);

module.exports = Font;
