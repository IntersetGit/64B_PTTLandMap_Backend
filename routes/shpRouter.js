const { shapeKmlKmzAdd, getAllDataLayer, convertGeoToShp, getShapeData, getInfoProject, getShapeProvinceMap, 
     getByidShapeMap,editShapeMap, getFromProjectDashboard,  } = require('../controllers/shpControllers');
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
router.get('/getSearchData', [authenticateToken], getInfoProject);
/* เรียกจังหวัง อำเภอ ตำบล map */
router.get('/getShapeProvince', [authenticateToken], getShapeProvinceMap);
/* แก้ไขไฟล์ shape */
router.post('/editShapeData',[authenticateToken],editShapeMap);

router.get('/getByIdShape', [authenticateToken], getByidShapeMap);





/** ส่งมอบสิทธื์โครงการ 
 * เรียกข้อมูลสิทธิ์
 * Dashboard
**/
router.get('/getFromProjectMap', [authenticateToken], getFromProjectDashboard);

module.exports = router;