from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *

def fillRecommendations():
    recommendationsDic = [
        {
            "fragmentId" : 1,
            "recommendations":[ "Introduce yourself", 
            "Tell us something about you to create empathy",
            "Who are you?",
            "Where are you from?"
            ],
            "title": "Introduction"
        },
        {
            "fragmentId" : 2,
            "recommendations":[
            "Tell us what happened?",
            "How did  you feel when you knew about the situation?"
            "What was  your reactions?"
            ],
            "title": "Talk about the situation you overcome"
        },
        {
            "fragmentId" : 3,
            "recommendations":[
            "What was your strategy to overcome this situation?",            
            "Did you go with an specialist?",
            "What difficulties you faced during this time?"
            ],
            "title": "How did you overcome?"
        },
        {
            "fragmentId" : 4,
            "recommendations":[
            "What's the best advice could you give to other people facing the same situation",
            "How is your life now?"            
            ],
            "title": ""
        },
        {
            "fragmentId" : 5,
            "recommendations":[
            "Say:'If I could make it, you can make it'"
            ],
            "title": "Climax"
        }
    ]


    for rec in recommendationsDic:
        mongo.db.recommendations.insert_one(rec);

class Recommendation(Resource):
    def get(self, fragment_id):                
        recommendation = mongo.db.recommendations.find_one({"fragmentId":int(fragment_id)})
        if recommendation == None:
            return {"message": "The recommendation for that fragment does not existst"}, 404
        return to_json(recommendation)
