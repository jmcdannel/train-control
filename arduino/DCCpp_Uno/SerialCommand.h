/**********************************************************************

SerialCommand.h
COPYRIGHT (c) 2013-2016 Gregg E. Berman

Part of DCC++ BASE STATION for the Arduino

**********************************************************************/

#ifndef SerialCommand_h
#define SerialCommand_h

#include "PacketRegister.h"
#include "CurrentMonitor.h"
#include <ArduinoJson.h>
#include <Adafruit_PWMServoDriver.h>

#define  MAX_COMMAND_LENGTH         30

struct SerialCommand{
  static char commandString[MAX_COMMAND_LENGTH+1];
  static volatile RegisterList *mRegs, *pRegs;
  static Adafruit_PWMServoDriver *pwm;
  static CurrentMonitor *mMonitor;
  static void init(volatile RegisterList *, volatile RegisterList *, CurrentMonitor *, Adafruit_PWMServoDriver *);
  static void parse(char *);
  static void process();
  static void handleInput(String input);
  static void command(JsonObject payload);
  static int getPulseWidth(int angle);
}; // SerialCommand
  
#endif
