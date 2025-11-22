const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const parentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // The PIN is stored here
  pin: { type: String, required: true }, 
  kids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Kid' }]
}, { timestamps: true });

// --- THE LOGIC TO CREATE/ENCRYPT PIN ---
parentSchema.pre('save', async function(next) {
  // 1. Hash Password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  // 2. Hash PIN if modified (THIS IS THE MISSING LOGIC YOU ASKED FOR)
  if (this.isModified('pin')) {
    // "1234" becomes "$2a$10$X7..."
    this.pin = await bcrypt.hash(this.pin, 10); 
  }
  next();
});

// Helper to check PIN
parentSchema.methods.matchPin = async function(enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

parentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Parent', parentSchema);