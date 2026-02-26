const mongoose = require('mongoose');

const HelpQuerySchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true
  },
  body: {
    type: String,
    required: [true, 'Please provide a message body'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HelpQuery', HelpQuerySchema);
