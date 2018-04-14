from myapi import api #defined in __init__.py
from myapi import app #defined in __init__.py
from myapi import mongo #defined in __init__.py
# from myapi.resources.todo import Todo,TodoList
from myapi.resources.user import Login, Register
from myapi.resources.category import Category, CategoryList
from myapi.resources.video import VideoList, VideoUpload, VideoSearch, VideoListByUser, Video, Music, VideoProject
from myapi.resources.recommendation import Recommendation

# api.add_resource(TodoList, '/todos')
# api.add_resource(Todo, '/todos/<todo_id>')

api.add_resource(Login, '/user/login')
api.add_resource(Register, '/user/register')

api.add_resource(Category,'/category/<category_id>')
api.add_resource(CategoryList,'/category')

api.add_resource(VideoList,'/videos')
api.add_resource(VideoListByUser,'/videos/user/<username>')
api.add_resource(VideoSearch,'/video/search')
api.add_resource(VideoProject,'/video/create')

api.add_resource(Video,'/video/<video_id>')
api.add_resource(VideoUpload,'/video/upload')
api.add_resource(Music,'/video/music')

#The array of recommendations to record the specified fragment
api.add_resource(Recommendation,'/recommendation/<fragment_id>')

if __name__ == '__main__':

    #Setting up DB requirements
    with app.app_context():
        #mongo.db.court.ensure_index( [("name", ASCENDING), ("slug", ASCENDING)], unique=True )
        mongo.db.users.create_index("username", unique=True)
        mongo.db.categories.create_index("name",unique=True)
    app.run(host='0.0.0.0', port=8081, debug=True, threaded=True)
