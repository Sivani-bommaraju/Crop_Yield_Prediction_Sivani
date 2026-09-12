from pymongo import MongoClient
from app.config.config import settings
import certifi

client = MongoClient(
    settings.MONGODB_URI,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000
)

db = client[settings.DATABASE_NAME]