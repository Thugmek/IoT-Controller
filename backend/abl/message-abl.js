const googleTTS = require("google-tts-api");
const mongoose = require("mongoose");
const fs = require("fs");
const https = require("https");
var client = require("../mqtt/mqtt-controller");

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

class MessageAbl {
  constructor() {
    let schema = new mongoose.Schema({
      name: String,
      text: String,
      file: String,
    });

    this.Message = mongoose.model("Message", schema);
  }

  sound(req, res) {
    console.log("sound request");
    res.download(req.query.file);
  }

  play(req, res) {
    console.log(req.body);
    res.json({ status: "ok" });
    client.publish(
      "bedroom/speaker",
      JSON.stringify({
        file: req.body.file,
        volume: 1,
      })
    );
  }

  list(req, res) {
    this.Message.find().then((r) => {
      res.json(r);
    });
  }

  create(req, res) {
    req.body.file = getSoundFile(req.body.text);
    this.Message.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.send("Nepodařilo se vytvořit zprávu");
      });
  }

  update(req, res) {
    req.body.file = getSoundFile(req.body.text);
    this.Message.findById(req.body._id).then((r) => {
      fs.unlink(r.file, () => {});
      this.Message.update(
        { _id: req.body._id },
        { $set: { ...req.body } }
      ).then(res.json(req.body));
    });
  }

  delete(req, res) {
    this.Message.findById(req.body._id).then((r) => {
      fs.unlink(r.file, () => {});
      this.Message.deleteOne({ _id: req.body._id }).then(
        res.json({ status: "ok" })
      );
    });
  }
}

module.exports = new MessageAbl();
