const { shapeAdd,getAllShape } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

router.post('/add', [authenticateToken], shapeAdd)
router.get('/get',[authenticateToken],getAllShape)

module.exports = router;