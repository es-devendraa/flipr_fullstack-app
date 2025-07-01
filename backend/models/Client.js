const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL from Cloudinary
  name: { type: String, required: true },
  description: { type: String, required: true },
  designation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Client', clientSchema);