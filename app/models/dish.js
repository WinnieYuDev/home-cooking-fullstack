const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String, // or imagePath if uploading
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('dish', dishSchema);

//get img id for dishes