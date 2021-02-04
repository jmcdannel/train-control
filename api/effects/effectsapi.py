import os
from flask import json, jsonify, abort, request
from config import config
from . import soundfx

appConfig = config.getConfig()
layoutId = appConfig['layoutId']
path = os.path.dirname(__file__) + '/' + layoutId + '.effects.json'
arduino = None
kit = None
pwm = None
GPIO = None

# Import RPi GPIO
if ('pi' in appConfig['effects'] and 'GPIO' in appConfig['effects']['pi']):
  try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
  except ImportError as error:
    # Output expected ImportErrors.
    print('RPi.GPIO ImportError')
    print(error, False)
  except Exception as exception:
    # Output unexpected Exceptions.
    print('Exception')
    print(exception, False)

# Import Arduino Sertial
if ('arduino' in appConfig['effects'] and 'serial' in appConfig['effects']['arduino']):
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

# Import RPi PWM Controller
if ('pi' in appConfig['effects'] and 'PCA9685' in appConfig['effects']['pi']):
  try:
    import Adafruit_PCA9685
    pwm = Adafruit_PCA9685.PCA9685()
    servo_min = 150  # Min pulse length out of 4096
    servo_max = 600  # Max pulse length out of 4096
    pwm.set_pwm_freq(60)
  except ImportError as error:
    # Output expected ImportErrors.
    print('Adafruit_PCA9685 ImportError')
    print(error, False)
  except Exception as exception:
    # Output unexpected Exceptions.
    print('Exception')
    print(exception, False)

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
  soundfx.init()

  if arduino is not None:
    for efx in data:
      for action in efx.actions:
        if action['type'] == 'DCCOutput':
          _sendCommand('<Z %d %d 0>' % (action['pin'], action['pin']))

  if GPIO is not None:
    for efx in data:
      for action in efx.actions:
        if action['type'] == 'GPIO':
          GPIO.setup(action['pin'], GPIO.OUT)

def get(effect_id=None):
  data = get_file()
  if effect_id is not None:
    efx = [efx for efx in data if efx['effectId'] == effect_id]
    
    if len(efx) == 0:
      abort(404)
    return jsonify(efx[0])
  else:
    return jsonify(data)

def put(effect_id):
  data = get_file()
  efx = [efx for efx in data if efx['effectId'] == effect_id]
  state = request.json['state']

  # validate
  if len(efx) == 0:
    abort(404)
  if not request.json:
    abort(400)

  efx = efx[0]

  efx['state'] = state
  
  for action in efx['actions']:
    
    actionState = getActionState(efx, action['actionId'], state)
    if(action['type'] == 'DCCOutput' and arduino is not None):
      # DCC Output Command
      _sendCommand('<Z %d %d>' % (action['pin'], actionState))
    elif(action['type'] == 'Arduino Script'):
      # Arduino Script
      print('Arduino Script: Not implemented')
    elif(action['type'] == 'Sound Loop'):
      # Sound Loop
      print('Sound Loop: ' + action["sound"])
      soundfx.play(action["sound"], 'right')
    elif(action['type'] == 'Sound'):
      # Sound
      print('Sound: ' + action["sound"])
      soundfx.play(action["sound"], 'left')
    elif(action['type'] == 'GPIO' and GPIO is not None):
      # RPi GPIO Output
      GPIO.output(action['pin'], action['state'])

  # save
  with open(path, 'w') as json_file:
    json.dump(data, json_file)

  return jsonify(efx)

def getActionState(efx, action, state):
  if 'states' not in efx:
    return state
  elif efx['states'][str(state)] is None:
    return state
  elif efx['states'][str(state)][action] is None:
    return state
  else:
    return efx['states'][str(state)][action]
    