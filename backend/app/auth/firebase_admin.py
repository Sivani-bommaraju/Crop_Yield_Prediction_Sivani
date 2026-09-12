# import firebase_admin
# from firebase_admin import credentials, auth

# cred = credentials.Certificate(
#     "/etc/secrets/serviceAccountKey.json"
# )

# if not firebase_admin._apps:
#     firebase_admin.initialize_app(cred)


# def verify_google_token(id_token: str):
#     try:
#         decoded = auth.verify_id_token(id_token)
#         return decoded
#     except Exception:
#         return None

import os
import firebase_admin
from firebase_admin import credentials, auth

SERVICE_ACCOUNT_PATH = os.getenv(
    "FIREBASE_SERVICE_ACCOUNT_PATH",
    "firebase/serviceAccountKey.json"
)

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)


def verify_google_token(id_token: str):
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded
    except Exception:
        return None