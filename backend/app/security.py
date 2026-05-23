import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta

try:
    from jose import jwt
except ImportError:
    jwt = None

try:
    from passlib.context import CryptContext
except ImportError:
    CryptContext = None

SECRET_KEY = "carbonsetu_secret_key"

ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
) if CryptContext else None

# ================= HASH PASSWORD =================

def hash_password(password: str):
    if not pwd_context:
        raise RuntimeError("passlib is required for password hashing")

    # convert to normal string

    password = str(password)

    # limit length

    password = password[:50]

    return pwd_context.hash(password)

# ================= VERIFY PASSWORD =================

def verify_password(
    plain_password,
    hashed_password
):
    if not pwd_context:
        raise RuntimeError("passlib is required for password verification")

    plain_password = str(
        plain_password
    )

    plain_password = plain_password[:50]

    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# ================= CREATE JWT TOKEN =================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        hours=24
    )

    to_encode.update({
        "exp": expire
    })

    if jwt:
        encoded_jwt = jwt.encode(
            to_encode,
            SECRET_KEY,
            algorithm=ALGORITHM
        )
    else:
        encoded_jwt = encode_hs256(to_encode)

    return encoded_jwt

def base64url(data: bytes):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")

def encode_hs256(payload: dict):
    serializable_payload = payload.copy()
    if isinstance(serializable_payload.get("exp"), datetime):
        serializable_payload["exp"] = int(serializable_payload["exp"].timestamp())

    header = {"alg": "HS256", "typ": "JWT"}
    header_part = base64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_part = base64url(json.dumps(serializable_payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_part}.{payload_part}".encode("ascii")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()

    return f"{header_part}.{payload_part}.{base64url(signature)}"
