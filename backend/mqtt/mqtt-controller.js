var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://192.168.1.240");
client.on("connect", function () {
  console.log("MQTT connected");
});

module.exports = client;
