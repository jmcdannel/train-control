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
@app.route('/<string:layout_id>/turnouts', methods=['GET'])
def turnouts(layout_id):
  return turnoutsapi.get(layout_id)

@app.route('/<string:layout_id>/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(layout_id, turnout_id):
  return turnoutsapi.get(layout_id. turnout_id)

@app.route('/<string:layout_id>/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(layout_id, turnout_id):
  return turnoutsapi.put(layout_id, turnout_id)

# /signals
@app.route('/<string:layout_id>/signals', methods=['GET'])
def signals(signal_id):
  return signalsapi.get(signal_id)

# /sensors
@app.route('/<string:layout_id>/sensors', methods=['GET'])
def sensors(sensor_id):
  return sensorsapi.get(sensor_id)

if __name__ == '__main__':
    app.run(host=host)
    # app.run(host='0.0.0.0')
