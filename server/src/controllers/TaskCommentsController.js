const TaskComments = require("../models/TaskComments");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

// Create a new task comment
const createTaskComment = async (req, res) => {
  const { taskID, comment, createdBy } = req.body;

  try {
    const createdAt = new Date();
    const newTaskComment = new TaskComments({
      taskID,
      comment,
      createdBy,
      createdAt,
      updatedAt: createdAt,
    });

    const activityLog = new ActivityLog({
      taskId: taskID,
      type: "Added Comment",
      activity: comment,
      createdBy: createdBy,
    });

    await activityLog.save();

    await newTaskComment.save();

    res.status(201).json(newTaskComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTaskCommentsById = async (req, res) => {
  try {
    const taskComments = await TaskComments.find({ taskID: req.params.id }).populate('createdBy', 'name');

    if (!taskComments || taskComments.length === 0) {
      return res.status(200).json({ message: "Task Comments not found" });
    }

    res.json(taskComments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTaskComment,
  getTaskCommentsById,
};
