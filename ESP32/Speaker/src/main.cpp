#include "WiFi.h"
#include "AudioFileSourceICYStream.h"
#include "AudioFileSourceBuffer.h"
#include "AudioGeneratorMP3.h"
#include "AudioOutputI2SNoDAC.h"
#include <WebServer.h>
#include "define.h" //SSID and password stored here

#ifndef SSID
#define SSID "Your-SSID"
#endif

#ifndef PASSWORD
#define PASSWORD "Your-Password"
#endif

const char *ssid = SSID;
const char *password = PASSWORD;

WebServer server(80);

AudioGeneratorMP3 *mp3;
AudioFileSourceICYStream *file;
AudioFileSourceBuffer *buff;
AudioOutputI2SNoDAC *out;

String nextUrl = "";

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
  String message = "";
  message += "\nPlaying: ";
  message += server.arg(0);
  server.send(200, "text/plain", message);
  nextUrl = ("http://192.168.1.142:2000/notifier/sound?file=" + server.arg(0));
  playHttp("http://192.168.1.142:2000/notifier/sound?file=binary-store/bell.mp3");
}

void setup()
{
  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  audioLogger = &Serial;
  digitalWrite(22, LOW);
  delay(1000);
  file = new AudioFileSourceICYStream("");
  buff = new AudioFileSourceBuffer(file, 4092);
  out = new AudioOutputI2SNoDAC();
  out->SetGain(0.01f);
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
}