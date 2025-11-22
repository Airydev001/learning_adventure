const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  // Used for organization, but technically Lesson holds the relationship
  type: { type: String, enum: ['quiz', 'puzzle'], default: 'quiz' },
  questionText: { type: String, required: true },
  mediaUrl: { type: String }, // Cloudinary URL for Planet/Book images
  options: [{ type: String }], // ["1", "2", "3"]
  correctAnswer: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);