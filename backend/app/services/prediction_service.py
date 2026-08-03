import pickle

from app.database.database import db


predictions = db["predictions"]



# load model

# model = pickle.load(
#     open(
#         "app/ml/model.pkl",
#         "rb"
#     )
# )

model = None



def predict_yield(data):


    features = [

        data.crop,

        data.soil_type,

        data.land_size,

        data.rainfall,

        data.temperature,

        data.fertilizer,

        data.irrigation

    ]


    result = model.predict(
        [features]
    )


    prediction = {


        "crop":
        data.crop,


        "yield_prediction":
        float(result[0]),


        "inputs":
        data.dict()


    }



    predictions.insert_one(
        prediction
    )



    return prediction