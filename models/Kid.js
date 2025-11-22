const mongoose = require('mongoose');

const kidSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: 'default_avatar.png' }, 
  ageGroup: { 
    type: String, 
    enum: ['3-5', '6-8', '9-11'], 
    required: true 
  },
  stats: {
    totalStars: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date }
  }
});

module.exports = mongoose.model('Kid', kidSchema);