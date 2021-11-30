const path = require("path");
const uuidv4 = require("uuid");
const fs = require("fs");
const result = require("../middleware/result");
const config = require("../config");

/* อัพโหลด */
exports.uploads = async (req, res, next) => {
  try {
    const fileupload = req.files;
    const { Path = "all", Length = 1, Name, SetType } = req.query;
    const projectPath = path.resolve("./");
    const uploadPath = `${projectPath}/public/uploads/${Path}/`;

    const File = [];
    for (let x = 0; x < Number(Length); x++) {
      File.push(fileupload[`file${x}`]);
    }

    //เช็ค path ว่ามีไหม ถ้าไม่มีจะสร้างขึ้นมา
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    const UploadFile = [];

    let e;
    for (let i = 0; i < File.length; i++) {
      e = File[i];

      let type = SetType
        ? `.${SetType}`
        : `.${e.name.substring(e.name.lastIndexOf(".") + 1).toLowerCase()}`;
      let name = Name ? Name + type : uuidv4.v4() + type;

      let model = {
        location: `${config.SERVICE_HOST}/uploads/${Path}/${name}`,
        path: `/uploads/${Path}/${name}`,
        nameOld: e.name,
        nameNew: name,
        type: type,
      };

      UploadFile.push(model);
      e.mv(uploadPath + name, (err) => {
        if (err) {
          const error = new Error(err);
          error.statusCode = 402;
          throw error;
        }
      });
    }

    result(res, UploadFile);
  } catch (error) {
    next(error);
  }
};

exports.uploadDefault = (req, res, next) => {
  const { id } = req.body;
  try {
    fs.readFile("./public/uploads/default/satellite.jpg", (err, data) => {
      if (err) console.log(err);
      else {
        fs.writeFile(
          `./public/uploads/satellite-aerial-photographs/${id}.jpg`,
          data,
          (err, data) => {
            result(res, data);
          }
        );
      }
    });
  } catch (error) {
    result(res, error);
  }
};

exports.uploadPointDefault = (req, res, next) => {
  try {
    const { img } = req.body;
    const id = uuidv4.v4();
    fs.readFile(`./public/uploads/default/Symbol/${img}`, (err, data) => {
      if (err) throw new Error(err);
      else {
        fs.writeFile(
          `./public/uploads/symbol_point/${id}.png`,
          data,
          (err, data) => {
            if (err) throw new Error(err);
            let model = {
              location: `${config.SERVICE_HOST}/uploads/symbol_point/${id}.png`,
              path: `/uploads/symbol_point/${id}.png`,
              nameOld: img,
              nameNew: `${id}.png`,
              type: 'png',
            };
            result(res, model);
          }
        );
      }
    });
  } catch (error) {
    next(error);
  }
};
