import util from "util";
import multer from "multer";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
}).single("file");

export let uploadFileMiddleware = util.promisify(uploadFile);
