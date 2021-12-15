const { createUserAD,updateRoleUser, getSysmRoleController, findUserAd, delUserAd, updateConfigAd, editUser } = require('../controllers/systemControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

/* เพิ่มผู้ใช้งานใน ad */
router.post('/addUserAD', [authenticateToken], createUserAD);
/* แก้ไขสิทธิ์ ผู้ใช้งาน */
router.put('/updateRoleUser', [authenticateToken], updateRoleUser);
/* ค้นหาผู้ใชช้ ad */
router.get('/findUserAD', [authenticateToken], findUserAd);
/* ลบผู้ใช้งาน */
router.post('/delUserAD/:id', [authenticateToken], delUserAd);
/* อัพข้อมูลการตั้งค่า ad */ 
router.post('updateConfig', [authenticateToken], updateConfigAd);

// เรียกข้อมูลสิทธ์ผู้ใช้งาน
router.get('/getUser',[authenticateToken], getSysmRoleController);
/* */
router.put('/editUser', [authenticateToken], editUser);

module.exports = router;