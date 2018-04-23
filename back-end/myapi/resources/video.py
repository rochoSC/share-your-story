from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *
import os
from myapi import app
from flask import send_from_directory
import time
from bson.objectid import ObjectId
import subprocess
from flask import jsonify

def fillCategories():
    categories = ["Health", "Relationships", "Losing a loveone", "Bullying"]
    for cat in categories:
        mongo.db.categories.insert({"name":cat})


class VideoList(Resource):
    def get2(self):
        res = to_json(mongo.db.videos.find({"published":True}).sort([("category",1)]))
        listVideos = {}
        for video in res:
            if not(video["category"] in listVideos):
                listVideos[video["category"]]=[]
            listVideos[video["category"]].append(video)
        return listVideos

    def get(self):
        cats = to_json(mongo.db.categories.find())
        listVideos={}
        for cat in cats:
            cur = mongo.db.videos.find({"published":True,"category":cat["_id"]["$oid"]})
            if(cur.count()>0):
                listVideos[cat["name"]] = [x for x in to_json(cur)]
        return listVideos

        #res = to_json(mongo.db.videos.find({"published":True}).sort([("category",1)]))
        # listVideos = {}
        # for video in res:
        #     if not(video["category"] in listVideos):
        #         listVideos[video["category"]]=[]
        #     listVideos[video["category"]].append(video)
        # return listVideos

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

class Video(Resource):
    def get(self, video_id):
        video = to_json(mongo.db.videos.find_one({"_id":ObjectId(video_id)}))

        video_file_name = video_id + "_" + str(time.time()) + ".webm"
        video_path = os.path.join("uploads", "videos")
        video_path = os.path.join(video_path, "published")
        video_path = os.path.join(video_path, video_file_name)
        #Generate a single video
        ffmpeg_command = ["ffmpeg", "-f", "concat", "-safe", "0", "-i", "videosToConcat.txt", "-c", "copy", video_path]
        video_list_files  = open("videosToConcat.txt", "w")
        for fragment in video["fragments"]:
            #ffmpeg_command.append(fragment["videoUrl"].replace('/', '\\'))
            #video_list_files.write("file '" + fragment["videoUrl"].replace('/', '\\') +"'\n")
            video_list_files.write("file '" + fragment["videoUrl"] +"'\n")
        video_list_files.close()
        subprocess.call(ffmpeg_command)

        mongo.db.videos.update_one({"_id":ObjectId(video_id)},{ "$set": {"url": video_path.replace('\\', '/')} } )
        video = to_json(mongo.db.videos.find_one({"_id":ObjectId(video_id)}))
        return video

class Music(Resource):
    def get(self):
        return to_json(["uploads/music/Anton_Khoryukov_-_The_Moment_Of_Light.mp3", "uploads/music/Lee_Rosevere_-_You're_Enough.mp3",
         "uploads/music/Yan_Terrien_-_Male_Washrooms.mp3"])

class VideoSearch(Resource):
    def get(self):
        search = request.args.get("keys")
        print search
        term = ".*"+search+".*" ##cuidar con mas palabras
        print term
        res = to_json(mongo.db.videos.find({"published":True , "title": {"$regex": term}}).sort([("category",1)]))
        listVideos = {}                 
        for video in res:
            cat = to_json(mongo.db.categories.find({"_id":ObjectId(video["category"])}))            
            categoryName = cat[0]["name"]
            if not(categoryName in listVideos):
                listVideos[categoryName]=[]
            listVideos[categoryName].append(video)
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
        video_path = os.path.join(video_path, "fragments")
        video_path = os.path.join(video_path, video_file_name)
        thumbnail_path = os.path.join("uploads", "thumbnails")
        thumbnail_path = os.path.join(thumbnail_path, "fragments")
        thumbnail_path = os.path.join(thumbnail_path, thumbnail_file_name)

        if video_file:
            video_file.save(video_path)
            print "Video fragment saved at" + video_path
            thumbnail_file.save(thumbnail_path)
            print "Thumbnail fragment saved at" + thumbnail_path

            video = mongo.db.videos.find_one({"_id":ObjectId(video_id)})
            if video is not None:
                mongo.db.videos.update({"_id":ObjectId(video_id)},{ "$pull": { "fragments": { "fragmentId": int(fragment_id) } } });
                res = mongo.db.videos.update_one({"_id":ObjectId(video_id)},{ "$push": { "fragments": {
                    "$each": [{
                        "fragmentId": int(fragment_id), "videoUrl": video_path.replace('\\', '/'), "thumbnailUrl":thumbnail_path.replace('\\', '/')
                    }],
                    "$sort": {"fragmentId":1}
                } } });
                return {"message": "The file has been uploaded"}, 201
            else:
                return {"message": "The associated video does not exist in DB"}, 404
        else:
            return {"message": "File is empty"}, 400

class VideoPublish(Resource):
    def post(self):
        # check if the post request has the file part

        if 'thumbnailFile' not in request.files:
            return {"message": "Thumbnail file not found in the request"}, 400
        if 'videoId' not in request.form:
            return {"message": "Video ID is required"}, 400

        thumbnail_file = request.files["thumbnailFile"]
        video_id = request.form["videoId"]

        thumbnail_file_name = video_id + "_" + "_" + str(time.time()) + ".png"
        thumbnail_path = os.path.join("uploads", "thumbnails")
        thumbnail_path = os.path.join(thumbnail_path, "published")
        thumbnail_path = os.path.join(thumbnail_path, thumbnail_file_name)

        if thumbnail_file:
            thumbnail_file.save(thumbnail_path)
            print "Thumbnail video saved at" + thumbnail_path
            to_update = { "thumbnailUrl":thumbnail_path, "published": True};

            if "backgroundMusicUrl" in request.form:
                to_update["backgroundMusicUrl"] = request.form["backgroundMusicUrl"]
            if "effect" in request.form:
                to_update["effect"] = request.form["effect"]

            video = mongo.db.videos.find_one({"_id":ObjectId(video_id)})
            if video is not None:
                mongo.db.videos.update_one({"_id":ObjectId(video_id)},{ "$set": to_update});
                return {"message": "The file has been uploaded"}, 201
            else:
                return {"message": "The associated video does not exist in DB"}, 404
        else:
            return {"message": "File is empty"}, 400

class VideoProject(Resource):
    def post(self):
        project = parse_body(request.data)
        print project
        if not("id" in project.keys()) or (project["id"]==""):
            #todo insert
            try:
                res = mongo.db.videos.insert(project)
            except mongoerr.DuplicateKeyError:
                return {"message" : "Project already existst"}, 404
        else:
            #todo update
            id = project.pop("id")
            projec.pop("fragments")
            res = mongo.db.videos.update({"_id":ObjectId(id)},project)
            res = mongo.db.videos.find({"_id":ObjectId(id)})
            res = id
        # res = mongo.db.videos.find({"user_id":project["user_id"], "title":project["title"]})
        # print(res)
        return {"projectId":str(res)},201

class Project(Resource):
    def get(self, project_id):
        return to_json(mongo.db.videos.find({"_id":ObjectId(project_id)}))
    # def get(self):
    #     print "Hola Mundo"
    #     #fillCategories()

class DestroyProject(Resource):
    def post(self):
        project = parse_body(request.data)
        print project
        mongo.db.videos.remove({"_id": ObjectId(project["id"])})
