import os
import logging
import RPi.GPIO as GPIO
from flask_cors import CORS
from flask import Flask, render_template, url_for, json, jsonify, request, abort
from adafruit_servokit import ServoKit

app = Flask(__name__)
logging.getLogger('flask_cors').level = logging.DEBUG
app.config['DEBUG'] = True
CORS(app)
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(22, GPIO.OUT)
GPIO.setup(27, GPIO.IN)
GPIO.setup(21, GPIO.OUT)
kit = ServoKit(channels=16)

path = os.path.dirname(__file__) + '/turnouts.json'

@app.route('/', methods=['GET'])
def home():
  return jsonify({'endpoints': ['/turnouts']})

@app.route('/turnouts', methods=['GET'])
def turnouts():
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  return jsonify(data)

@app.route('/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(turnout_id):
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  turnout = [turnout for turnout in data if turnout['id'] == turnout_id]
  
  if len(turnout) == 0:
      abort(404)
  return jsonify(turnout[0])

@app.route('/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(turnout_id):
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  turnouts = [turnout for turnout in data if turnout['id'] == turnout_id]
  if len(turnouts) == 0:
      abort(404)
  turnout = turnouts[0]
  if not request.json:
      abort(400)
  if 'current' in request.json and type(request.json['current']) is not int:
      abort(400)
  if 'straight' in request.json and type(request.json['straight']) is not int:
      abort(400)
  if 'divergent' in request.json and type(request.json['divergent']) is not int:
      abort(400)

  # Turn servo to current degrees
  if 'servo' in turnout:
    kit.servo[turnout['servo']].angle = turnout['current']

  # Toggle relay if present
  if 'relay' in turnout:
    if turnout['current'] == turnout['straight']:
      GPIO.output(turnout['relay'], False)
    else:
      GPIO.output(turnout['relay'], True)

  # save all keys
  for key in request.json:
    turnout[key] = request.json.get(key, turnout[key])
  with open(path, 'w') as turnout_file:
        json.dump(data, turnout_file)

  return jsonify(turnout)

if __name__ == '__main__':
    context = ('cert.crt', 'cert.key')#certificate and key files
    app.run(host='0.0.0.0', ssl_context=context)
