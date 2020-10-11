#include "Signal.h"

#define datapin 2
#define clockpin 3
#define latchpin 4


Signal::Signal(int greenLed, int yellowLed, int redLed) {
  this->greenLed = greenLed;
  this->yellowLed = yellowLed;
  this->redLed = redLed;
}

void Signal::shiftWrite(int desiredPin, boolean desiredState) {
  bitWrite(data, desiredPin, desiredState);
  shiftOut(datapin, clockpin, MSBFIRST, data);
  digitalWrite(latchpin, HIGH);
  digitalWrite(latchpin, LOW);
}

void Signal::setup() {
  pinMode(datapin, OUTPUT);
  pinMode(clockpin, OUTPUT);
  pinMode(latchpin, OUTPUT);
  green();
}

void Signal::next() {
  Serial.println("Signal.next()");
  Serial.println(state);
  if (state == "green") {
    yellow();
  } else if (state == "yellow") {
    red();
  } else if (state == "red") {
    green();
  }
}

void Signal::green() {
  shiftWrite(yellowLed, LOW);
  shiftWrite(redLed, LOW);
  shiftWrite(greenLed, HIGH);
  state = "green";
  Serial.println("Green");
}

void Signal::yellow() {
  shiftWrite(redLed, LOW);
  shiftWrite(greenLed, LOW);
  shiftWrite(yellowLed, HIGH);
  state = "yellow";
  Serial.println("Yellow");
}

void Signal::red() {
  shiftWrite(yellowLed, LOW);
  shiftWrite(greenLed, LOW);
  shiftWrite(redLed, HIGH);
  state = "red";
  Serial.println("Red");
}


String Signal::getState() {
  return state;
}
