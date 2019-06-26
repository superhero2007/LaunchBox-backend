const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;
