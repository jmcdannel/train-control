import os
from flask import json, jsonify, abort, request
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']
arduino = None

if (appConfig['sensors']['device'] == 'arduino' and appConfig['signals']['interface'] =='serial'):
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
  path = os.path.dirname(__file__) + '/' + layoutId + '.sensors.json'
  with open(path) as sensors_file:
    data = json.load(sensors_file)

  for sensor in data:
    cmd = '<S %d %d 0>' % (sensor['pin'], sensor['pin'])
    _sendCommand(cmd)

def get(sensor_id=None):
  path = os.path.dirname(__file__) + '/' + layoutId + '.sensors.json'
  with open(path) as sensor_file:
    data = json.load(sensor_file)
  if sensor_id is not None:
    sensor = [sensor for sensor in data if sensor['sensorId'] == sensor_id]
    
    if len(sensor) == 0:
      abort(404)
    return jsonify(sensor[0])
  else:
    return jsonify(data)
