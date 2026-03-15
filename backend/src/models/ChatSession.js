const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'bot', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  messages: [ChatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatSessionSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

ChatSessionSchema.pre('updateOne', async function() {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);