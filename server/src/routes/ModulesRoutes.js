const express = require('express');
const {
    createModules,
    getModuless,
    getModulesById,
    updateModules,
    deleteModules
} = require('../controllers/modulesController');

const router = express.Router();

router.post('/', createModules);
router.get('/', getModuless);
router.get('/:id', getModulesById);
router.put('/:id', updateModules);
router.delete('/:id', deleteModules);

module.exports = router;
