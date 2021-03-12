#include <arduino.h>
#include "WiFi.h"
#include "wifiController.h"
#include "define.h"

#ifndef SSID
#define SSID "Your-SSID"
#endif

#ifndef PASSWORD
#define PASSWORD "Your-Password"
#endif

void WifiController::init()
{

    Serial.begin(115200);
    delay(10);
    Serial.print("Connecting to wifi");

    /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
        would try to act as both a client and an access-point and could cause
        network-issues with your other WiFi-devices on your WiFi-network. */
    WiFi.mode(WIFI_STA);
    //WiFi.setSleepMode(WIFI_NONE_SLEEP);
    WiFi.begin(SSID, PASSWORD);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
}