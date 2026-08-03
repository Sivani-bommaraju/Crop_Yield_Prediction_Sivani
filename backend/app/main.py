from fastapi import FastAPI
from app.api.farmer import router as farmer_router
from app.api.health import router as health_router
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.admin import router as admin_router
from app.api.officer import router as officer_router
from app.api.prediction import router as prediction_router

app = FastAPI(
    title="YieldSense AI",
    version="1.0.0",
    description="Crop Yield Prediction & Agricultural Productivity Forecasting System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(farmer_router)
app.include_router(admin_router)
app.include_router(officer_router)
app.include_router(prediction_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to YieldSense AI API"
    }