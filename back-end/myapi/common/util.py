from bson import json_util, ObjectId
import json

#We make this available to any resource that imports util.py
import pymongo.errors as mongoerr
from flask import request

def to_json(obj):
    return json.loads(json_util.dumps(obj))
    
def parse_body(body):
    return json.loads(body)