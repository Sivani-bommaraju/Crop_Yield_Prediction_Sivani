import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

YIELD_DATA_PATH = os.path.join(
    BASE_DIR, "datasets", "raw", "Crop Yeild Data.csv"
)

SOIL_DATA_PATH = os.path.join(
    BASE_DIR, "datasets", "raw", "state_soil_data.csv"
)

MODEL_PATH = os.path.join(
    BASE_DIR, "model", "yield_model_small.pkl"
)


print("Loading datasets...")

yield_data = pd.read_csv(YIELD_DATA_PATH)
soil_data = pd.read_csv(SOIL_DATA_PATH)

print("Yield data:", yield_data.shape)
print("Soil data:", soil_data.shape)


print("Merging datasets...")

final_data = yield_data.merge(
    soil_data,
    left_on="State",
    right_on="state",
    how="left"
)

final_data = final_data.drop(
    columns=["Production", "state"]
)

print("Final data:", final_data.shape)


X_no_area = final_data.drop(
    columns=["Yield", "Area"]
)

y = final_data["Yield"]


categorical_no_area = X_no_area.select_dtypes(
    include=["object"]
).columns

numerical_no_area = X_no_area.select_dtypes(
    exclude=["object"]
).columns


print("Categorical:", list(categorical_no_area))
print("Numerical:", list(numerical_no_area))


X_train, X_test, y_train, y_test = train_test_split(
    X_no_area,
    y,
    test_size=0.2,
    random_state=42
)


preprocessor_no_area = ColumnTransformer(
    transformers=[
        (
            "num",
            StandardScaler(),
            numerical_no_area
        ),
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_no_area
        )
    ]
)


rf_no_area = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor_no_area
        ),
        (
            "model",
            RandomForestRegressor(
                n_estimators=50,
                max_depth=15,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            )
        )
    ]
)


print("Training model...")

rf_no_area.fit(
    X_train,
    y_train
)

print("Training completed.")


y_pred = rf_no_area.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred) ** 0.5
r2 = r2_score(y_test, y_pred)

print("\n===== Results =====")
print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R² Score: {r2:.4f}")


os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

joblib.dump(
    rf_no_area,
    MODEL_PATH,
    compress=3
)

size_mb = os.path.getsize(MODEL_PATH) / (1024 * 1024)

print("\n===== Model Saved =====")
print(MODEL_PATH)
print(f"Model size: {size_mb:.2f} MB")