const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Logo = mongoose.model('Logo', logoSchema);

module.exports = Logo;
