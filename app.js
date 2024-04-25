require("dotenv").config();
const express = require("express");
const app = express();

require("./config/db.config");

app.use(express.json());

const router = require("./config/routes.config");
app.use("/", router);

app.listen(8000, () => {
  console.log("Ready on port 8000");
});
