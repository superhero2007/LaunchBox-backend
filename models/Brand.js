const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  value: {
    type: String,
    required: true
  },
  site: {
    type: String,
    required: true
  },
  logo: {
    type: String,
  },
  colors: [
    {
      type: String,
    }
  ],
  fonts: [
    {
      type: String,
    }
  ],
  social: [
    {
      value: {
        type: String
      },
      type: {
        type: Number
      }
    }
  ],
  role: String
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
