const { createUserAD,updateRoleUser } = require('../controllers/systemControllers');

const router = require('express').Router();

router.post('/addUserAD', createUserAD);
router.post('/updateRoleUser', updateRoleUser);

module.exports = router;