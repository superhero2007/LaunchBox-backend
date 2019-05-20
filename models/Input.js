const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
}, { timestamps: true });

const Input = mongoose.model('Input', inputSchema);

module.exports = Input;
