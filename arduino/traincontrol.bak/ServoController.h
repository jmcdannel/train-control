#ifndef TC_SERVOCONTROLLER_H
#define TC_SERVOCONTROLLER_H
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Adafruit_PWMServoDriver.h>

class ServoController {

  private:
    Adafruit_PWMServoDriver pwm;
    void move(int servo, int angle);
    int getPulseWidth(int angle);

  public:
    ServoController();
    void setup();
    void command(JsonObject payload);
};

#endif
