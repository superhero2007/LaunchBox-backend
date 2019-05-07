const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  companyName: String,
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  confirmationToken: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (user.isNew) {
    user.confirmationToken = user.generateConfirmationToken();
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

/**
 * generateConfirmationToken - Generates a unique string used as email confirmation token
 *
 * @return {string}  Confirmation token
 */
userSchema.methods.generateConfirmationToken = function generateConfirmationToken() {
  const pattern = 'pxxxxx-yyxxyy-xxxxx-xx78xx';
  const token = pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
