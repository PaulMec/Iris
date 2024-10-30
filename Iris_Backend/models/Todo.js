const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pendiente', 'completada'],
    default: 'pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema);
