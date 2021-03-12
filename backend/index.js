const googleTTS = require("google-tts-api");
const express = require("express");
const fs = require("fs");
const https = require("https");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/app", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Could not connect to MongoDB... ", err));

const messageSchema = new mongoose.Schema({
  name: String,
  text: String,
  file: String,
});

const Message = mongoose.model("Message", messageSchema);

function getSoundFile(text) {
  // get audio URL
  const url = googleTTS.getAudioUrl(text, {
    lang: "cs-CZ",
    slow: false,
    host: "https://translate.google.com",
  });
  console.log(url); // https://translate.google.com/translate_tts?...
  const path = `binary-store/file-${Date.now()}.mp3`;
  const fileStream = fs.createWriteStream(path);

  https.get(url, (res) => {
    res.pipe(fileStream);
  });

  return path;
}

app.use(express.json());

app.get("/notifier/sound/", (req, res) => {
  console.log("sound request");
  res.download(req.query.file);
});

app.post("/notifier/play/", (req, res) => {
  console.log(req.body);
  res.json({ status: "ok" });
  fetch(`http://192.168.1.162/?file=${req.body.file}`);
});

app.get("/notifier/list/", (req, res) => {
  Message.find().then((r) => {
    res.json(r);
  });
});

app.post("/notifier/create/", (req, res) => {
  req.body.file = getSoundFile(req.body.text);
  Message.create(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Nepodařilo se vytvořit zprávu");
    });
});

app.post("/notifier/update/", (req, res) => {
  req.body.file = getSoundFile(req.body.text);
  Message.findById(req.body._id).then((r) => {
    fs.unlink(r.file, () => {});
    Message.update({ _id: req.body._id }, { $set: { ...req.body } }).then(
      res.json(req.body)
    );
  });
});

app.post("/notifier/delete/", (req, res) => {
  Message.findById(req.body._id).then((r) => {
    fs.unlink(r.file, () => {});
    Message.deleteOne({ _id: req.body._id }).then(res.json({ status: "ok" }));
  });
});

app.listen(2000, () => console.log("Listening on port 2000..."));
