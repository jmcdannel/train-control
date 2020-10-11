#ifndef SIGNAL_H
#define SIGNAL_H
#include <Arduino.h>
#include <ArduinoJson.h>

class Signal {

  private:
    int greenLed;
    int yellowLed;
    int redLed;
    byte data;
    String state;
    void shiftWrite(int desiredPin, boolean desiredState);

  public:
    Signal(int greenLed, int yellowLed, int redLed);
    void green();
    void yellow();
    void red();
    void next();
    void setup();
    void command(String payload);
    String getState();
};

#endif
