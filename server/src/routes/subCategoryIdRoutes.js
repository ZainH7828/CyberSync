const express = require("express");

const {
  createSubCategoryId,
  getSubCategoriesID,
  getSubCategoryIdById,
  getSubCategoryIdBySubCatId,
  updateSubCategoryId,
  deleteSubCategoryId,
  getSubCategoryIdByOrganization,
  getSubCategoryIdBySubCategoryAndOrganization,
} = require("../controllers/subCategoryIdController");

const router = express.Router();

router.post("/", createSubCategoryId);
router.get("/", getSubCategoriesID);
router.get(
  "/sub-category-organization/:subCategory/:organizationId",
  getSubCategoryIdBySubCategoryAndOrganization
);
router.get("/organization/:organizationId", getSubCategoryIdByOrganization);
router.get("/sub-category/:subCategoryId", getSubCategoryIdBySubCatId);
router.get("/:id", getSubCategoryIdById);
router.put("/:id", updateSubCategoryId);
router.delete("/:id", deleteSubCategoryId);

module.exports = router;
