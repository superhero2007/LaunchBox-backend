const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  companyName: String,
  fullName: String,
  email: { type: String, unique: true },
  photo: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  confirmed: { type: Boolean, default: false },
  confirmationToken: String,
  emailToken: String,
  token: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  role: { type: String, required: true }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (user.isNew) {
    user.confirmationToken = this.generateJWT();
  }
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.methods.isConfirmed = function isConfirmed() {
  return this.confirmed;
};

userSchema.methods.setPassword = function setPassword(password) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return; }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) { return; }
      this.password = hash;
    });
  });
};

userSchema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

userSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.FRONTEND_URL}/confirmation/${this.confirmationToken}`;
};

userSchema.methods.setEmailToken = function setEmailToken(newEmail) {
  const expireDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 20);
  this.emailToken = jwt.sign({
    _id: this._id,
    email: newEmail,
    exp: expireDate,
  },
  process.env.SESSION_SECRET);
};

userSchema.methods.generateEmailUrl = function generateEmailUrl() {
  return `${process.env.FRONTEND_URL}/email_confirmation/${this.emailToken}`;
};

userSchema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
  return `${process.env.FRONTEND_URL}/reset_password/${this.generateResetPasswordToken()}`;
};

userSchema.methods.setToken = function setToken() {
  this.token = this.generateJWT();
};

userSchema.methods.generateJWT = function generateJWT() {
  const expireDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 20);
  return jwt.sign({
    _id: this._id,
    companyName: this.companyName,
    fullName: this.fullName,
    email: this.email,
    confirmed: this.confirmed,
    exp: expireDate,
  },
  process.env.SESSION_SECRET);
};

userSchema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  return jwt.sign({
    _id: this._id
  },
  process.env.SESSION_SECRET,
  { expiresIn: '1h' });
};

userSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    _id: this._id,
    email: this.email,
    companyName: this.companyName,
    fullName: this.fullName,
    confirmed: this.confirmed,
    photo: this.photo,
    token: this.token,
    company: this.company,
    role: this.role
  };
};

userSchema.plugin(uniqueValidator, { message: 'This is already taken' });

const User = mongoose.model('User', userSchema);

module.exports = User;
