import os
from flask import json, jsonify, abort
from config import config

appConfig = config.getConfig()

def get(layout_id, sensor_id=None):
  path = os.path.dirname(__file__) + '/' + layout_id + '.sensors.json'
  with open(path) as sensor_file:
    data = json.load(sensor_file)
  if sensor_id is not None:
    sensor = [sensor for sensor in data if sensor['sensorId'] == sensor_id]
    
    if len(sensor) == 0:
      abort(404)
    return jsonify(sensor[0])
  else:
    return jsonify(data)
