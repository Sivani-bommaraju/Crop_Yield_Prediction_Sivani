from datetime import datetime


def create_user_document(full_name, email, hashed_password, role):
    return {
    "full_name": full_name,
    "email": email,
    "password_hash": hashed_password,
    "role": role,
    "created_at": datetime.utcnow()
}


