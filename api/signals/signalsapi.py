import os
from flask import json, jsonify, abort, request
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']

def get(signal_id=None):
  path = os.path.dirname(__file__) + '/' + layoutId + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)
  if signal_id is not None:
    signal = [signal for signal in data if signal['signalId'] == signal_id]
    
    if len(signal) == 0:
      abort(404)
    return jsonify(signal[0])
  else:
    return jsonify(data)

def put(signal_id):
  path = os.path.dirname(__file__) + '/' + layoutId + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)
  signals = [signal for signal in data if signal['signalId'] == signal_id]


  # validate
  if len(signals) == 0:
    abort(404)
  if not request.json:
    abort(400)

  signal = signals[0]
  for key in request.json:
    turnout[key] = request.json.get(key, turnout[key])

  state = 0
  signalId = signal['signalId']
  if 'state' in signal and signal['state'] is True:
    state = 1

  cmd = '<Z %d %d>' % (signalId, state)
  print('DCC Command %s' % cmd)

  

    # int('00100001', 2)
