const router = require("express").Router()

router.use('/',require('./routes/index'));
router.use('/demo', require('./routes/demo'));
router.use('/upload',require('./routes/upload'));
router.use('/provider', require('./routes/provider'));
router.use('/masterdata', require('./routes/master'));
router.use('/shp', require('./routes/shpRouter'));

router.use('/system', require('./routes/systemRouter'));
router.use('/streetview', require('./routes/streetview'));

module.exports = router;