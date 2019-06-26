const mongoose = require('mongoose');

const fontColorSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const FontColor = mongoose.model('FontColor', fontColorSchema);

module.exports = FontColor;
