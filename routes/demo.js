const router = require('express').Router();
const { demoLdap } = require('../controllers/demoControllers');
const { authenticateToken } = require('../middleware/authenticateToken');
const  shapefile =require("shapefile")

router.post('/demoLdap', [authenticateToken], demoLdap);
router.get('/demoGoJson',(req,res,)=>{
    shapefile.open("public/testShapfile/shape/buildings.shp")
    .then(source => source.read()
      .then(function log(result) {
        if (result.done) return;
        console.log(result.value);
        res.json({shp:result.value})
      }))
    .catch(error => console.error(error.stack));
})
module.exports = router;
