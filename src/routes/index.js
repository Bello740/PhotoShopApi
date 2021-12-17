const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/file", controller.getListFile);
  router.get("/file/:name", controller.download);

  app.use(router);
};

module.exports = routes;
