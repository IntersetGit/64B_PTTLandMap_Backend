const { shapeAdd, getAllShape, getAllDataLayer, convertGeoToShp, getShapeData, getKmlData, getKmzData } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

/* เพิ่ม shp */
router.post('/add', [authenticateToken], shapeAdd);
/* เรียกชั้นข้อมูล */
router.get('/getDataLayer', [authenticateToken], getAllDataLayer);
/* เรียกข้อมูลเป็น geo json */
router.get('/shapeData', [authenticateToken], getShapeData);
/* แปลง geo เป็น shp */
router.post('/convertGeoToShp', [authenticateToken], convertGeoToShp);

router.post('/getKmlData', getKmlData);

router.post('/getKmzData', getKmzData)

module.exports = router;