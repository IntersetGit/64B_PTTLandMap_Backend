const router = require('express').Router();
const uploadControllers = require("../controllers/uploadControllers");
// const passportJWT = require("../middleware/passportJWT");

/* uploads */
// router.post('/', [passportJWT.isLogin], uploadControllers.uploads);
router.post('/', uploadControllers.uploads);
router.post('/defaultSatellite',uploadControllers.uploadDefault)
router.post("/uploadPointDefault",uploadControllers.uploadPointDefault)
module.exports = router;