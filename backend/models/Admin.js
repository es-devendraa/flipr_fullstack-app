const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    console.log('Original password:', this.password); // Debug log
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Hashed password:', this.password); // Debug log
  }
  next();
});

adminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('Admin', adminSchema);