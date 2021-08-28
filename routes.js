const router = require("express").Router()

router.use('/',require('./routes/index'));
router.use('/demo', require('./routes/demo'));
router.use('/upload',require('./routes/upload'));
router.use('/provider', require('./routes/provider'));
router.use('/masterdata', require('./routes/master'));

module.exports = router;