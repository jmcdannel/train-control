#include "Signal.h";
#include "Button2.h";

#define BUTTON_PIN  6

Signal signal1(5, 4, 3);
Button2 button = Button2(BUTTON_PIN);

void setup()
{
  Serial.begin(9600);
  signal1.setup();
  button.setPressedHandler(pressed);
}
void loop()
{

  button.loop();

}
void pressed(Button2& btn) {
    signal1.next();
}
