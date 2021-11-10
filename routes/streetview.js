const router = require('express').Router();
const { authenticate } = require('passport');
const streetviewControllers = require('../controllers/streetviewControllers');
const { authenticateToken } = require('../middleware/authenticateToken');

//---------------- แสดง เพิ่ม ลบ แก้ไข dat street view ------------------//
router.get('/getAllDatStreetView', [authenticateToken], streetviewControllers.getAllDatStreetView);
router.post('/createAndEditDatStreetView', [authenticateToken], streetviewControllers.createDatStreetView);
router.delete('/deleteDatStreetView', [authenticateToken], streetviewControllers.deleteDatStreetView);

module.exports = router;