const SubTask = require("../models/SubTask");
const Task = require("../models/Task");
const User = require("../models/User"); // Assuming you have a User model
const ActivityLog = require("../models/ActivityLog");
const path = require("path");
const fs = require("fs");

// Create a new task
const createTask = async (req, res) => {
  const {
    name,
    subCategory,
    desc,
    due_date,
    files = null,
    createdBy,
    assignees = null,
    status,
    subCategoriesId = null,
    priority = 1
  } = req.body;

  try {
    const createdAt = new Date();
    const newTask = new Task({
      subCategory,
      subCategoriesId,
      name,
      desc,
      due_date,
      files,
      organization: req.user.organization,
      status,
      createdBy,
      assignees,
      priority,
      createdAt,
      updatedAt: createdAt,
    });

    await newTask.save();

    const activityLog = new ActivityLog({
      taskId: newTask.id,
      type: "Task Created",
      activity: name,
      createdBy: req.user._id,
    });

    await activityLog.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const subTask = await SubTask.find({ taskId: req.params.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const TasksData = {
      task,
      subTask,
    };
    res.json(TasksData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an task by ID
const updateTask = async (req, res) => {
  const {
    name = null,
    subCategory = null,
    subCategoriesId = null,
    desc = null,
    due_date = null,
    files = null,
    createdBy = null,
    assignees = null,
    priority = 1,
    status = null,
  } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedAt = new Date();
    const changes = [];

    if (name && name !== task.name)
      changes.push({ type: "Name Updated", value: name });
    if (desc && desc !== task.desc)
      changes.push({ type: "Description Updated", value: desc });
    if (due_date && due_date !== task.due_date)
      changes.push({ type: "Due Date Updated", value: due_date });
    if (files && files !== task.files)
      changes.push({ type: "Files Updated", value: files });
    // if (assignees && assignees.toString() !== task.assignees.toString()) {
    //   changes.push({
    //     type: "Task Assigned",
    //     value: assignees.length ? assignees.map((id) => `to ${id}`) : 'Unassigned Users'
    //   });
    // }
    if (status && status !== task.status)
      changes.push({ type: "Status Updated", value: status });

    task.name = name || task.name;
    task.subCategory = subCategory || task.subCategory;
    task.subCategoriesId = subCategoriesId || task.subCategoriesId;
    task.desc = desc || task.desc;
    task.due_date = due_date || task.due_date;
    task.files = files || task.files;
    task.assignees = assignees !== null ? assignees : task.assignees;
    task.status = status || task.status;
    task.priority = priority || task.priority
    task.updatedAt = updatedAt;

    await task.save();

    for (const change of changes) {
      const activityLog = new ActivityLog({
        taskId: req.params.id,
        type: change.type,
        activity: change.value,
        createdBy: req.user._id,
      });

      await activityLog.save();
    }

    res.json(task);
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
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const fileName = req.file.filename;
    const uploadObject = type === 'deliver' ? task.deliverables : task.files;
    
    if(uploadObject) {
      uploadObject.push({name: fileName, path: req.file.path, destination:'assets/uploads/task'});
    } else {
      if (type === 'deliver') {
        task.deliverables = [{name: fileName, path: req.file.path, destination:'assets/uploads/subTask'}];
      } else {
        task.files = [{name: fileName, path: req.file.path, destination:'assets/uploads/subTask'}];
      }
    }
    task.updatedAt = new Date();

    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { fileName, type } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const uploadObject = type === 'deliver' ? task.deliverables : task.files;
    const removedData = uploadObject.filter(
      (obj) => obj.name !== fileName
    );

    if(type === 'deliver') {
      task.deliverables = removedData;
    } else {
      task.files = removedData;
    }
    task.updatedAt = new Date();
    await task.save();

    /*const filePath = path.join(__dirname, "../../assets/uploads/tasks", fileName);
    fs.unlink(filePath, (err) => {
      if (err) console.error(err);
    });*/

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const retrieveFile = async (req, res) => {
  try {
    const filename = req.params.fileName;
    const fileDirectory = path.join(__dirname, '../../assets/uploads/tasks');

    const filePath = path.join(fileDirectory, filename);

    console.log(filePath);
    // Use res.download to send the file to the client
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error downloading the file',
          error: err
        });
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTaskCompleted = async (req, res) => {
  const {
    name,
    subCategory,
    subCategoriesId,
    desc,
    due_date,
    files = null,
    createdBy,
    assignees = null,
    priority = 1,
    status,
  } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedAt = new Date();
    task.subCategory = subCategory || task.subCategory;
    task.subCategoriesId = subCategoriesId || task.subCategoriesId;
    task.name = name || task.name;
    task.desc = desc || task.desc;
    task.due_date = due_date || task.due_date;
    task.files = files || task.files;
    task.status = status || task.status;
    task.createdBy = createdBy || task.createdBy;
    task.assignees = assignees || task.assignees;
    task.priority = priority || task.priority;
    task.createdAt = task.createdAt;
    (task.updatedAt = updatedAt), await task.save();

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.setupCompleted = true;
    task.name = task.name;
    task.email = task.email;
    task.status = task.status;
    task.createdAt = task.createdAt;
    task.updatedAt = task.updatedAt;
    task.priority = task.priority;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an task by ID
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  uploadFile,
  deleteFile,
  updateTaskCompleted,
  deleteTask,
  retrieveFile
};
