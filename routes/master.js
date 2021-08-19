const router = require('express').Router();
const masterControllers = require('../controllers/masterControllers');

/** เรียกข้อมูล คำนำหน้าชื่อ */
router.get('/getNameTitle',masterControllers.getNameTitle);

router.get('/viewGetNameTitle',masterControllers.viewGetNameTitle);




module.exports = router;
