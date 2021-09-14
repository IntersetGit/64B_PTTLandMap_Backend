const { createUserAD,updateRoleUser, getSysmRoleController } = require('../controllers/systemControllers');

const router = require('express').Router();

router.post('/addUserAD', createUserAD);
router.post('/updateRoleUser', updateRoleUser);

// เรียกข้อมูลสิทธ์ผู้ใช้งาน
router.get('/getUser', getSysmRoleController)

module.exports = router;