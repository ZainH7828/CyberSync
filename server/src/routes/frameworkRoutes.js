const express = require('express');
const {
    createFramework,
    getFrameworks,
    getFrameworkById,
    updateFramework,
    deleteFramework
} = require('../controllers/frameworkController');

const router = express.Router();

router.post('/', createFramework);
router.get('/', getFrameworks);
router.get('/:id', getFrameworkById);
router.put('/:id', updateFramework);
router.delete('/:id', deleteFramework);

module.exports = router;
