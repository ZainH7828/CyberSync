const express = require("express");
const configureMulter = require('../services/upload.js');
const {
  createSubTask,
  getSubTasks,
  getSubTaskById,
  updateSubTask,
  deleteSubTask,
  uploadFile,
  deleteFile,
} = require("../controllers/SubTaskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = configureMulter('tasks', 'taskFile');

router.post("/", authMiddleware, createSubTask);
router.get("/", getSubTasks);
router.get("/:id", getSubTaskById);
router.put("/:id", authMiddleware, updateSubTask);
router.delete("/:id", deleteSubTask);
router.post("/:taskId/upload/", upload.single('taskFile'), uploadFile);
router.post("/:taskId/delete/", deleteFile);

module.exports = router;
