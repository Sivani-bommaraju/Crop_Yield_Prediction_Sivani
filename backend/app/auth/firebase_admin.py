import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate(
    "firebase/serviceAccountKey.json"
)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)


def verify_google_token(id_token: str):
    try:
        decoded = auth.verify_id_token(id_token)
        return decoded
    except Exception:
        return None