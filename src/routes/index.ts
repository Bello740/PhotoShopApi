import { Router } from "express";
const router = Router();
import { upload, getListFile, download } from "../controller/file.controller";

export let routes = (app: { use: (arg0: any) => void }) => {
  router.post("/upload", upload);
  router.get("/file", getListFile);
  router.get("/file/:name", download);

  app.use(router);
};
