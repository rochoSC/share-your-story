from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *
import os
from myapi import app
from flask import send_from_directory
import time

def fillDb():
    for i in range(0,10):
        mongo.db.videos.insert_one({"published":True, "owner": "roger",
        "thumbnailUrl":"uploads/thumbnails/1_12_1523605878.24.png",
        "title": "This is my video " + str(i), "description":"This is my description of my video " +str(i)})
    for i in range(10,20):
        mongo.db.videos.insert_one({"published":False, "owner": "roger",
        "thumbnailUrl":"uploads/thumbnails/1_12_1523605878.24.png",
        "title": "This is my video " + str(i), "description":"This is my description of my video " +str(i)})

class VideoList(Resource):
    def get(self):
        res = to_json(mongo.db.videos.find({"published":True}).sort([("category",1)]))
        listVideos = {}
        for video in res:
            if not(video["category"] in listVideos):
                listVideos[video["category"]]=[]
            listVideos[video["category"]].append(video)
        return listVideos

class VideoListByUser(Resource):
    def get(self, username):
        res = mongo.db.videos.find({"published":True, "owner": username})
        videos = {}
        videos["published"] = []
        videos["incomplete"] = []
        for video in res:
            videos["published"].append(video)

        res = mongo.db.videos.find({"published":False, "owner": username})
        for video in res:
            videos["incomplete"].append(video)
        return to_json(videos)

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

        video_file_name = video_id + "_" + fragment_id + "_" + str(time.time()) + ".webm"
        thumbnail_file_name = video_id + "_" + fragment_id + "_" + str(time.time()) + ".png"
        video_path = os.path.join("uploads", "videos")
        video_path = os.path.join(video_path, video_file_name)
        thumbnail_path = os.path.join("uploads", "thumbnails")
        thumbnail_path = os.path.join(thumbnail_path, thumbnail_file_name)

        if video_file:
            video_file.save(video_path)
            print "Video fragment saved at" + video_path
            thumbnail_file.save(thumbnail_path)
            print "Thumbnail fragment saved at" + thumbnail_path

            video = mongo.db.videos.find_one({"videoId":int(video_id)})
            if video is not None:
                #TODO: Delete fragmentId if already exists on video
                print "========================================================="
                print fragment_id
                mongo.db.videos.update({"videoId":int(video_id)},{ "$pull": { "fragments": { "fragmentId": int(fragment_id) } } });
                res = mongo.db.videos.update_one({"videoId":int(video_id)},{ "$push": { "fragments": {
                    "fragmentId": int(fragment_id), "videoUrl": video_path.replace('\\', '/'), "thumbnailUrl":thumbnail_path.replace('\\', '/')
                } } });
                return {"message": "The file has been uploaded"}, 201
            else:
                return {"message": "The associated video does not exist in DB"}, 404
        else:
            return {"message": "File is empty"}, 400
