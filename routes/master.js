const router = require('express').Router();
const masterControllers = require('../controllers/masterControllers');


router.get('/getnametitle',masterControllers.testt);


module.exports = router;
