const router = require('express').Router();
const { loginControllers, refreshTokenControllers,getUserController,getSearchUserController, loginAD} = require("../controllers/providerControllers");

/* GET users listing. */
router.post('/login', loginControllers);
router.post('/loginAD', loginAD);
router.get('/refreshToken', refreshTokenControllers);
router.post('/getSearchUser',getSearchUserController)

module.exports = router;
