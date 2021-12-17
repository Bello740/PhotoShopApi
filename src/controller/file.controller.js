const uploadFile = require("../middleware/upload");
const fs = require("fs");
var Jimp = require("jimp");

const baseUrl = "http://localhost:8080/files/";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    // console.log(req.file);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFile = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  const frameUrl = __basedir + "/resources/static/assets/frame.png";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    let file = files[files.length - 1];
    fileInfos.push({
      name: file,
      url: baseUrl + file,
    });

    console.log(fileInfos[0].name);

    let url = `${directoryPath}${fileInfos[0].name}`;

    Jimp.read(url, (err, img) => {
      if (err) {
        console.log("first err", err);
        throw err;
      }
      Jimp.read(frameUrl, (err, frameImg) => {
        if (err) {
          console.log("second err", err);
          throw err;
        }
        if (req.query.action == "composite") {
          img.composite(frameImg.resize(img.getWidth(), img.getHeight()), 0, 0);
        } else if (
          req.query.action == "rotate" &&
          req.query.direction == "right"
        ) {
          img.rotate(-90);
        } else if (
          req.query.action == "rotate" &&
          req.query.direction == "left"
        ) {
          img.rotate(90);
        }
        img.write(url); // save
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFile,
  download,
};
