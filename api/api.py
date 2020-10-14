import os
import logging
import serial
from flask_cors import CORS
from flask import Flask, json
from turnouts import api as tunroutsApi
from layouts import layoutsapi

app = Flask(__name__)
cors = CORS(app)
# arduino = serial.Serial('/dev/cu.usbmodem146301', 9600)
# arduino = serial.Serial('/dev/cu.usbmodem14201', 9600)
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
  return tunroutsApi.get(layout_id)

@app.route('/layouts/<string:layout_id>/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(layout_id, turnout_id):
  return tunroutsApi.get(layout_id. turnout_id)

@app.route('/layouts/<string:layout_id>/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(layout_id, turnout_id):
  response = tunroutsApi.put(layout_id, turnout_id)
#   write_serial_command(response.get_json())
  return response

if __name__ == '__main__':
    # app.run(host='localhost')
    app.run(host='0.0.0.0')
