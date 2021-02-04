import os
import sys
import logging
from flask_cors import CORS
from flask import Flask, json
from turnouts import turnoutsapi
# from signals import signalsapi
from effects import effectsapi
from sensors import sensorsapi
from locos import locosapi
from config import config

# intialize server
app = Flask(__name__)
cors = CORS(app)
logging.getLogger('flask_cors').level = logging.DEBUG

# configure app
appConfig = config.getConfig()
host = appConfig['apiHost']
turnoutsapi.init()
# signalsapi.init()
effectsapi.init()
sensorsapi.init()
  
# /turnouts
@app.route('/turnouts', methods=['GET'])
def turnouts():
  return turnoutsapi.get()

@app.route('/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(turnout_id):
  return turnoutsapi.get(turnout_id)

@app.route('/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(turnout_id):
  return turnoutsapi.put(turnout_id)

# /signals
# @app.route('/signals', methods=['GET'])
# def signals():
#   return signalsapi.get()

# @app.route('/signals/<int:signal_id>', methods=['GET'])
# def get_signal(signal_id):
#   return signalsapi.get(signal_id)

# @app.route('/signals/<int:signal_id>', methods=['PUT'])
# def update_signal(signal_id):
#   return signalsapi.put(signal_id)

# /effects
@app.route('/effects', methods=['GET'])
def effects():
  return effectsapi.get()

@app.route('/effects/<int:effect_id>', methods=['GET'])
def get_effect(effect_id):
  return effectsapi.get(effect_id)

@app.route('/effects/<int:effect_id>', methods=['PUT'])
def update_effect(effect_id):
  return effectsapi.put(effect_id)

# /sensors
@app.route('/sensors', methods=['GET'])
def sensors():
  return sensorsapi.get()

@app.route('/sensors/<int:sensor_id>', methods=['GET'])
def get_sensor(sensor_id):
  return sensorsapi.get(sensor_id)

# /locos
@app.route('/locos', methods=['GET'])
def locos():
  return locosapi.get()

@app.route('/locos/<int:loco_id>', methods=['GET'])
def get_loco(loco_id):
  return locosapi.get(loco_id)

if __name__ == '__main__':
    app.run(host=host)
    # app.run(host='0.0.0.0')
