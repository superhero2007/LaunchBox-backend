const mongoose = require('mongoose');

const iconSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  value: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon;
