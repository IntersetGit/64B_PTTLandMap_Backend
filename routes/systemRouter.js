const { createUserAD } = require('../controllers/systemControllers');

const router = require('express').Router();

router.post('/addUserAD', createUserAD)

module.exports = router;