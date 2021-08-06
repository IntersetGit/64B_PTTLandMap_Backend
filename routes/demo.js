const router = require('express').Router();
const { demoLdap } = require('../controllers/demoControllers');
const { authenticateToken } = require('../middleware/authenticateToken');


router.post('/demoLdap', [authenticateToken], demoLdap);

module.exports = router;
