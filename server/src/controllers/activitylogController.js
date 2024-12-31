const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

// Get activity logs by task ID
const getActivityLogsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const activityLogs = await ActivityLog.find({ taskId: taskId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name");

    res.json(activityLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getActivityLogsByTaskId,
};
