const express = require("express");

const {
    downloadReportExcel,
    infoReport,
    categoryReport,
    frameworkReport,
    summaryReport
  } = require("../controllers/reportController");


const router = express.Router();

router.post("/download/:organizationId", downloadReportExcel);
router.get("/info/:organizationId", infoReport);

router.post("/category/:organizationId", categoryReport);
router.post("/framework/:organizationId", frameworkReport);

router.get("/summary/:organizationId", summaryReport);

module.exports = router;