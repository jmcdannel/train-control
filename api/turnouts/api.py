import os
from flask_cors import CORS
from flask import json, jsonify, request, abort

path = os.path.dirname(__file__) + '/cn.turnouts.json'

def get(turnout_id=None):
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  if turnout_id is not None:
    turnout = [turnout for turnout in data if turnout['turnoutId'] == turnout_id]
    
    if len(turnout) == 0:
        abort(404)
    return jsonify(turnout[0])
  else:
    return jsonify(data)

def put(turnout_id):
       
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  turnouts = [turnout for turnout in data if turnout['turnoutId'] == turnout_id]
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

  # save all keys
  for key in request.json:
    turnout[key] = request.json.get(key, turnout[key])
  with open(path, 'w') as turnout_file:
        json.dump(data, turnout_file)

  return jsonify(turnout)
