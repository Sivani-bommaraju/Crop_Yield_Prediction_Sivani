from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGODB_URI: str = ""
    DATABASE_NAME: str = "yieldsense_ai"

    JWT_SECRET: str = "CHANGE_THIS_LATER"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()