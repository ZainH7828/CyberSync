const express = require('express');
const {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    getSubCategoriesByOrgId,
    addSubCategoriesToOrg,
    deleteSubCategoryFromOrg,
    getCategoriesByOrgId,
    addSubCategoryIdToOrg,
    getSubCategoryIDByOrgId
} = require('../controllers/organizationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createOrganization);
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

router.get('/:orgId/categories', getCategoriesByOrgId);
router.get('/:orgId/subcategories', getSubCategoriesByOrgId);
router.post('/:orgId/subcategories', authMiddleware, addSubCategoriesToOrg);
router.delete('/:orgId/subcategories/:subCategoryId', authMiddleware, deleteSubCategoryFromOrg);

// Sub category ID 
router.get('/:orgId/subcategoriesId', getSubCategoryIDByOrgId);
router.post('/:orgId/subcategoriesId', authMiddleware, addSubCategoryIdToOrg);

module.exports = router;
