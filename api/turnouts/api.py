import os
from flask_cors import CORS
from flask import json, jsonify, request, abort


def get(layout_id, turnout_id=None):
  path = os.path.dirname(__file__) + '/' + layout_id + '.turnouts.json'
  with open(path) as turnout_file:
        data = json.load(turnout_file)
  if turnout_id is not None:
    turnout = [turnout for turnout in data if turnout['turnoutId'] == turnout_id]
    
    if len(turnout) == 0:
        abort(404)
    return jsonify(turnout[0])
  else:
    return jsonify(data)

def put(layout_id, turnout_id):
  path = os.path.dirname(__file__) + '/' + layout_id + '.turnouts.json'
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
