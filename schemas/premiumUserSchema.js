const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  premiumSince: {
    type: Date,
    default: null,
  },
  premiumUntil: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
