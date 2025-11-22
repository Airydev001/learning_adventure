const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  title: { type: String, required: true }, // "Counting 1-10"
  ageGroup: { type: String, required: true }, // "3-5"
  // The Lesson holds the array of Questions
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  rewardStars: { type: Number, default: 5 }
});

module.exports = mongoose.model('Lesson', lessonSchema);