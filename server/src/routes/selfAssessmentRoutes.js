const express = require("express");
const {
  createSelfAssessment,
  getAllSelfAssessments,
  getSelfAssessmentById,
  updateSelfAssessment,
  deleteSelfAssessment,
  getSelfAssessmentsByOrganizationId,
  downloadCSV,
  getLatestSelfAssessmentScore,
  downloadExcel,
  getTargetScoreByOrgId,
} = require("../controllers/selfAssessmentController");

const router = express.Router();

router.post("/", createSelfAssessment);
router.get("/", getAllSelfAssessments);
router.get("/download/:id", downloadExcel);
router.get("/organization/:organizationId/targetScore", getTargetScoreByOrgId);
router.get("/organization/:organizationId", getSelfAssessmentsByOrganizationId);
router.get("/latest/:organizationId", getLatestSelfAssessmentScore);
router.get("/:id", getSelfAssessmentById);
router.put("/:id", updateSelfAssessment);
router.delete("/:id", deleteSelfAssessment);

module.exports = router;
