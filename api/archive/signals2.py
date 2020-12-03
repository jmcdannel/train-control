import RPi.GPIO as GPIO
from shiftr_74HC595.shiftr_74HC595 import ShiftRegister
from time import sleep

GPIO.setmode(GPIO.BOARD)

data_pin = 11 #pin 14 on the 75HC595
latch_pin = 12 #pin 12 on the 75HC595
clock_pin = 13 #pin 11 on the 75HC595

path = os.path.dirname(__file__) + '/tam.turnouts.json'
with open(path) as signal_file:
  data = json.load(signal_file)

for signal in data
  for trigger in signal['triggers']
    GPIO.setup(trigger['pin'], GPIO.IN)

ir1 = 15

GPIO.setup(ir1, GPIO.IN)

shift_register = ShiftRegister(data_pin, latch_pin, clock_pin)

try:
    shift_register.setOutput(0, GPIO.LOW)
    shift_register.setOutput(1, GPIO.LOW)
    shift_register.setOutput(2, GPIO.LOW)
    shift_register.setOutput(3, GPIO.LOW)
    shift_register.setOutput(4, GPIO.LOW)
    shift_register.setOutput(5, GPIO.LOW)
    shift_register.setOutput(6, GPIO.LOW)
    shift_register.setOutput(7, GPIO.LOW)
    while 1:
      if GPIO.input(ir1) == True:
        shift_register.setOutput(0, GPIO.HIGH)
        shift_register.setOutput(3, GPIO.LOW)
      else:
        shift_register.setOutput(0, GPIO.LOW)
        shift_register.setOutput(3, GPIO.HIGH)

      shift_register.latch()
except KeyboardInterrupt:
    print ("Ctrl-C - quit")

GPIO.cleanup()