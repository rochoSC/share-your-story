from myapi import mongo #defined in __init__.py 
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *


def abort_if_category_doesnt_exist(todo_id):
    todo = mongo.db.videos.find_one({"id":int(todo_id)})
    if todo == None:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

class VideoList(Resource):
    def get(self):
        res = to_json(mongo.db.videos.find({"published":True}).sort([("category",1)]))
        listVideos = {}
        for video in res:
            if not(video["category"] in listVideos):
                listVideos[video["category"]]=[]
            listVideos[video["category"]].append(video)
        return listVideos
    