
from myapi import mongo #defined in __init__.py 
from flask import request
from flask_restful import abort, Api, Resource
import json
from myapi.common.util import to_json

def abort_if_todo_doesnt_exist(todo_id):
    todo = mongo.db.todos.find_one({"id":int(todo_id)})
    if todo == None:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

class Todo(Resource):
    def get(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        res = mongo.db.todos.find_one({"id":int(todo_id)})
        print res
        return to_json(res)

    def delete(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        res = mongo.db.todos.delete_one({"id":int(todo_id)})
        return {"message": "Deleted"}, 204

    def put(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        todo = json.loads(request.data)
        res = mongo.db.todos.update_one({"id":int(todo_id)}, {"$set":todo}) #update data
        return {"message": "Updated"}, 201

class TodoList(Resource):
    def get(self):
        res = mongo.db.todos.find()
        todos = []
        for todo in res:
            todos.append(todo)
        return to_json(todos)

    def post(self):
        todo = json.loads(request.data)
        try:
            res = mongo.db.todos.insert(todo)
        except PyMongo.errors.DuplicateKeyError:
            abort(400, message="Username already exists")
        return {"message": "Inserted with ID: " + str(res)}, 201