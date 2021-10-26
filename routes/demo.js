const router = require("express").Router();
const { demoLdap, demoShap , gatKmlTest } = require("../controllers/demoControllers");
const { authenticateToken } = require("../middleware/authenticateToken");
const shapefile = require("shapefile");
const { convert } = require("geojson2shp");
const shp = require('shpjs');

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
  const mimetype = `.${file.mimetype.substring(12)}` == '.zip' ? true : false
  const mimetype_ = `.${file.mimetype.substring(32, 29)}` == '.kml' ? true : false
  var typeGeo

  if (mimetype) {
    const geojson = await shp(file.data); // แปลงไฟล์ shape
    geojson.features.forEach(e => {
      typeGeo = e.geometry.type
    });
  } else if (mimetype_) {

  } else {
    
  }

  
  
  res.json({
    item: {
      file_type: typeGeo
    }
  }).status(200)

})


module.exports = router;
