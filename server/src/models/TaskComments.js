const mongoose = require("mongoose");

const { Schema } = mongoose;

const TaskCommentsSchema = new mongoose.Schema({
  taskID: {
    type: Schema.Types.ObjectId, ref: 'Task'
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: false
  },
});

module.exports = mongoose.model("TaskComments", TaskCommentsSchema);
