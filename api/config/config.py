import os
from flask import json

def getHost():
    pathLocal = os.path.dirname(__file__) + '/../../src/config/config.local.json'
    pathDefault = os.path.dirname(__file__) + '/../../src/config/config.default.json'
    try:
        with open(pathLocal) as local_config:
            localConfigData = json.load(local_config)
        return localConfigData['apiHost']
    except:
        with open(pathDefault) as default_config:
            defaultConfigData = json.load(default_config)
        return defaultConfigData['apiHost']
