const router = require("express").Router();
const { demoLdap, demoShap , gatKmlTest } = require("../controllers/demoControllers");
const { authenticateToken } = require("../middleware/authenticateToken");
const shapefile = require("shapefile");
const { convert } = require("geojson2shp");
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


router.get("/getKmlTest",gatKmlTest)


module.exports = router;
