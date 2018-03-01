from flask import Flask
from flask import request
from flask_restful import abort, Api, Resource
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
import json

app = Flask(__name__)
mongo = PyMongo(app)
api = Api(app)


#NOTES FOR TESTING:
#Make sure postman has the headers Content-Type = application/json
#The object prototype for testing its like this
#{"task":"new task", "category":"groceries", "id":1}


#Hanldes BSON objects from mongo. Like the ObjectID('bhjasdjnkdsabhksadlkndsa') Created by mongodb
def to_json(obj):
    return json.loads(json_util.dumps(obj))

def abort_if_todo_doesnt_exist(todo_id):
    todo = mongo.db.todos.find_one({"id":int(todo_id)})
    if todo == None:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

# Todo
# shows a single todo item and lets you delete a todo item
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


# TodoList
# shows a list of all todos, and lets you POST to add new tasks
class TodoList(Resource):
    def get(self):
        res = mongo.db.todos.find()
        todos = []
        for todo in res:
            todos.append(todo)
        return to_json(todos)

    def post(self):
        todo = json.loads(request.data)
        res = mongo.db.todos.insert(todo) 
        return {"message": "Inserted with ID: " + str(res)}, 201

## 
## Actually setup the Api resource routing here
##
api.add_resource(TodoList, '/todos')
api.add_resource(Todo, '/todos/<todo_id>')


if __name__ == '__main__':
    app.run(debug=True, port = 8081, host="0.0.0.0")