const { shapeKmlKmzAdd, getAllShape, getAllDataLayer, convertGeoToShp, getShapeData, getKmlData, getKmzData, GetInfoProject } = require('../controllers/shpControllers');
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

<<<<<<< HEAD
router.post('/getKmzData', getKmzData)


/* ค้นหาข้อมูลหน้า map */
router.get('/getSearchData', GetInfoProject)

=======
>>>>>>> 25e48edaef7a31da0703c07c209bd7912f7ac844
module.exports = router;