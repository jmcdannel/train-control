import os
import sys
import logging
import serial
from flask_cors import CORS
from flask import Flask, json
from turnouts import turnoutsapi
from layouts import layoutsapi
from config import config

app = Flask(__name__)
cors = CORS(app)
serialPort = sys.argv[1]
host = config.getHost()
print(serialPort)
print(config.getHost())
# arduino = serial.Serial(serialPort, 115200)
logging.getLogger('flask_cors').level = logging.DEBUG

def write_serial_command(turnout):
  logging.info(turnout)
  # Turn servo to current degrees
  if 'servo' in turnout:
    servoAction = {
      'action': 'servo',
      'payload': {
        'servo': turnout['servo'],
        'angle': turnout['current']
      }
    }
    if 'relay' in turnout:
      if turnout['current'] == turnout['straight']:
        relayState = False
      else:
        relayState = True

      servoAction['payload']['relay'] = {
        'relayPin': turnout['relay'],
        'state': relayState
      }
    arduino.write(json.dumps(servoAction).encode())
  
@app.route('/layouts', methods=['GET'])
def layouts():
  return layoutsapi.get()
  
@app.route('/layouts/<string:layout_id>', methods=['GET'])
def get_layout(layout_id):
  return layoutsapi.get(layout_id)

@app.route('/layouts/<string:layout_id>/turnouts', methods=['GET'])
def turnouts(layout_id):
  return turnoutsapi.get(layout_id)

@app.route('/layouts/<string:layout_id>/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(layout_id, turnout_id):
  return turnoutsapi.get(layout_id. turnout_id)

@app.route('/layouts/<string:layout_id>/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(layout_id, turnout_id):
  response = turnoutsapi.put(layout_id, turnout_id)
  # write_serial_command(response.get_json())
  return response

if __name__ == '__main__':
    app.run(host=host)
    # app.run(host='0.0.0.0')
