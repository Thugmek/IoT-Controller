const googleTTS = require("google-tts-api");
const mongoose = require("mongoose");
const fs = require("fs");
const https = require("https");
var client = require("../mqtt/mqtt-controller");

class BoilerAbl {
  constructor() {
    let schema = new mongoose.Schema({
      t1: Number,
      t2: Number,
      time: String,
    });

    this.Log = mongoose.model("Log", schema);
    client.subscribe("bedroom/boiler/sys", function (err) {
      console.log("Error:", err);
    });
    let Log = this.Log;
    client.on("message", function (topic, message) {
      let data = JSON.parse(message);
      if (data["28804a77910f02a9"] < 10 || data["288ddba05d2001cd"] < 10) {
        console.log("chyba");
        return;
      }
      Log.create({
        t1: data["28804a77910f02a9"],
        t2: data["288ddba05d2001cd"],
        time: Date.now(),
      })
        .then(() => console.log("ok"))
        .catch((e) => console.log("Error", e));
    });
  }

  get(req, res) {
    this.Log.find({}, [], {
      skip: 0, // Starting Row
      limit: 20000, // Ending Row
      sort: {
        time: -1, //Sort by Date Added DESC
      },
    }).then((r) => {
      res.json(r);
    });
  }
}

module.exports = new BoilerAbl();
