const express = require("express");
const mongoose = require("mongoose");
const MessageAbl = require("./abl/message-abl");
const BoilerAbl = require("./abl/boiler-abl");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/app", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Could not connect to MongoDB... ", err));

app.use(express.json());

app.get("/notifier/sound/", (req, res) => {
  MessageAbl.sound(req, res);
});

app.post("/notifier/play/", (req, res) => {
  MessageAbl.play(req, res);
});

app.get("/notifier/list/", (req, res) => {
  MessageAbl.list(req, res);
});

app.post("/notifier/create/", (req, res) => {
  MessageAbl.create(req, res);
});

app.post("/notifier/update/", (req, res) => {
  MessageAbl.update(req, res);
});

app.post("/notifier/delete/", (req, res) => {
  MessageAbl.delete(req, res);
});

app.get("/boiler/get/", (req, res) => {
  BoilerAbl.get(req, res);
});

app.listen(2000, () => console.log("Listening on port 2000..."));
