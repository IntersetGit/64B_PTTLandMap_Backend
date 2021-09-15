const { shapeAdd, getAllShape, getAllDataLayer, convertGeoToShp, demoCreateDatabase, getShapeData } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

router.post('/database', demoCreateDatabase)

/* เพิ่ม shp */
router.post('/add', [authenticateToken], shapeAdd);
/* เรียกชั้นข้อมูล */
router.get('/getDataLayer', [authenticateToken], getAllDataLayer);
/* เรียกข้อมูลเป็น geo json */
router.get('/shapeData', [authenticateToken], getShapeData);
/* แปลง geo เป็น shp */
router.post('/convertGeoToShp', [authenticateToken], convertGeoToShp);

module.exports = router;