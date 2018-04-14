from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *

def fillRecommendations():
    for i in range(0,5):
        mongo.db.recommendations.insert_one({"fragmentId" : i+1,
        "recommendations" : [
                "This is a recommendation 1",
                "This is a recommendation 2",
                "This is a recommendation 3"
        ],
        "title" : "Title for fragment " + str(i+1)});

class Recommendation(Resource):
    def get(self, fragment_id):
        recommendation = mongo.db.recommendations.find_one({"fragmentId":int(fragment_id)})
        if recommendation == None:
            return {"message": "The recommendation for that fragment does not existst"}, 404
        return to_json(recommendation)
