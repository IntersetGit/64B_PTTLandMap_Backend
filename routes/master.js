const express = require('express');
const router = express.Router();
const masterControllers = require('../controllers/masterControllers');


router.get('/getnametitle',masterControllers.testt);


module.exports = router;
