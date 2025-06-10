const mongoose = require('mongoose');

const premiumCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9]{16}$/, 'Invalid premium code format'],
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  redeemedAt: {
    type: Date,
    default: null,
  },
  duration: {
    type: String,
    required: true,
    enum: ['minutely', 'weekly', 'monthly', 'yearly', 'lifetime'],
  },
});

const PremiumCode = mongoose.model('PremiumCode', premiumCodeSchema);

module.exports = PremiumCode;
