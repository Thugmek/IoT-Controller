#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "wifiController.h"
#include "ota.h"

#include "define.h" //SSID and password stored here

#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
int numberOfDevices;
DeviceAddress tempDeviceAddress;

const char *mqtt_server = "192.168.1.241";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long timeout = millis();

void sendMQTTInfo()
{
  if (timeout < millis())
  {
    numberOfDevices = sensors.getDeviceCount();
    sensors.requestTemperatures();
    StaticJsonDocument<200> doc;
    doc["device"] = "Boiler";
    doc["IP"] = WiFi.localIP().toString();
    doc["Devices"] = numberOfDevices;

    for (int i = 0; i < numberOfDevices; i++)
    {
      // Search the wire for address
      if (sensors.getAddress(tempDeviceAddress, i))
      {
        String addr = "";
        for (uint8_t i = 0; i < 8; i++)
        {
          if (tempDeviceAddress[i] < 16)
            addr += "0";
          addr += String(tempDeviceAddress[i], HEX);
        }
        doc[addr] = sensors.getTempC(tempDeviceAddress);
      }
    }

    int len = measureJsonPretty(doc);
    char buf[len + 1];
    serializeJsonPretty(doc, buf, len + 1);

    client.publish("boiler/sys", buf);
    timeout = millis() + 3000;
  }
}

void setup()
{

  WifiController::init();
  OTA::init();

  sensors.begin();

  client.setServer(mqtt_server, 1883);
  Serial.println(WiFi.localIP());
  Serial.println("Setup done!");
}

void loop()
{
  OTA::handle();

  if (!client.connected())
  {
    client.connect("Boiler");
    client.subscribe("boiler");
  }

  if (!client.loop())
  {
    client.connect("Boiler");
    client.subscribe("boiler");
  }

  sendMQTTInfo();
}