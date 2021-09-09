const { shapeAdd } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

router.post('/add', [authenticateToken], shapeAdd)

module.exports = router;