# 🌾 YieldSense AI

### Crop Yield Prediction & Agricultural Productivity Forecasting System

YieldSense AI is an intelligent agriculture platform designed to help farmers make data-driven decisions using Machine Learning, weather analysis, soil analysis, crop recommendation, and agricultural analytics.

The system predicts crop yield based on agricultural and environmental factors, analyzes weather and soil conditions, recommends suitable crops, and provides an analytics dashboard with productivity insights.

---

## 🚀 Features

### 🌱 Crop Yield Prediction
- Predicts expected crop yield using Machine Learning.
- Uses crop, season, state, crop year, rainfall, fertilizer, pesticide, temperature, and soil parameters.
- Uses a Random Forest Regressor for yield prediction.

### 🌾 Crop Recommendation
Recommends suitable crops using:
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- Soil pH
- Rainfall

Uses a Random Forest Classifier.

### 🌦️ Weather Analysis
Provides:
- Temperature
- Feels-like temperature
- Humidity
- Wind speed
- Rainfall
- Weather condition

Weather information is retrieved based on the farmer's registered agricultural location using the OpenWeather API.

### 🪨 Soil Analysis
Analyzes:
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- pH

The system calculates a soil quality score and provides agricultural insights.

### 📊 Analytics Dashboard
Provides:
- Predicted yield
- Crop productivity
- Historical crop performance
- Weather impact
- Soil analysis
- Risk indicators
- Productivity score
- Seasonal trends
- Crop-wise performance
- Agricultural insights

### 👨‍🌾 Farmer Management
Farmers can:
- Register
- Login
- Manage their profile
- Store farm information
- Select preferred crops
- View yield predictions
- View crop recommendations
- Access analytics

### 🔐 Authentication
- JWT authentication
- Password hashing
- Role-based access
- Farmer, Admin, and Officer roles

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Farmer         │
                    │   Web Application   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │   Tailwind CSS      │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌────────────┐    ┌─────────────┐   ┌─────────────┐
      │ ML Models  │    │   MongoDB   │   │ OpenWeather │
      │            │    │             │   │     API     │
      └────────────┘    └─────────────┘   └─────────────┘
             │
      ┌──────┴────────────┐
      │                   │
      ▼                   ▼
Yield Prediction     Crop Recommendation
```

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript
- Axios
- Lucide React

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- JWT
- Passlib
- Bcrypt

### Database
- MongoDB
- MongoDB Atlas

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- Joblib

### External Services
- OpenWeather API
- Firebase

### Deployment
- Docker
- Docker Compose
- Nginx
- Render

### Version Control
- Git
- GitHub

---

## 📁 Project Structure

```text
Crop_Ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin.py
│   │   │   ├── analytics.py
│   │   │   ├── auth.py
│   │   │   ├── farmer.py
│   │   │   ├── officer.py
│   │   │   ├── prediction.py
│   │   │   ├── weather.py
│   │   │   └── crop_recommendation.py
│   │   │
│   │   ├── models/
│   │   │   ├── yield_model.pkl
│   │   │   └── crop_recommendation_model.pkl
│   │   │
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── config/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── data/
│   │   ├── state_weather_data.csv
│   │   ├── state_soil_data.csv
│   │   └── crop_yield_data.csv
│   │
│   ├── firebase/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .env
│
├── ML/
│   ├── datasets/
│   │   ├── Crop Yeild Data.csv
│   │   ├── crop_yield.csv
│   │   ├── Soil data.csv
│   │   ├── state_soil_data.csv
│   │   ├── state_weather_data_1997_2020.csv
│   │   └── Crop_recommendation.csv
│   │
│   └── model/
│
├── .dockerignore
├── docker-compose.yml
└── README.md
```

---

## 🧠 Machine Learning

YieldSense AI contains two major Machine Learning components:

1. Crop Yield Prediction
2. Crop Recommendation

### Crop Yield Prediction

**Model:** Random Forest Regressor

The model was trained using agricultural, soil, and weather datasets.

Features include:

```text
Crop
Season
State
Crop Year
Annual Rainfall
Fertilizer
Pesticide
Average Temperature
Maximum Temperature
Minimum Temperature
Nitrogen
Phosphorus
Potassium
pH
```

### Model Performance

| Metric | Score |
|---|---:|
| MAE | 10.15 |
| RMSE | 141.68 |
| R² Score | 0.9749 |

### XGBoost Model

An XGBoost regression model was also evaluated.

| Metric | Score |
|---|---:|
| MAE | 12.73 |
| RMSE | 182.84 |
| R² Score | 0.9583 |

The Random Forest model performed better on the evaluated dataset and is used for the main yield prediction pipeline.

### Crop Recommendation

**Model:** Random Forest Classifier

Features:

```text
N
P
K
temperature
humidity
ph
rainfall
label
```

Accuracy:

```text
99.55%
```

Model:

```text
backend/app/models/crop_recommendation_model.pkl
```

---

## 🔄 Application Workflow

### Farmer Registration

```text
Farmer
   ↓
Register
   ↓
Create Account
   ↓
Login
   ↓
Farmer Dashboard
```

### Yield Prediction

```text
Farmer Profile
      ↓
Farm Information
      ↓
Crop + Season + Year
      ↓
Weather Data
      ↓
Soil Data
      ↓
Machine Learning Model
      ↓
Predicted Yield
      ↓
Analytics Dashboard
```

### Crop Recommendation

```text
Farmer Profile
      ↓
Soil Information
      ↓
Weather Information
      ↓
N / P / K / pH
      ↓
Random Forest Classifier
      ↓
Recommended Crops
```

---

## 📡 API Endpoints

### Health Check

```http
GET /
```

Response:

```json
{
  "message": "Welcome to YieldSense AI API"
}
```

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Farmer

```http
GET /farmer/profile
PUT /farmer/profile
```

### Prediction

```http
POST /prediction/predict
GET /farmer/recommendations
```

### Analytics

```http
GET /analytics/dashboard
```

Example:

```text
/analytics/dashboard?period=6%20Months
```

### API Documentation

```text
http://localhost:8000/docs
```

---

## 🗄️ Database

YieldSense AI uses MongoDB to store application data.

Major collections include:

```text
users
farmer_profiles
predictions
```

Farmer-specific predictions and analytics are associated with authenticated users.

---

## 🌦️ Weather Integration

The application integrates weather information using the OpenWeather API.

Weather information includes:

```text
Temperature
Feels-like Temperature
Humidity
Rainfall
Wind Speed
Weather Condition
```

Weather data is retrieved based on the farmer's registered agricultural location.

---

## 🪨 Soil Analysis

Soil analysis uses:

```text
Nitrogen (N)
Phosphorus (P)
Potassium (K)
pH
```

These parameters are used to calculate a soil quality score and generate agricultural insights.

---

## 📊 Analytics Engine

The analytics system combines historical agricultural data, soil information, weather information, and prediction history.

```text
Historical Agricultural Data
          +
Weather Data
          +
Soil Data
          +
Prediction History
          ↓
    Analytics Engine
          ↓
 ┌────────┼────────┐
 ↓        ↓        ↓
Yield   Weather   Soil
 ↓        ↓        ↓
Crop Performance
 ↓
Risk & Productivity Insights
```

The analytics system uses the farmer's primary crop information when calculating crop-specific productivity.

---

## 🐳 Docker

YieldSense AI is containerized using Docker.

The project contains separate Docker configurations for the frontend and backend.

### Backend Docker

The backend image contains:

- FastAPI application
- Python dependencies
- Machine Learning models
- ML datasets
- Backend data files
- Firebase configuration

### Frontend Docker

The frontend uses a multi-stage Docker build:

```text
Node.js
   ↓
Install Dependencies
   ↓
Build React Application
   ↓
Nginx
   ↓
Production Frontend
```

---

## ▶️ Run with Docker Compose

Make sure Docker Desktop is installed and running.

From the project root:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

## ⏹️ Stop Docker Containers

```bash
docker compose down
```

---

## 🔄 Start Existing Containers

```bash
docker compose up
```

---

## 🏗️ Rebuild Containers

Whenever Dockerfiles or dependencies are modified:

```bash
docker compose up --build
```

---

## ⚙️ Environment Variables

Sensitive environment variables are not included in the repository.

### Backend

Create:

```text
backend/.env
```

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Add any other backend environment variables required by the application.

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

For production:

```env
VITE_API_URL=https://your-backend-service.onrender.com
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

Vite environment variables are embedded into the frontend during the production build.

---

## 🔐 Security

Sensitive configuration files should never be committed to GitHub.

Keep the following files private:

```text
backend/.env
frontend/.env
firebase/serviceAccountKey.json
```

Recommended `.gitignore` entries:

```gitignore
.env
*.env
serviceAccountKey.json

__pycache__/
*.pyc

venv/
.venv/

node_modules/
dist/
```

Never expose:

- MongoDB credentials
- JWT secrets
- API keys
- Firebase service-account credentials

---

## 🧪 Run Without Docker

### Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🧠 Machine Learning Pipeline

```text
Dataset
   ↓
Data Cleaning
   ↓
Data Preprocessing
   ↓
Feature Selection
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Model Serialization
   ↓
FastAPI Integration
   ↓
Frontend Prediction
```

---

## 📚 Datasets

The project uses multiple agricultural datasets.

### Crop Yield Dataset

Contains historical crop and yield information.

### Soil Dataset

Contains soil characteristics including:

```text
Nitrogen
Phosphorus
Potassium
pH
```

### Weather Dataset

Contains historical weather information including:

```text
Temperature
Rainfall
```

### Crop Recommendation Dataset

Contains:

```text
N
P
K
Temperature
Humidity
pH
Rainfall
Crop Label
```

---

## 🤖 Model Integration

### Yield Prediction Model

```text
backend/app/models/yield_model.pkl
```

### Crop Recommendation Model

```text
backend/app/models/crop_recommendation_model.pkl
```

The FastAPI backend loads the trained models during prediction requests and returns the generated results to the frontend.

---

## 📈 Key Highlights

- End-to-end Machine Learning application
- Crop yield prediction
- Crop recommendation
- Real-time weather integration
- Soil quality analysis
- Farmer-specific analytics
- Historical agricultural analysis
- Productivity insights
- Risk indicators
- JWT authentication
- Role-based authorization
- MongoDB database
- React dashboard
- FastAPI REST API
- Dockerized frontend and backend
- Nginx production frontend
- Deployment-ready architecture

---

## 🎯 Objectives

The main objectives of YieldSense AI are:

1. Predict crop yield using historical agricultural data.
2. Analyze weather conditions affecting crop productivity.
3. Evaluate soil suitability for agriculture.
4. Recommend suitable crops based on environmental conditions.
5. Provide farmers with actionable agricultural insights.
6. Centralize agricultural predictions and analytics in a single platform.
7. Develop an ML-powered agricultural decision-support system.

---

## 🔮 Future Enhancements

- Satellite imagery integration
- Crop disease detection using Computer Vision
- Pest prediction
- Irrigation recommendations
- Fertilizer recommendations
- Advanced weather forecasting
- Multi-language support
- Mobile application
- Time-series yield forecasting
- IoT sensor integration
- Agricultural market-price prediction
- Explainable AI for model predictions

---

## ☁️ Deployment

YieldSense AI is designed for Docker-based deployment.

Recommended production architecture:

```text
                         GitHub
                           │
                           ▼
                         Render
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
     Backend Web Service         Frontend Web Service
             │                           │
             ▼                           ▼
      FastAPI + ML Models          React + Nginx
             │
             ▼
        MongoDB Atlas
```

The backend and frontend can be deployed as separate Render Web Services using their respective Dockerfiles.

---

## 🌐 Production Configuration

### Backend Environment Variables

Configure the required variables in Render:

```env
MONGO_URI=your_production_mongodb_uri
JWT_SECRET_KEY=your_production_secret
```

Add any other backend environment variables required by the application.

### Frontend Environment Variables

Configure:

```env
VITE_API_URL=https://your-backend-service.onrender.com
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

The frontend Docker build uses these variables during the Vite production build.

---

## 📝 Git Commands

Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

Enter the project:

```bash
cd Crop_Ai
```

Check status:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update YieldSense AI"
```

Push:

```bash
git push origin main
```

---

## 👩‍💻 Author

**Sivani Bommaraju**

B.Tech Computer Science and Engineering  
VIT-AP University

---

## 📜 License

This project is developed for academic and educational purposes.

---

## ⭐ Project Summary

YieldSense AI is an end-to-end agricultural decision-support platform that combines Machine Learning, weather analysis, soil analysis, crop recommendation, predictive analytics, and a modern web application.

The platform aims to help farmers make more informed decisions about crop selection and expected agricultural productivity.

```text
🌾 Farmer
   ↓
📋 Farm Profile
   ↓
🌦️ Weather + 🪨 Soil + 🌱 Crop Data
   ↓
🤖 Machine Learning
   ↓
📈 Yield Prediction
   ↓
🌾 Crop Recommendation
   ↓
📊 Agricultural Analytics
   ↓
💡 Data-Driven Agricultural Insights
```
