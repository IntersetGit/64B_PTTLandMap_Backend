const express = require('express');
const router = express.Router();
const providerControllers = require("../controllers/providerControllers");

/* GET users listing. */
router.post('/login', providerControllers.login);

module.exports = router;
