const mongoose = require('mongoose');

// Tracks history for Screen 7 analytics
const progressSchema = new mongoose.Schema({
  kid: { type: mongoose.Schema.Types.ObjectId, ref: 'Kid' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  status: { type: String, default: 'completed' },
  score: { type: Number }, 
  starsEarned: { type: Number },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);