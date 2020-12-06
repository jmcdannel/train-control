import os
from flask import json, jsonify, abort, request
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']
arduino = None

if (appConfig['signals']['device'] == 'arduino' and appConfig['signals']['interface'] =='serial'):
  try:
    import serial
    arduino = serial.Serial(appConfig['serial'], 115200)
    print('IMPORTED ARDUINO SERIAL')
  except ImportError as error:
    # Output expected ImportErrors.
    print('serial ImportError')
    print(error, False)
  except Exception as exception:
    # Output unexpected Exceptions.
    print('Exception')
    print(exception, False)

def _sendCommand(cmd):
  if arduino is not None:
    print('cmd: %s' % cmd)
    arduino.write(cmd.encode())

def init():
  path = os.path.dirname(__file__) + '/' + layoutId + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)

  for signal in data:
    cmd = '<Z %d %d 0 %d>' % (signal['greenPin'], signal['greenPin'], int('00000000', 2))
    _sendCommand(cmd)
    cmd = '<Z %d %d 1 %d>' % (signal['redPin'], signal['redPin'], int('00000000', 2))
    _sendCommand(cmd)

def get(signal_id=None):
  path = os.path.dirname(__file__) + '/' + layoutId + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)
  if signal_id is not None:
    signal = [signal for signal in data if signal['signalId'] == signal_id]
    
    if len(signal) == 0:
      abort(404)
    return jsonify(signal[0])
  else:
    return jsonify(data)

def put(signal_id):
  path = os.path.dirname(__file__) + '/' + layoutId + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)
  signals = [signal for signal in data if signal['signalId'] == signal_id]


  # validate
  if len(signals) == 0:
    abort(404)
  if not request.json:
    abort(400)

  signal = signals[0]
  for key in request.json:
    signal[key] = request.json.get(key, signal[key])

  state = 0
  signalId = signal['signalId']
  if 'state' in signal:
    state = signal['state']

  if  state == 1:
    cmd = '<Z %d 1>' % signal['greenPin']
    _sendCommand(cmd)
    cmd = '<Z %d 0>' % signal['redPin']
    _sendCommand(cmd)
  else:
    cmd = '<Z %d 0>' % signal['greenPin']
    _sendCommand(cmd)
    cmd = '<Z %d 1>' % signal['redPin']
    _sendCommand(cmd)


  # save all keys
  
  with open(path, 'w') as signal_file:
        json.dump(data, signal_file)

  return jsonify(signal)
