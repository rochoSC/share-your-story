from myapi import mongo #defined in __init__.py 
from flask_restful import abort, Api, Resource
from myapi.common.util import *

class Login(Resource):
    def post(self):
        login = parse_body(request.data) 
        user = mongo.db.users.find_one({"username":login["username"], "password":login["password"]}) #update data
        if user == None:
            abort(404, message="The username does not exist or the password is incorrect")
        return {"message": "Logged in"}, 200

class Register(Resource):
    def post(self):
        register = parse_body(request.data)
        try:
            res = mongo.db.users.insert(register)
        except mongoerr.DuplicateKeyError:
            abort(400, message="Username already exists")    
            
        return {"message": "Successfully logged in"}, 201