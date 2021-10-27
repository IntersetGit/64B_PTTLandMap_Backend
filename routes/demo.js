const router = require("express").Router();
const { demoLdap, demoShap, gatKmlTest } = require("../controllers/demoControllers");
const { authenticateToken } = require("../middleware/authenticateToken");
const shapefile = require("shapefile");
const { convert } = require("geojson2shp");
const shp = require('shpjs');
const result = require("../middleware/result");

router.post("/demoLdap", [authenticateToken], demoLdap);

router.get("/demoGoJson", (req, res) => {
  shapefile
    .open("public/testShapfile/shape/landuse")
    .then((source) =>
      source.read().then(function log(result) {
        if (result.done) return;
        console.log(result.value);
        res.json({ shp: result.value });
      })
    )
    .catch((error) => console.error(error.stack));
});





router.get("/demoShape", async (req, res) => {
  const options = {
    layer: "my-layer",
    targetCrs: 2154,
  };
  const features = [
    req.body
  ];
  res.json(await convert(features, "public/testShapfile/shape/gojson2shape.zip", options))

});

router.post('/resTrue', async (req, res) => {

  const { file } = req.files
  // const mimetype = `.${file.name.substring(12)}` == '.zip' ? true : false
  // const mimetype_ = `.${file.name.substring(32, 29)}` == '.kml' ? true : false

  const type = `${file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase().toLowerCase()}`;
  const _check = ['zip', 'kml', 'kmz']
  if (_check.find(e => e == type)) {
    let _type
    switch (type) {
      case "zip":
        _type = "shape file"
        break;
      case "zip":
        _type = "shape file"
        break;

      default:
        break;
    }
    result(res, {
      type: _type
    }, 200);
  } else {
    const err = new Error(`เลือกไฟล์ให้ถูกต้อง ${_check.toString()}`)
    err.statusCode = 400
    throw err
  }

})


module.exports = router;
