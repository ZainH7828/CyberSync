const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  inviteUserIntoOrganization,
  fetchUserByOrganization,
  addCategoriesToUsers,
  fetchUserByOrganizationAndSubCategory,
  removeCategoriesFromUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/invite", inviteUserIntoOrganization);
router.post("/organization/:id", fetchUserByOrganization);
router.post(
  "/organization-subcategory/:organizationId/:subCategoryId",
  fetchUserByOrganizationAndSubCategory
);
router.post("/assign-category", addCategoriesToUsers);
router.post("/remove-category", removeCategoriesFromUsers);

module.exports = router;
