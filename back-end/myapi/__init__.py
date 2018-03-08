from flask import Flask
from flask_restful import Api
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)
mongo = PyMongo(app)