const router = require("express").Router()

router.use('/',require('./routes/index'));
router.use('/provider', require('./routes/provider'));
router.use('/upload',require('./routes/upload'));
router.use('/masterdata', require('./routes/master'));
router.use('/demo', require('./routes/demo'));

module.exports = router;