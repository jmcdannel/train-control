import os
from flask import json, jsonify, abort
from config import config

appConfig = config.getConfig()

def get(layout_id, signal_id=None):
  path = os.path.dirname(__file__) + '/' + layout_id + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)
  if signal_id is not None:
    signal = [signal for signal in data if signal['signalId'] == signal_id]
    
    if len(signal) == 0:
      abort(404)
    return jsonify(signal[0])
  else:
    return jsonify(data)
