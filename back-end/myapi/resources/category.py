from myapi import mongo #defined in __init__.py
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import *

def abort_if_category_doesnt_exist(todo_id):
    todo = mongo.db.categories.find_one({"id":int(todo_id)})
    if todo == None:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

class Category(Resource):
    def get(self, category_id):
        abort_if_category_doesnt_exist(category_id)
        res = mongo.db.categories.find_one({"id":int(todo_id)})
        return to_json(res)



def fillCategories():
    categories = ["Health", "Relationships", "Losing a loveone", "Bullying"]
    for cat in categories:
        mongo.db.categories.insert({"name":cat})


class CategoryList(Resource):
    def post(self):        
        category = parse_body(request.data)
        try:
            res = mongo.db.categories.insert(category)
        except mongoerr.DuplicateKeyError:
            return {"message": "Category already exists"}, 404
        return {"message": "Successfully added"}, 201

    def get(self):
        res = mongo.db.categories.find()
        return to_json(res)
