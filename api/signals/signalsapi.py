import os
from flask import json, jsonify, abort, request
from config import config

appConfig = config.getConfig()
layoutId = appConfig['layoutId']

def init():
  path = os.path.dirname(__file__) + '/' + layoutId + '.signals.json'
  with open(path) as signal_file:
    data = json.load(signal_file)

  for signal in data:
    cmd = '<Z 6%d %d %d>' % (signal['signalId'], signal['greenPin'], int('00000000', 2))
    print('DCC Command %s' % cmd)
    cmd = '<Z 7%d %d %d>' % (signal['signalId'], signal['redPin'], int('00000100', 2))
    print('DCC Command %s' % cmd)

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
    signal[key] = request.json.get(key, signal[key])

  state = 0
  signalId = signal['signalId']
  if 'state' in signal:
    state = signal['state']

  cmd = '<Z %d %d>' % (signalId, state)
  print('DCC Command %s' % cmd)

  

    # int('00100001', 2)
  
  # save all keys
  
  with open(path, 'w') as signal_file:
        json.dump(data, signal_file)

  return jsonify(signal)
