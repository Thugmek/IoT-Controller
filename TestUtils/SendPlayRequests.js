const http = require("http");

setInterval(() => {
  console.log("Play...");
  http.get(
    "http://192.168.1.162/?file=binary-store/file-1615410108575.mp3",
    () => {}
  );
}, 25000);
