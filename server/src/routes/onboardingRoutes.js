const express = require("express");
const {
  updateOrganizationCompleted,
} = require("../controllers/organizationController");

const router = express.Router();

router.put("/:id", updateOrganizationCompleted);

module.exports = router;
