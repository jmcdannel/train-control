import os
from flask import json, jsonify, abort, request
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']

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
