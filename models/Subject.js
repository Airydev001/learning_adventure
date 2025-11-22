const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Math", "Science"
  iconUrl: { type: String }, 
  colorHex: { type: String }, // "#FFD700"
  availableForAges: [{ type: String }] // ["3-5", "6-8"]
});

module.exports = mongoose.model('Subject', subjectSchema);