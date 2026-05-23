from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["carbonsetu"]

users_collection = db["users"]

analysis_collection = db["analysis"]