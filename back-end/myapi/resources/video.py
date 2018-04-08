from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *
import os
from myapi import app
from flask import send_from_directory

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
        
class VideoSearch(Resource):
    def get(self):
        
        search = request.args.get("keys") 
        print search
        term = ".*"+search+".*" ##cuidar con mas palabras
        print term
        res = to_json(mongo.db.videos.find({"published":True , "title": {"$regex": term}}).sort([("category",1)]))
        listVideos = {}
        for video in res:
            if not(video["category"] in listVideos):
                listVideos[video["category"]]=[]
            listVideos[video["category"]].append(video)
        print "Algo",listVideos
        return listVideos

class VideoUpload(Resource):

    #Saves the video in our file system
    def post(self):

        # check if the post request has the file part

        if 'file' not in request.files:
            return {"message": "File not found in the request"}, 400
        if 'file_name' not in request.form:
            return {"message": "File name is missing"}, 400
        if 'video_id' not in request.form:
            return {"message": "Video ID is required"}, 400

        file = request.files['file']
        file_name = request.form['file_name']
        video_id = request.form['video_id']

        #TODO: Create unique secure_filename
        #TODO: Add video URL to video frament etc in mongo
        if file:
            path_to_save = os.path.join("uploads", "videos")
            path_to_save = os.path.join(path_to_save, file_name)
            print "File saved at: Saving at " + path_to_save
            file.save(path_to_save)
            video = mongo.db.videos.find_one({"_id":video_id})
            if video is not None:
                res = mongo.db.videos.update_one({"_id":video_id},{ "$push": { "fragments": path_to_save } })
                return {"message": "The file has been uploaded"}, 201
            else:
                return {"message": "The associated video does not exist in DB"}, 404
        else:
            return {"message": "File is empty"}, 400
