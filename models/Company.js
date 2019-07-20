const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  creditCard: {
    cardNumber: String,
    holderName: String,
    expiry: String,
    cvc: String,
  },
  paypal: {
    email: String,
    firstName: String,
    lastName: String,
  },
  subscription: {
    amount: Number,
    method: Boolean,
    users: Number,
    brands: Number,
    status: Number,
    date: Date,
  },
  method: { type: String }
}, { timestamps: true });

companySchema.methods.generateInvitationUrl = function generateInvitationUrl(email) {
  return `${process.env.FRONTEND_URL}/invitation/${this.generateInvitationToken(email)}`;
};

companySchema.methods.generateInvitationToken = function generateInvitationToken(email) {
  const value = JSON.stringify({
    email,
    companyName: this.name
  });
  console.log(Buffer.from(value).toString('base64'));
  return Buffer.from(value).toString('base64');
};


const Company = mongoose.model('Company', companySchema);

module.exports = Company;
