import os
import re
import urllib.parse
import urllib.request
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

if load_dotenv:
    load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")
else:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if not line.strip() or line.lstrip().startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip())

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

def format_phone_number(phone):
    phone = str(phone or "").strip()

    if phone.startswith("+"):
        digits = re.sub(r"\D", "", phone)
        return f"+{digits}" if digits else ""

    digits = re.sub(r"\D", "", phone)

    if len(digits) == 10:
        return f"+91{digits}"

    if len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"

    return f"+{digits}" if digits else ""

def send_sms_otp(phone, otp):
    try:
        formatted_phone = format_phone_number(phone)

        if not re.fullmatch(r"\+[1-9]\d{9,14}", formatted_phone):
            print(f"Invalid phone number for OTP: {phone}")
            return False

        if os.getenv("CARBONX_SMS_MODE") == "console":
            print(f"--- SMS SIMULATION ---")
            print(f"To: {formatted_phone}")
            print(f"Message: Your CarbonSetu OTP is {otp}")
            print(f"----------------------")
            return True

        if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
            print("Twilio credentials missing in .env file. Simulating SMS instead.")
            print(f"--- SMS SIMULATION ---")
            print(f"To: {formatted_phone}")
            print(f"Message: Your CarbonSetu OTP is {otp}")
            print(f"----------------------")
            return True

        try:
            from twilio.rest import Client
        except ImportError:
            return send_sms_otp_via_rest(formatted_phone, otp)

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=f"Your CarbonSetu OTP is {otp}",
            from_=TWILIO_PHONE_NUMBER,
            to=formatted_phone
        )
        return True
    except Exception as e:
        print(f"Twilio error: {e}")
        return False

def send_sms_otp_via_rest(phone, otp):
    try:
        url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
        body = urllib.parse.urlencode({
            "To": phone,
            "From": TWILIO_PHONE_NUMBER,
            "Body": f"Your CarbonSetu OTP is {otp}"
        }).encode("utf-8")

        request = urllib.request.Request(url, data=body, method="POST")
        credentials = f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}"
        request.add_header("Authorization", f"Basic {__import__('base64').b64encode(credentials.encode()).decode()}")
        request.add_header("Content-Type", "application/x-www-form-urlencoded")

        with urllib.request.urlopen(request, timeout=20) as response:
            return 200 <= response.status < 300
    except Exception as e:
        print(f"Twilio REST error: {e}")
        return False
