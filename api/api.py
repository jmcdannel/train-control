import os
from flask_cors import CORS
from flask import Flask, render_template, url_for, json, jsonify, request, abort
from adafruit_servokit import ServoKit

# TODO: enable https

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)

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
  return jsonify(turnout)

@app.route('/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(turnout_id):
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  turnout = [turnout for turnout in data if turnout['id'] == turnout_id]
  if len(turnout) == 0:
      abort(404)
  if not request.json:
      abort(400)
  if 'current' in request.json and type(request.json['current']) is not int:
      abort(400)
  if 'straight' in request.json and type(request.json['straight']) is not int:
      abort(400)
  if 'divergent' in request.json and type(request.json['divergent']) is not int:
      abort(400)
  kit.servo[turnout[0]['servo']].angle = turnout[0]['current']
  for key in request.json:
    turnout[0][key] = request.json.get(key, turnout[0][key])
  with open(path, 'w') as turnout_file:
        json.dump(data, turnout_file)

  return jsonify(turnout[0])

if __name__ == '__main__':
    app.run(ssl_context='adhoc', host='0.0.0.0')
