const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;
