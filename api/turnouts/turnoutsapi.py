import os
from flask import json, jsonify, request, abort
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']
path = os.path.dirname(__file__) + '/' + layoutId + '.turnouts.json'
arduino = None
kit = None
pwm = None
GPIO = None

# Import Arduino Sertal
if ('arduino' in appConfig['turnouts'] and  appConfig['turnouts']['interface'] == 'serial'):
  try:
    import serial
    arduino = serial.Serial(appConfig['serial'], 115200)
  except ImportError as error:
    # Output expected ImportErrors.
    print('serial ImportError')
    print(error, False)
  except Exception as exception:
    # Output unexpected Exceptions.
    print('Exception')
    print(exception, False)

# Import RPi GPIO
if appConfig['turnouts']['device'] == 'pi':
  try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    print('GPIO Mode set to BOARD')
  except ImportError as error:
    # Output expected ImportErrors.
    print('RPi.GPIO ImportError')
    print(error, False)
  except Exception as exception:
    # Output unexpected Exceptions.
    print('Exception')
    print(exception, False)

# Import RPi PWM Controller
if (appConfig['turnouts']['device'] == 'pi' and appConfig['turnouts']['interface'] =='PCA9685'):
  try:
    import Adafruit_PCA9685
    pwm = Adafruit_PCA9685.PCA9685()
    print('Loaded Adafruit_PCA9685')
  except ImportError as error:
    # Output expected ImportErrors.
    print('Adafruit_PCA9685 ImportError')
    print(error, False)
  except Exception as exception:
    # Output unexpected Exceptions.
    print('Exception')
    print(exception, False)

# Import RPi ServoKit Controller
if (appConfig['turnouts']['device'] == 'pi' and appConfig['turnouts']['interface'] =='ServoKit'):
  try:
    from adafruit_servokit import ServoKit
    kit = ServoKit(channels=16)
    print('Loaded adafruit_servokit')
  except ImportError as error:
    # Output expected ImportErrors.
    print(error.__class__.__name__ + ": " + error['message'])
  except Exception as exception:
    # Output unexpected Exceptions.
    print(exception, False)
    print(exception.__class__.__name__ + ": " + exception['message'])


def get_file():
  with open(path) as json_file:
    data = json.load(json_file)
  return data

def _sendCommand(cmd):
  if arduino is not None:
    print('cmd: %s' % cmd)
    arduino.write(cmd.encode())

def init():
  data = get_file()

  if arduino is not None:
    for trn in data:
      if 'dcc' in trn:
        _sendCommand('<Z %d %d 0>' % (trn['pinA'], trn['pinA']))
        _sendCommand('<Z %d %d 0>' % (trn['pinB'], trn['pinB']))
    _sendCommand('<E>')

  if pwm is not None:
    servo_min = 150  # Min pulse length out of 4096
    servo_max = 600  # Max pulse length out of 4096
    pwm.set_pwm_freq(60)

  if GPIO is not None:
    path = os.path.dirname(__file__) + '/' + layoutId + '.turnouts.json'
    with open(path) as turnout_file:
      data = json.load(turnout_file)

    for turnout in data:
      if 'relay' in turnout:
        print(turnout['relay'])
        GPIO.setup(turnout['relay']['pin'], GPIO.OUT)
      if 'relayCrossover' in turnout:
        GPIO.setup(turnout['relayCrossover']['pin'], GPIO.OUT)

def get(turnout_id=None):
  data = get_file()
  if turnout_id is not None:
    turnout = [turnout for turnout in data if turnout['turnoutId'] == turnout_id]
    
    if len(turnout) == 0:
      abort(404)
    return jsonify(turnout[0])
  else:
    return jsonify(data)

def put(turnout_id):
  data = get_file()
  turnouts = [turnout for turnout in data if turnout['turnoutId'] == turnout_id]

  # validate
  if len(turnouts) == 0:
    abort(404)
  if not request.json:
    abort(400)

  turnout = turnouts[0]
  for key in request.json:
    turnout[key] = request.json.get(key, turnout[key])

  # Turn servo to current degrees
  if 'servo' in turnout:
    if kit is not None:
      kit.servo[turnout['servo']].angle = turnout['current']
    if pwm is not None:
      pwm.set_pwm(turnout['servo'], 0, turnout['current'])

  # Turn kato turnout via DCC OUTPUT
  if 'dcc' in turnout:
    if arduino is not None:
      if (turnout['current'] == 1):
        _sendCommand('<Z %d %d>' % (turnout['dccB'], 0))
        _sendCommand('<Z %d %d>' % (turnout['dccA'], 1))
      elif (turnout['current'] == 0):
        _sendCommand('<Z %d %d>' % (turnout['dccA'], 0))
        _sendCommand('<Z %d %d>' % (turnout['dccB'], 1))

  if GPIO is not None:
    # Toggle relay if present
    if 'relay' in turnout:
      if turnout['current'] == turnout['straight']:
        GPIO.output(turnout['relay']['pin'], turnout['relay']['straight'])
      else:
        GPIO.output(turnout['relay']['pin'], turnout['relay']['divergent'])

    # Toggle crossover relay if present
    if 'relayCrossover' in turnout:
      if turnout['current'] == turnout['straight']:
        GPIO.output(turnout['relayCrossover']['pin'], turnout['relayCrossover']['straight'])
      else:
        GPIO.output(turnout['relayCrossover']['pin'], turnout['relayCrossover']['divergent'])

  # save all keys
  
  with open(path, 'w') as turnout_file:
        json.dump(data, turnout_file)

  return jsonify(turnout)
