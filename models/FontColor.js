const mongoose = require('mongoose');

const fontColorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const FontColor = mongoose.model('FontColor', fontColorSchema);

module.exports = FontColor;
