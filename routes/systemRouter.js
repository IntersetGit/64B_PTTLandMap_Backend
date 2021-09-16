const { createUserAD,updateRoleUser, getSysmRoleController } = require('../controllers/systemControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

router.post('/addUserAD', [authenticateToken], createUserAD);
router.post('/updateRoleUser', [authenticateToken], updateRoleUser);

// เรียกข้อมูลสิทธ์ผู้ใช้งาน
router.get('/getUser',[authenticateToken], getSysmRoleController)

module.exports = router;