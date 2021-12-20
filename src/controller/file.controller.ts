import { RequestHandler } from "express";
import { uploadFileMiddleware } from "../middleware/upload";
const fs = require("fs");
var Jimp = require("jimp");

const baseUrl = "http://192.168.100.10:8080/file/";

export const upload: RequestHandler = async (req, res) => {
  try {
    const data = await uploadFileMiddleware(req, res);

    console.log(req.file);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Could not upload the file" + err,
    });
  }
};

export const getListFile: RequestHandler = (req, res) => {
  const directoryPath = basedir + "/resources/static/assets/uploads/";
  const frameUrl = basedir + "/resources/static/assets/frame.png";
  fs.readdir(directoryPath, function (err: any, files: [string]) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos: { name: string; uri: string };
    files.filter((file: string) => {
      if (file == req.query.filename) {
        fileInfos = {
          name: file,
          uri: baseUrl + file,
        };

        console.log(fileInfos);

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
      }
    });
  });
};

export const download: RequestHandler = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = basedir + "/resources/static/assets/uploads/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
