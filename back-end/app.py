from myapi import api #defined in __init__.py
from myapi import app #defined in __init__.py
from myapi import mongo #defined in __init__.py
from myapi.resources.foo import Foo
from myapi.resources.bar import Bar
from myapi.resources.todo import Todo,TodoList

api.add_resource(Foo, '/Foo', '/Foo/<string:id>')
api.add_resource(Bar, '/Bar', '/Bar/<string:id>')
api.add_resource(TodoList, '/todos')
api.add_resource(Todo, '/todos/<todo_id>')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)