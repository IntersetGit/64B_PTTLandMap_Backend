const router = require('express').Router();
const { loginControllers, refreshTokenControllers,getUserController } = require("../controllers/providerControllers");

/* GET users listing. */
router.post('/login', loginControllers);
router.get('/refreshToken', refreshTokenControllers);
router.get('/getUser',getUserController)

module.exports = router;