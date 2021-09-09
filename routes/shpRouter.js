const { shapeAdd, getAllDataLayer } = require('../controllers/shpControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = require('express').Router();

/* เพิ่ม shp  */
router.post('/add', [authenticateToken], shapeAdd);
/* เรียกข้อมูล shp */
router.get('/getDataLayer', [authenticateToken], getAllDataLayer);

module.exports = router;