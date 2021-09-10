const { shapeAdd, getAllShape, getAllDataLayer, convertGeoToShp } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

/* เพิ่ม shp */
router.post('/add', [authenticateToken], shapeAdd);
/* เรียกชั้นข้อมูล */
router.get('/getDataLayer', [authenticateToken], getAllDataLayer);
/* แปลง geo เป็น shp */
router.post('/convertGeoToShp', [authenticateToken], convertGeoToShp);

router.get('/get', [authenticateToken], getAllShape);

module.exports = router;