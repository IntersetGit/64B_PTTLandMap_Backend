const { shapeKmlKmzAdd, getAllDataLayer, convertGeoToShp, getShapeData, getInfoProject, getShapeProvinceMap } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

/* เพิ่ม shp */
router.post('/add', [authenticateToken], shapeKmlKmzAdd);
/* เรียกชั้นข้อมูล */
router.get('/getDataLayer', [authenticateToken], getAllDataLayer);
/* เรียกข้อมูลเป็น geo json */
router.get('/shapeData', [authenticateToken], getShapeData);
/* แปลง geo เป็น shp */
router.post('/convertGeoToShp', [authenticateToken], convertGeoToShp);

/* ค้นหาข้อมูลหน้า และเรียกข้อมูล map  */
router.get('/getSearchData', [authenticateToken], getInfoProject)
/* ค้นหาจังหวัง อำเภอ ตำบล map */
router.get('/getShapeProvince', [authenticateToken], getShapeProvinceMap)

module.exports = router;