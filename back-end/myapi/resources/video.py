from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *
import os
from myapi import app
from flask import send_from_directory
import time

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

        if 'videoFile' not in request.files:
            return {"message": "Video file not found in the request"}, 400
        if 'thumbnailFile' not in request.files:
            return {"message": "Thumbnail file not found in the request"}, 400
        if 'fragmentId' not in request.form:
            return {"message": "Fragment ID is required"}, 400
        if 'videoId' not in request.form:
            return {"message": "Video ID is required"}, 400

        video_file = request.files["videoFile"]
        thumbnail_file = request.files["thumbnailFile"]
        video_id = request.form["videoId"]
        fragment_id = request.form["fragmentId"]

        #TODO: Generate filename with date
        video_file_name = video_id + "_" + fragment_id + "_" + str(time.time()) + ".webm"
        thumbnail_file_name = video_id + "_" + fragment_id + "_" + str(time.time()) + ".png"
        video_path = os.path.join("uploads", "videos")
        video_path = os.path.join(video_path, video_file_name)
        thumbnail_path = os.path.join("uploads", "thumbnails")
        thumbnail_path = os.path.join(thumbnail_path, thumbnail_file_name)

        #TODO: Create unique secure_filename
        #TODO: Add video URL to video frament etc in mongo
        if video_file:
            video_file.save(video_path)
            print "Video fragment saved at" + video_path
            thumbnail_file.save(thumbnail_path)
            print "Thumbnail fragment saved at" + thumbnail_path

            video = mongo.db.videos.find_one({"videoId":int(video_id)})
            if video is not None:
                #TODO: Receive thumbnail
                #TODO: Set fragmentID (question), videoFragmentUrl, thumbnailUrl
                res = mongo.db.videos.update_one({"videoId":int(video_id)},{ "$push": { "fragments": {
                    "fragmentId": int(fragment_id), "videoUrl": video_path, "thumbnailPath":thumbnail_path
                } } })
                return {"message": "The file has been uploaded"}, 201
            else:
                return {"message": "The associated video does not exist in DB"}, 404
        else:
            return {"message": "File is empty"}, 400
