#include "WiFi.h"
#include "AudioFileSourceICYStream.h"
#include "AudioFileSourceBuffer.h"
#include "AudioGeneratorMP3.h"
#include "AudioOutputI2SNoDAC.h"
#include <WebServer.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "wifiController.h"
#include "ota.h"

#include "define.h" //SSID and password stored here

#ifndef SSID
#define SSID "Your-SSID"
#endif

#ifndef PASSWORD
#define PASSWORD "Your-Password"
#endif

const char *mqtt_server = "192.168.1.241";

const char *ssid = SSID;
const char *password = PASSWORD;

//OTA ota = OTA();
WiFiClient espClient;
PubSubClient client(espClient);

WebServer server(80);

AudioGeneratorMP3 *mp3;
AudioFileSourceICYStream *file;
AudioFileSourceBuffer *buff;
AudioOutputI2SNoDAC *out;

String nextUrl = "";

unsigned long timeout = millis();

void playHttp(char *url)
{
  free(buff);
  file->open(url);
  Serial.print("Playng...\nIs open: ");
  Serial.println(file->isOpen());
  buff = new AudioFileSourceBuffer(file, 4092);
  mp3->begin(buff, out);
}

void handlePlay()
{
  Serial.print("Play request: ");
  Serial.println(server.arg(0));
  String message = "";
  message += "\nPlaying: ";
  message += server.arg(0);
  server.send(200, "text/plain", message);
  nextUrl = ("http://192.168.1.241:2000/notifier/sound?file=" + server.arg(0));
  playHttp("http://192.168.1.241:2000/notifier/sound?file=binary-store/bell.mp3");
}

void callback(String topic, byte *message, unsigned int length)
{
  char json[length];
  for (unsigned int i = 0; i < length; i++)
  {
    json[i] = (char)message[i];
  }

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, json);

  if (!error)
  {
    if (topic == "bedroom/speaker")
    {
      String path = doc["file"];
      if (doc.containsKey("volume"))
        out->SetGain(doc["volume"]);
      nextUrl = ("http://192.168.1.241:2000/notifier/sound?file=" + path);
      playHttp("http://192.168.1.241:2000/notifier/sound?file=binary-store/bell.mp3");
    }
  }
}

void sendMQTTInfo()
{
  if (timeout < millis())
  {
    StaticJsonDocument<200> doc;
    doc["device"] = "Speaker";
    doc["IP"] = WiFi.localIP().toString();
    doc["status"] = "running";
    doc["uptime"] = millis();

    int len = measureJsonPretty(doc);
    char buf[len + 1];
    serializeJsonPretty(doc, buf, len + 1);

    client.publish("bedroom/speaker/sys", buf);
    timeout = millis() + 3000;
  }
}

void setup()
{

  WifiController::init();
  OTA::init();

  // We start by connecting to a WiFi network

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  audioLogger = &Serial;
  digitalWrite(22, LOW);
  delay(1000);
  file = new AudioFileSourceICYStream("");
  buff = new AudioFileSourceBuffer(file, 4092);
  out = new AudioOutputI2SNoDAC();
  out->SetGain(0.05f);
  out->SetOversampling(64);
  mp3 = new AudioGeneratorMP3();
  //playHttp("http://192.168.1.142:2000/notifier/sound?file=binary-store/file-1615381255315.mp3");

  server.on("/", handlePlay);

  server.begin();
  Serial.println("HTTP server started");
}

void loop()
{
  static int lastms = 0;
  server.handleClient();
  OTA::handle();

  if (!client.connected())
  {
    client.connect("Speaker");
    client.subscribe("bedroom/speaker");
  }

  if (!client.loop())
  {
    client.connect("Speaker");
    client.subscribe("bedroom/speaker");
  }

  if (mp3->isRunning())
  {
    if (millis() - lastms > 1000)
    {
      lastms = millis();
      Serial.printf("Running for %d ms...\n", lastms);
      Serial.flush();
    }
    if (!mp3->loop())
      mp3->stop();
  }
  else
  {
    if (file->isOpen())
      file->close();
    if (buff->isOpen())
      buff->close();
    if (nextUrl != "")
    {
      char urlBuff[200];
      nextUrl.toCharArray(urlBuff, 200);
      nextUrl = "";
      playHttp(urlBuff);
    }
  }

  sendMQTTInfo();
}