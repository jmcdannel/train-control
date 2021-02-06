// These are the possible states that are used to control how the arc welding flows
#define S_IDLE 1
#define S_STRIKE_ARC 2
#define S_WHITE_ARC 3
#define S_BLUE_ARC 4
#define S_RED_GLOW 5
#define S_TURNOFF 6

static int state_main_control = S_IDLE; // initial state is idle.
static int state_blue_arc_control = S_IDLE; // initial state is idle.
static unsigned long ts;  // To store the "current" time.
static unsigned long wait;  // To store the wait time  for delays.

void setup()
{ //Nothing to set up here!
}
void loop()
{
  static int ledPin_white_arc = 48; // White LED on pin 4
  pinMode(ledPin_white_arc, OUTPUT);
  static int ledPin_blue_arc = 50;  // Blue LED on pin 2
  pinMode(ledPin_blue_arc, OUTPUT);
  static int ledPin_red_glow = 46;  // Red LED on pin 3
  pinMode(ledPin_red_glow, OUTPUT);

  switch (state_main_control)// Main control state manages the arc welding cycle
  {
    case S_IDLE:
      ts = millis();  // Remember the current time
      wait = random(1000, 5000); //Set a wait time before welding cycle starts.
      state_main_control = S_STRIKE_ARC; // Move to the Arc "striking" state.
      break;

    case S_STRIKE_ARC: // Simulates the striking needed between welding rod and work to start an arc
      if (millis() > ts + wait)//Start the arc strikes when the random delay is exceeded
      {
        int strikes = random (2,5);//random number of strikes  to start the arc
        for (int i = 0; i<strikes; i++)
        {
        digitalWrite(ledPin_white_arc, HIGH ); // Turn the white arc LED on for first attempt
        delay(random (80,120)); // strike the arc
        digitalWrite(ledPin_white_arc, LOW ); // Turn the white arc LED off
        delay(random (200,600)); // delay before next attempt
        }
        digitalWrite(ledPin_white_arc, LOW ); // Turn the white arc LED off in preparation for full arc
        ts = millis(); // Remember the current time
        wait = random(5000, 10000); //Set a random time for now long the arc welding cycle to run
        state_main_control = S_WHITE_ARC; // Move on to next state
        state_blue_arc_control = S_BLUE_ARC; // start up a simultaneous blue arc with the white arc
      }
      break;

    case S_WHITE_ARC: // main flashing of white arc.
      if (ts + wait > millis())// provided random time not exceeded, then keep welding.
      {
        digitalWrite(ledPin_white_arc, HIGH); // set the Arc LED off
        delay(random(60));
        digitalWrite(ledPin_white_arc, LOW); // set the Arc LED on
        delay(random(200));
        break;
      }
      ts = millis(); // Remember current time
      wait = random(5000, 10000); //Set a random time for the weld glow to run
      state_main_control = S_RED_GLOW; // Move on to next state
      state_blue_arc_control = S_IDLE;       // Stop the blue element of the arc
      break;

    case S_RED_GLOW:// Simulates the cooling of the work from red hot after the arc is stopped using an analogue write
      if (ts + wait > millis())
      {
        for (int i = 50; i > 0; i--) { //decrease i with 1
          analogWrite(ledPin_red_glow, i);
          delay(100);
        }
        state_main_control = S_TURNOFF;
        break;
      }
    case S_TURNOFF:
      digitalWrite(ledPin_red_glow, LOW); // Kill the last bit of analogue glow
      state_main_control = S_IDLE;
      break;
  }
  switch (state_blue_arc_control)// Separate state machine running blue arc alongside white arc at different flash frequency
  {
    case S_BLUE_ARC:
      digitalWrite(ledPin_blue_arc, HIGH); // set the Arc LED on
      delay(random(10));
      digitalWrite(ledPin_blue_arc, LOW); // set the Arc LED off
      delay(random(100));
      break;
  }
}
