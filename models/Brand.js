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
    type: String
  },
  logo: [
    {
      value: {
        type: String
      },
      name: {
        type: String
      }
    }
  ],
  colors: [
    {
      value: {
        type: String
      }
    }
  ],
  fonts: [
    {
      value: {
        type: String
      },
      name: {
        type: String
      }
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
  icons: [
    {
      value: {
        type: String
      },
      name: {
        type: String
      }
    }
  ],
  role: String
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
