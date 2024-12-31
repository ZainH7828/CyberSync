const express = require("express");
const {
  createSubCategory,
  createMultipleSubCategories,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");

const router = express.Router();

router.post("/", createSubCategory);
router.post("/multiple", createMultipleSubCategories);
router.get("/", getSubCategories);
router.get("/:id", getSubCategoryById);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;
