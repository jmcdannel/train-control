import os
import sys
import logging
from flask_cors import CORS
from flask import Flask, json
from turnouts import turnoutsapi
from signals import signalsapi
from sensors import sensorsapi
from config import config

# intialize server
app = Flask(__name__)
cors = CORS(app)
logging.getLogger('flask_cors').level = logging.DEBUG

# configure app
appConfig = config.getConfig()
host = appConfig['apiHost']
layoutId = appConfig['layoutId']
turnoutsapi.init('tam')
  
# /turnouts
@app.route('/turnouts', methods=['GET'])
def turnouts():
  return turnoutsapi.get(layoutId)

@app.route('/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(turnout_id):
  return turnoutsapi.get(layoutId. turnout_id)

@app.route('/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(turnout_id):
  return turnoutsapi.put(layoutId, turnout_id)

# /signals
@app.route('/signals', methods=['GET'])
def signals():
  return signalsapi.get(layoutId)

@app.route('/<string:layout_id>/signals', methods=['GET'])
def get_signal(signal_id):
  return signalsapi.get(layoutId, signal_id)

# /sensors
@app.route('/sensors', methods=['GET'])
def sensors():
  return sensorsapi.get(layoutId)

@app.route('/<string:layout_id>/sensors', methods=['GET'])
def get_sensor(sensor_id):
  return sensorsapi.get(layoutId, sensor_id)

if __name__ == '__main__':
    app.run(host=host)
    # app.run(host='0.0.0.0')
