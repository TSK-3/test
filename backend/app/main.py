import os

from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.security import (
    create_access_token
)

from app.email_service import (
    generate_otp
)
from app.sms_service import format_phone_number, send_sms_otp

from datetime import datetime, timedelta
try:
    import ee
except ImportError:
    ee = None

try:
    from pymongo import MongoClient
    from pymongo.errors import PyMongoError, ServerSelectionTimeoutError
except ImportError:
    MongoClient = None
    PyMongoError = Exception
    ServerSelectionTimeoutError = Exception

# ================= APP =================

app = FastAPI()

# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= MONGODB =================

users_collection = None
memory_users = {}

if MongoClient:
    try:
        client = MongoClient(
            "mongodb://localhost:27017",
            serverSelectionTimeoutMS=2000
        )
        client.admin.command("ping")
        db = client["carbonsetu"]
        users_collection = db["users"]
        print("MongoDB connected")
    except (PyMongoError, ServerSelectionTimeoutError) as e:
        users_collection = None
        print("MongoDB not available, using in-memory auth store:", e)
else:
    print("PyMongo is not installed, using in-memory auth store")

# ================= EARTH ENGINE =================

earth_engine_ready = False

try:
    if ee:
        ee.Initialize(
            project="carbonsetu-496709"
        )
        earth_engine_ready = True
        print("Earth Engine initialized successfully")
    else:
        print("Earth Engine package is not installed")
except Exception as e:
    earth_engine_ready = False
    print("Earth Engine not initialized:", e)

# ================= MODELS =================

class RegisterModel(BaseModel):
    phone: str
    full_name: str = None
    email: str = None
    password: str = None
    country: str = None
    state: str = None
    city: str = None
    farm_type: str = None

class LoginModel(BaseModel):
    phone: str
    otp: str

class PhoneRequestModel(BaseModel):
    phone: str

class VerifyOTPModel(BaseModel):
    phone: str
    otp: str

class UpdateProfileModel(BaseModel):
    phone: str
    full_name: str
    email: str
    country: str
    state: str
    city: str
    farm_type: str
    aadhaar: str = None
    upi: str = None

class AnalyzeModel(BaseModel):
    geojson: dict

def find_user(phone: str):
    if users_collection is not None:
        return users_collection.find_one({"phone": phone})

    return memory_users.get(phone)

def upsert_user(phone: str, updates: dict, unset: dict = None):
    unset = unset or {}

    if users_collection is not None:
        update_doc = {"$set": updates}
        if unset:
            update_doc["$unset"] = unset
        users_collection.update_one({"phone": phone}, update_doc, upsert=True)
        return

    user = memory_users.setdefault(phone, {"phone": phone})
    user.update(updates)
    for key in unset:
        user.pop(key, None)

def get_active_otp_user(phone: str, otp: str):
    normalized_phone = format_phone_number(phone)
    user = find_user(normalized_phone)

    if not user:
        return None, "User not found"

    if user.get("phone_otp") != otp:
        return None, "Invalid OTP"

    expiry = user.get("otp_expiry")
    if isinstance(expiry, str):
        try:
            expiry = datetime.fromisoformat(expiry)
        except ValueError:
            expiry = None

    if not expiry or expiry < datetime.utcnow():
        return None, "OTP expired. Please request a new one."

    return user, None

# ================= REQUEST OTP =================

@app.post("/request-otp")
async def request_otp(data: PhoneRequestModel):
    try:
        phone = format_phone_number(data.phone)
        if not phone:
            return {"success": False, "message": "Please enter a valid phone number"}

        otp = generate_otp()

        upsert_user(phone, {
            "phone": phone,
            "phone_otp": otp,
            "otp_expiry": datetime.utcnow() + timedelta(minutes=10)
        })

        sms_sent = send_sms_otp(phone, otp)
        if not sms_sent:
            return {"success": False, "message": "Failed to send OTP. Please check the phone number or Twilio configuration."}

        return {"success": True, "message": "OTP sent to phone"}
    except Exception as e:
        return {"success": False, "message": str(e)}

# ================= VERIFY PHONE =================

@app.post("/verify-phone")
def verify_phone(data: VerifyOTPModel):
    try:
        phone = format_phone_number(data.phone)
        user, error = get_active_otp_user(phone, data.otp)
        if error:
            return {"success": False, "message": error}

        upsert_user(
            phone,
            {"verified": True},
            {"phone_otp": "", "otp_expiry": ""}
        )
        return {"success": True, "message": "Phone verified successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}

# ================= LOGIN PHONE =================

@app.post("/login-phone")
def login_phone(data: LoginModel):
    try:
        phone = format_phone_number(data.phone)
        user, error = get_active_otp_user(phone, data.otp)
        if error:
            return {"success": False, "message": "User not registered" if error == "User not found" else error}

        if not user.get("verified"):
            return {"success": False, "message": "Please verify your phone"}

        token = create_access_token({"phone": phone})
        upsert_user(
            phone,
            {},
            {"phone_otp": "", "otp_expiry": ""}
        )
        return {"success": True, "token": token}
    except Exception as e:
        return {"success": False, "message": str(e)}

# ================= UPDATE PROFILE =================

@app.post("/update-profile")
def update_profile(data: UpdateProfileModel):
    try:
        phone = format_phone_number(data.phone)
        upsert_user(phone, {
            "phone": phone,
            "full_name": data.full_name,
            "email": data.email,
            "country": data.country,
            "state": data.state,
            "city": data.city,
            "farm_type": data.farm_type,
            "aadhaar": data.aadhaar,
            "upi": data.upi
        })
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}

# ================= ANALYZE =================

@app.post("/analyze")
def analyze(data: AnalyzeModel):
    try:
        geojson = data.geojson
        if not geojson:
            return {"success": False, "message": "Polygon missing"}

        coordinates = geojson["geometry"]["coordinates"]
        polygon = ee.Geometry.Polygon(coordinates)

        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(polygon)
            .filterDate("2024-01-01", "2025-12-31")
            .sort("CLOUDY_PIXEL_PERCENTAGE")
        )

        image = collection.first()

        ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI")
        ndvi_value = ndvi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=polygon,
            scale=10,
            maxPixels=1e13
        ).get("NDVI").getInfo()

        evi = image.expression(
            "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
            {
                "NIR": image.select("B8"),
                "RED": image.select("B4"),
                "BLUE": image.select("B2")
            }
        )
        evi_value = evi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=polygon,
            scale=10,
            maxPixels=1e13
        ).values().get(0).getInfo()

        area_m2 = polygon.area().getInfo()
        area_hectares = round(area_m2 / 10000, 2)

        tree_cover = round(min(max(ndvi_value * 100, 0), 100), 2)
        soil_moisture = round(min(max(evi_value * 25, 0), 100), 2)
        carbon_tonnes = round(area_hectares * tree_cover * 0.12, 2)

        return {
            "success": True,
            "ndvi": round(ndvi_value, 3),
            "evi": round(evi_value, 3),
            "tree_cover": tree_cover,
            "soil_moisture": soil_moisture,
            "carbon_tonnes": carbon_tonnes,
            "area_hectares": area_hectares,
            "vegetation_health": "Healthy"
        }
    except Exception as e:
        return {"success": False, "message": str(e)}

# ================= ROOT =================

@app.get("/")
def root():
    return {"message": "CarbonSetu Backend Running"}

@app.get("/health")
def health():
    return {
        "success": True,
        "auth_store": "mongodb" if users_collection is not None else "memory",
        "earth_engine_ready": earth_engine_ready
    }

@app.get("/dev/latest-otp/{phone}")
def latest_otp(phone: str):
    if os.getenv("CARBONX_DEV_AUTH") != "1":
        raise HTTPException(status_code=404, detail="Not found")

    normalized_phone = format_phone_number(phone)
    user = find_user(normalized_phone)
    if not user or not user.get("phone_otp"):
        raise HTTPException(status_code=404, detail="OTP not found")

    return {
        "success": True,
        "phone": normalized_phone,
        "otp": user["phone_otp"]
    }
