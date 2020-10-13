#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
#include <ArduinoJson.h>

#define SERVOMIN  150 // This is the 'minimum' pulse length count (out of 4096)
#define SERVOMAX  600 // This is the 'maximum' pulse length count (out of 4096)
#define MIN_PULSE_WIDTH 650
#define MAX_PULSE_WIDTH 2350
#define USMIN  600 // This is the rounded 'minimum' microsecond length based on the minimum pulse of 150
#define USMAX  2400 // This is the rounded 'maximum' microsecond length based on the maximum pulse of 600
#define SERVO_FREQ 50 // Analog servos run at ~50 Hz updates
#define SERVO_COUNT 16

// {"action":"servo","payload":{"servo":0,"angle":60,"relay":{"relayPin":0,"state":true}}}

const size_t capacity = 2*JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + 60;
DynamicJsonDocument doc(capacity);
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

void setup() {
  Serial.begin(9600);
  while (!Serial) continue;
  Serial.println("Setup");
  pwm.begin();
  pwm.setOscillatorFrequency(27000000);
  pwm.setPWMFreq(SERVO_FREQ);  // Analog servos run at ~50 Hz updates
}

void loop() {
  if (Serial.available() > 0) {
    Serial.println("handleInput");
    handleInput();
  }
}

void handleInput() {
  String input = Serial.readString();
  Serial.println(input);
  deserializeJson(doc, input);

  String action = doc["action"];
  JsonObject payload = doc["payload"];

  Serial.print("Action: ");
  Serial.println(action);

  if (action == "servo") {
    Serial.println("action == servo");
    command(payload);
  }
}

void command(JsonObject payload) {
  int angle = payload["angle"];
  int servo = payload["servo"];
  Serial.print("angle: ");
  Serial.println(angle);
  Serial.print("servo: ");
  Serial.println(servo);
  pwm.setPWM(servo, 0, getPulseWidth(angle));
}

int getPulseWidth(int angle)
{
  int pulse_wide, analog_value;
  pulse_wide   = map(angle, 0, 180, MIN_PULSE_WIDTH, MAX_PULSE_WIDTH);
  analog_value = int(float(pulse_wide) / 1000000 * SERVO_FREQ * 4096);
  Serial.println(analog_value);
  return analog_value;
}
