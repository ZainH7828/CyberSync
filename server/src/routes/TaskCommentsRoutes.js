const express = require('express');
const {
    createTaskComment,
    getTaskCommentsById,
} = require('../controllers/TaskCommentsController');

const router = express.Router();

router.post('/', createTaskComment);
router.get('/:id', getTaskCommentsById);

module.exports = router;
