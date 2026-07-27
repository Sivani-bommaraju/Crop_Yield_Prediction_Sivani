from pymongo import MongoClient
from app.config.config import settings
import certifi

client = MongoClient(
    settings.MONGODB_URI,
    tlsCAFile=certifi.where()
)

db = client[settings.DATABASE_NAME]