#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
#include <ArduinoJson.h>
#include "Signal.h";
#include "ServoController.h";
#include "Button2.h";

#define BUTTON_PIN  6

// {"action":"servo","payload":{"servo":0,"angle":60,"relay":{"relayPin":0,"state":true}}}

const size_t capacity = 2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + 60;
DynamicJsonDocument doc(capacity);

//Signal signal1(5, 4, 3);
ServoController servos;
//Button2 button = Button2(BUTTON_PIN);

void setup() {
  Serial.begin(9600);
  while (!Serial) continue;
  servos.setup();
  Serial.println("Setup");
//  signal1.setup();
//  button.setPressedHandler(pressed);
}

void loop() {
//  button.loop();
  if (Serial.available() > 0) {
    Serial.println("handleInput");
    handleInput();
  }
}

void handleInput() {
//  DynamicJsonDocument doc(capacity);
  String input = Serial.readString();
  Serial.println(input);
  deserializeJson(doc, input);

  String action = doc["action"];
  JsonObject payload = doc["payload"];
  Serial.print("Action: ");
  Serial.println(action);
  if (action == "servo") {
    Serial.println("servos.command");
    servos.command(payload);
  } else if (action == "signal") {
//    signal1.command(payload);
  }
}

//void pressed(Button2& btn) {
//    signal1.next();
//}
