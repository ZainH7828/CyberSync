const SubTask = require("../models/SubTask");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User"); // Assuming you have a User model

function getFirstNWords(str, n) {
  if (typeof str !== "string" || typeof n !== "number" || n <= 0) {
    throw new Error("Invalid input");
  }

  const words = str.split(/\s+/); // Split the string by whitespace
  return words.slice(0, n).join(" "); // Get the first n words and join them back into a string
}

// Create a new subTask
const createSubTask = async (req, res) => {
  const {
    name,
    taskId,
    desc,
    due_date,
    files = null,
    createdBy,
    assignees = null,
    status,
  } = req.body;

  try {
    const createdAt = new Date();
    const newSubTask = new SubTask({
      taskId,
      name,
      desc,
      due_date,
      files,
      status,
      createdBy,
      assignees,
      createdAt,
      updatedAt: createdAt,
    });

    await newSubTask.save();

    const activityLog = new ActivityLog({
      taskId: taskId,
      type: "SubTask Created",
      activity: name,
      createdBy: req.user._id,
    });

    await activityLog.save();

    const activityLogSubTask = new ActivityLog({
      taskId: newSubTask._id,
      type: "SubTask Created",
      activity: name,
      createdBy: req.user._id,
    });

    await activityLogSubTask.save();

    res.status(201).json(newSubTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all subTasks
const getSubTasks = async (req, res) => {
  try {
    const subTasks = await SubTask.find().sort({ updatedAt: -1 });
    res.json(subTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single subTask by ID
const getSubTaskById = async (req, res) => {
  try {
    const subTask = await SubTask.findById(req.params.id);
    if (!subTask) {
      return res.status(404).json({ message: "SubTask not found" });
    }
    res.json(subTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a subTask by ID
const updateSubTask = async (req, res) => {
  const {
    name = null,
    taskId = null,
    desc = null,
    due_date = null,
    files = null,
    assignees = null,
    status = null,
  } = req.body;

  try {
    const subTask = await SubTask.findById(req.params.id);
    if (!subTask) {
      return res.status(404).json({ message: "SubTask not found" });
    }

    const updatedAt = new Date();
    const changes = [];

    if (name && name !== subTask.name)
      changes.push({ type: "SubTask Name Updated", value: name });
    if (desc && desc !== subTask.desc)
      changes.push({ type: "SubTask Description Updated", value: desc });
    if (due_date && due_date !== subTask.due_date)
      changes.push({ type: "SubTask Due Date Updated", value: due_date });
    if (files && files !== subTask.files)
      changes.push({ type: "SubTask Files Updated", value: files });
    if (status && status !== subTask.status)
      changes.push({ type: "SubTask Status Updated", value: status });

    subTask.name = name || subTask.name;
    subTask.taskId = taskId || subTask.taskId;
    subTask.desc = desc || subTask.desc;
    subTask.due_date = due_date || subTask.due_date;
    subTask.files = files || subTask.files;
    subTask.assignees = assignees || subTask.assignees;
    subTask.status = status || subTask.status;
    subTask.updatedAt = updatedAt || subTask.updatedAt;

    await subTask.save();

    for (const change of changes) {
      const activityLog = new ActivityLog({
        taskId: taskId,
        type: change.type,
        activity: change.value,
        createdBy: req.user._id,
      });

      await activityLog.save();

      const activityLogSubTask = new ActivityLog({
        taskId: subTask._id,
        type: change.type,
        activity: change.value,
        createdBy: req.user._id,
      });
  
      await activityLogSubTask.save();
    }

    res.json(subTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update subtask completion status
const updateSubTaskCompleted = async (req, res) => {
  const {
    name,
    taskId,
    desc,
    due_date,
    files = null,
    createdBy,
    assignees = null,
    status,
  } = req.body;

  try {
    const subTask = await SubTask.findById(req.params.id);
    if (!subTask) {
      return res.status(404).json({ message: "SubTask not found" });
    }

    const updatedAt = new Date();
    subTask.taskId = taskId || subTask.taskId;
    subTask.name = name || subTask.name;
    subTask.desc = desc || subTask.desc;
    subTask.due_date = due_date || subTask.due_date;
    subTask.files = files || subTask.files;
    subTask.status = status || subTask.status;
    subTask.createdBy = createdBy || subTask.createdBy;
    subTask.assignees = assignees || subTask.assignees;
    subTask.updatedAt = updatedAt;

    await subTask.save();

    const activityLog = new ActivityLog({
      type: "SubTask Completed",
      activity: name,
      createdBy: req.user._id,
    });

    await activityLog.save();

    res.status(201).json(subTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a subTask by ID
const deleteSubTask = async (req, res) => {
  try {
    const subTask = await SubTask.findById(req.params.id);
    if (!subTask) {
      return res.status(404).json({ message: "SubTask not found" });
    }

    await SubTask.deleteOne({ _id: req.params.id });

    const activityLog = new ActivityLog({
      taskId: subTask.taskId,
      type: "SubTask Deleted",
      activity: subTask.name,
      createdBy: req.user._id,
    });

    await activityLog.save();

    res.json({ message: "SubTask removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadFile = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { type } = req.body; 
    
    if (!req.file) {
      return res.status(400).send({success:false, message:'No file selected'});
    }
    
    const subTask = await SubTask.findById(taskId);
    if (!subTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const fileName = req.file.filename;
    const uploadObject = type === 'deliver' ? subTask.deliverables : subTask.files;
    
    if(uploadObject) {
      uploadObject.push({name: fileName, path: req.file.path, destination:'assets/uploads/subTask'});
    } else {
      if (type === 'deliver') {
        subTask.deliverables = [{name: fileName, path: req.file.path, destination:'assets/uploads/subTask'}];
      } else {
        subTask.files = [{name: fileName, path: req.file.path, destination:'assets/uploads/subTask'}];
      }
    }
    subTask.updatedAt = new Date();

    await subTask.save();

    res.status(200).json(subTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { fileName, type } = req.body;

    const subTask = await SubTask.findById(taskId);
    if (!subTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const uploadObject = type === 'deliver' ? subTask.deliverables : subTask.files;
    const removedData = uploadObject.filter(
      (obj) => obj.name !== fileName
    );

    if(type === 'deliver') {
      subTask.deliverables = removedData;
    } else {
      subTask.files = removedData;
    }
    subTask.updatedAt = new Date();
    await subTask.save();

    /*const filePath = path.join(__dirname, "../../assets/uploads/tasks", fileName);
    fs.unlink(filePath, (err) => {
      if (err) console.error(err);
    });*/

    res.status(200).json(subTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSubTask,
  getSubTasks,
  getSubTaskById,
  updateSubTask,
  updateSubTaskCompleted,
  deleteSubTask,
  uploadFile,
  deleteFile
};
