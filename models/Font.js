const mongoose = require('mongoose');

const fontSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Font = mongoose.model('Font', fontSchema);

module.exports = Font;
