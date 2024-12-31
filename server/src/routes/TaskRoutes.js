const express = require("express");
const configureMulter = require('../services/upload.js');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  uploadFile,
  deleteFile,
  retrieveFile
} = require("../controllers/TaskController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const upload = configureMulter('tasks', 'taskFile');

router.post("/", authMiddleware, createTask);
router.get("/", getTasks);
router.get("/download/:fileName", retrieveFile);
router.get("/:id", getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.post("/:taskId/upload/",upload.single('taskFile'), uploadFile);
router.post("/:taskId/delete/", deleteFile);

module.exports = router;
