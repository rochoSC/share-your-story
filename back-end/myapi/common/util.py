from bson import json_util, ObjectId
import json

def to_json(obj):
    return json.loads(json_util.dumps(obj))