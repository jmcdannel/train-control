import os
from flask_cors import CORS
from flask import Flask
from turnouts import api as tunroutsApi

app = Flask(__name__)
cors = CORS(app)

@app.route('/turnouts', methods=['GET'])
def turnouts():
  return tunroutsApi.get()

@app.route('/turnouts/<int:turnout_id>', methods=['GET'])
def get_turnout(turnout_id):
  return tunroutsApi.get(turnout_id)

@app.route('/turnouts/<int:turnout_id>', methods=['OPTIONS', 'PUT'])
def update_turnout(turnout_id):
  return tunroutsApi.put(turnout_id)

if __name__ == '__main__':
    app.run(host='localhost')
