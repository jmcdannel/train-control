import os
from flask import json, jsonify, abort, request
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']
arduino = None
path = os.path.dirname(__file__) + '/../../src/config/' + layoutId + '.locos.json'


def get(loco_id=None):
  with open(path) as loco_file:
    data = json.load(loco_file)
  if loco_id is not None:
    loco = [loco for loco in data if loco['address'] == loco_id]
    
    if len(loco) == 0:
      abort(404)
    return jsonify(loco[0])
  else:
    return jsonify(data)

