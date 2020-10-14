import os
from flask import json, jsonify, request, abort

path = os.path.dirname(__file__) + '/layouts.json'

def get(layout_id=None):
  with open(path) as layout_file:
        data = json.load(layout_file)
  if layout_id is not None:
    layout = [layout for layout in data if layout['layoutId'] == layout_id]
    
    if len(layout) == 0:
        abort(404)
    return jsonify(layout[0])
  else:
    return jsonify(data)

  return jsonify(layout)
