import os
import sys
import logging
from flask_cors import CORS
from flask import Flask, json
from turnouts import turnoutsapi
from layouts import layoutsapi
from config import config

app = Flask(__name__)
cors = CORS(app)
host = config.getHost()
logging.getLogger('flask_cors').level = logging.DEBUG
turnoutsapi.init('tam')

# Layouts
@app.route('/layouts', methods=['GET'])
def layouts():
  return layoutsapi.get()
  
# Turnouts
@app.route('/layouts/<string:layout_id>', methods=['GET'])
def get_layout(layout_id):
  return layoutsapi.get(layout_id)

@app.route('/layouts/<string:layout_id>/turnouts', methods=['GET'])
def turnouts(layout_id):
  return turnoutsapi.get(layout_id)

@app.route('/layouts/<string:layout_id>/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(layout_id, turnout_id):
  return turnoutsapi.get(layout_id. turnout_id)

@app.route('/layouts/<string:layout_id>/turnouts/<int:turnout_id>', methods=['PUT'])
def update_turnout(layout_id, turnout_id):
  return turnoutsapi.put(layout_id, turnout_id)

# Signals

# Effects

if __name__ == '__main__':
    app.run(host=host)
    # app.run(host='0.0.0.0')
