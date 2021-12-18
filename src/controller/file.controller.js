const uploadFile = require("../middleware/upload");
const fs = require("fs");
var Jimp = require("jimp");

const baseUrl = "http://192.168.100.10:8080/file/";

const upload = async (req, res) => {
  try {
    const data = await uploadFile(req, res);

    console.log(req.file);
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

    var fileInfos;
    files.filter((file) => {
      console.log(file);
      if (
        !file &&
        !req.query.filename &&
        file != req.query.filename &&
        (req.query.action != "composite") | "rotate"
      ) {
        //handle error
      } else {
        fileInfos = {
          name: file,
          uri: baseUrl + file,
        };
      }
    });

    let url = `${directoryPath}${fileInfos.name}`;

    let data = Jimp.read(url)
      .then((img1) => {
        Jimp.read(frameUrl)
          .then((img2) => {
            if (req.query.action == "composite") {
              img1
                .resize(img2.getWidth() - 10, img2.getHeight() - 10)
                .composite(img2, -5, -5);
            } else if (
              req.query.action == "rotate" &&
              req.query.direction == "right"
            ) {
              img1.rotate(-90);
            } else if (
              req.query.action == "rotate" &&
              req.query.direction == "left"
            ) {
              img1.rotate(90);
            }
            img1.write(url);
            res.status(200).send(fileInfos);
          })
          .catch((err) => {
            console.log("first err", err);
            throw err;
          });
      })
      .catch((err) => {
        console.log("first err", err);
        throw err;
      });

    // Jimp.read(frameUrl, (err, frameImg) => {
    //   if (err) {
    //     console.log("second err", err);
    //     throw err;
    //   }
    //   if (req.query.action == "composite") {
    //     img
    //       .resize(frameImg.getWidth() - 10, frameImg.getHeight() - 10)
    //       .composite(frameImg, -5, -5);
    //   } else if (
    //     req.query.action == "rotate" &&
    //     req.query.direction == "right"
    //   ) {
    //     img.rotate(-90);
    //   } else if (
    //     req.query.action == "rotate" &&
    //     req.query.direction == "left"
    //   ) {
    //     img.rotate(90);
    //   }
    //   img.write(url); // save
    // });
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
