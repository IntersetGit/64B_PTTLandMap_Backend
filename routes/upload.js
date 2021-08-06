const router = require('express').Router();
const uploadControllers = require("../controllers/uploadControllers");
// const passportJWT = require("../middleware/passportJWT");

/* uploads */
// router.post('/', [passportJWT.isLogin], uploadControllers.uploads);
router.post('/', uploadControllers.uploads);


module.exports = router;