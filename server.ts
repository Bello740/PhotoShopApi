import cors from "cors";
import express from "express";
const app = express();

declare global {
  var basedir: string;
}

global.basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

import { routes } from "./src/routes";

app.use(express.urlencoded({ extended: true }));
routes(app);

let port = 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
