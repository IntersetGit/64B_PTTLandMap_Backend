const router = require('express').Router();
const masterControllers = require('../controllers/masterControllers');
const { authenticateToken } = require('../middleware/authenticateToken')

//----------เรียกข้อมูล คำนำหน้าชื่อ --------------//
router.get('/getNameTitle', masterControllers.getNameTitle);
router.get('/viewGetNameTitle', masterControllers.viewGetNameTitle);
//-------------------------------------------//

//-----เพิ่่ม ลบ แก้ไข mas_layers_group (หัวข้อหลัก)-------/
router.post('/masLayers', [authenticateToken], masterControllers.createMasLayers);
router.put('/masLayers', [authenticateToken], masterControllers.updateMasLayers);
router.delete('/masLayers', [authenticateToken], masterControllers.deleteMasLayers);
//---------------------------------------------------------//

//----เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-------//
router.post('/datLayers', [authenticateToken], masterControllers.createDataLayers);
router.put('/datLayers', [authenticateToken], masterControllers.updateDataLayers);
router.delete('/datLayers', [authenticateToken], masterControllers.deleteDataLayers);
//-------------------------------------------//


module.exports = router;
