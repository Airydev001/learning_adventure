const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
  kid: { type: mongoose.Schema.Types.ObjectId, ref: 'Kid' },
  title: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notifSchema);