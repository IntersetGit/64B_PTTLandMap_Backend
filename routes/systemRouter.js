const { createUserAD,getUserController } = require('../controllers/systemControllers');

const router = require('express').Router();

router.post('/addUserAD', createUserAD)
router.get('/getUser', getUserController)

module.exports = router;