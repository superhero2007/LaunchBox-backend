const mongoose = require('mongoose');

const brandColorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const BrandColor = mongoose.model('BrandColor', brandColorSchema);

module.exports = BrandColor;
