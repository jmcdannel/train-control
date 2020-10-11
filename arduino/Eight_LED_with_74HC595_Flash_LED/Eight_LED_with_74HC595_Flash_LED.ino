//www.elegoo.com
//2016.12.9 

int tDelay = 1000;
int latchPin = 11;      // (11) ST_CP [RCK] on 74HC595
int clockPin = 9;      // (9) SH_CP [SCK] on 74HC595
int dataPin = 12;     // (12) DS [S1] on 74HC595
int btnPin = 6;
int ledRed = 31;
int ledYellow = 33;
int ledGreen = 35;
String signalState = "green";

byte leds = 0;

void updateShiftRegister()
{
   shiftOut(dataPin, clockPin, LSBFIRST, leds);
   digitalWrite(latchPin, HIGH);
}

void setup() 
{
  pinMode(latchPin, OUTPUT);
  pinMode(dataPin, OUTPUT);  
  pinMode(clockPin, OUTPUT);
  pinMode(btnPin, INPUT_PULLUP);  
}

void loop() 
{

//  if (digitalRead(buttonApin) == LOW)
//  {
//    
//    digitalWrite(ledPin, HIGH);
//    delay(5000);
//  }
//  if (digitalRead(buttonBpin) == LOW)
//  {
//    digitalWrite(ledPin, LOW);
//  }
//  for (int i = 0; i < 5; i++)
//  {
//    bitSet(leds, i);
//    updateShiftRegister();
//    delay(tDelay);
//  }
  bitSet(leds, 0);
  updateShiftRegister();
  delay(tDelay);
}



void greenLight() {
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledRed, LOW);
  digitalWrite(ledGreen, HIGH);
}


void yellowLight() {
  digitalWrite(ledGreen, LOW);
  digitalWrite(ledRed, LOW);
  digitalWrite(ledYellow, HIGH);
  
}


void redLight() {
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledGreen, LOW);
  digitalWrite(ledRed, HIGH);
  
}
