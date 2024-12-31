const express = require("express");
const router = express.Router();
const {
  getActivityLogsByTaskId,
} = require("../controllers/activitylogController");

router.get("/:taskId", getActivityLogsByTaskId);

module.exports = router;
