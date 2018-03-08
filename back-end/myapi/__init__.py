from flask import Flask
from flask_restful import Api
from flask_pymongo import PyMongo

app = Flask(__name__)
api = Api(app)
mongo = PyMongo(app)