const router = require('express').Router();
const masterControllers = require('../controllers/masterControllers');

//----------เรียกข้อมูล คำนำหน้าชื่อ --------------//
router.get('/getNameTitle',masterControllers.getNameTitle);
router.get('/viewGetNameTitle',masterControllers.viewGetNameTitle);
//-------------------------------------------//

//----เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-------//
router.post('/datLayers',masterControllers.createDataLayers);
router.put('/datLayers',masterControllers.updateDataLayers);
router.delete('/datLayers',masterControllers.deleteDataLayers);
//-------------------------------------------//


module.exports = router;
