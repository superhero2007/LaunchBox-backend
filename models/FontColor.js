const mongoose = require('mongoose');

const fontColorSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const FontColor = mongoose.model('FontColor', fontColorSchema);

module.exports = FontColor;
