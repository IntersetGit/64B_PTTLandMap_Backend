const router = require('express').Router();
const { loginControllers, refreshTokenControllers } = require("../controllers/providerControllers");

/* GET users listing. */
router.post('/login', loginControllers);
router.get('/refreshToken', refreshTokenControllers);

module.exports = router;