const router = require('express').Router();
const { demoLdap } = require('../controllers/demoControllers');


router.post('/demoLdap', demoLdap);

module.exports = router;
