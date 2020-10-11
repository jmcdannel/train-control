import os
import logging
from flask_cors import CORS
from flask import Flask, render_template, url_for, json, jsonify, request, abort

app = Flask(__name__)
logging.getLogger('flask_cors').level = logging.DEBUG
app.config['DEBUG'] = True
CORS(app)

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
    print('Dummy: change angle')

  # Toggle relay if present
  if 'relay' in turnout:
    if turnout['current'] == turnout['straight']:
      print('Toggle Relay Off')
    else:
      print('Toggle Relay On')

  # save all keys
  for key in request.json:
    turnout[key] = request.json.get(key, turnout[key])

  print('turnout', turnout)
  with open(path, 'w') as turnout_file:
        json.dump(data, turnout_file)

  return jsonify(turnout)

if __name__ == '__main__':
    app.run(host='0.0.0.0')

