const tj = require("@tmcw/togeojson");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;


exports.getKml = async () => {
    const kml2 = new DOMParser().parseFromString(fs.readFileSync("testkml.kml", "utf8"));
    const converted = tj.kml(kml2);
    return converted
}