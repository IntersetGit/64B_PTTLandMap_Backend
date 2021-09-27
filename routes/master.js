const router = require('express').Router();
const masterControllers = require('../controllers/masterControllers');
const { authenticateToken } = require('../middleware/authenticateToken')

//--------------เรียกข้อมูล คำนำหน้าชื่อ -----------------//
router.get('/getNameTitle', masterControllers.getNameTitle);
router.get('/viewGetNameTitle', masterControllers.viewGetNameTitle);
//--------------------------------------------------//

//------------- แสดง จังหวด อำเภอ ตำบล ---------------//
router.get('/masProvince',masterControllers.getProvince)
router.get('/masdistrict',masterControllers.getDistrict)
router.get('/masSubDistrict',masterControllers.getSubDistrict)
//--------------------------------------------------//

//-----เพิ่่ม ลบ แก้ไข mas_layers_group (หัวข้อหลัก)-------//
router.post('/getMasLayers',[authenticateToken],masterControllers.getMasLayersName)
router.post('/masLayers', [authenticateToken], masterControllers.createMasLayers);
router.put('/masLayers', [authenticateToken], masterControllers.updateMasLayers);
router.delete('/masLayers', [authenticateToken], masterControllers.deleteMasLayers);
//--------------------------------------------------//

//-------เพิ่่ม ลบ แก้ไข dat_layers (หัวข้อย่อย)-----------//
router.get('/datLayersname',[authenticateToken],masterControllers.getDataLayersName)
router.get('/datLayers',[authenticateToken],masterControllers.getDataLayers)
router.post('/datLayers', [authenticateToken], masterControllers.createDataLayers);
router.put('/datLayers', [authenticateToken], masterControllers.updateDataLayers);
router.delete('/datLayers', [authenticateToken], masterControllers.deleteDataLayers);
//--------------------------------------------------//

//---------- ดึงข้อมูล systems Roles หน้าเพิ่มผู้ใช้ระบบ ----------------------//
router.get('/getSysmRole', masterControllers.getSysmRoleController);

//------------ GIS Layer แสดง เพิ่ม ลบ แก้ไข Layer mas_layer_shape------------//
router.get('/masLayersShape', [authenticateToken], masterControllers.getAllMasLayersShape);
router.post('/masLayersShape', [authenticateToken], masterControllers.createAndEditMasLayersShape);
router.delete('/masLayersShape', [authenticateToken], masterControllers.deleteMasLayersShape);

module.exports = router;
