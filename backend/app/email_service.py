import random

try:
    from fastapi_mail import FastMail
    from fastapi_mail import MessageSchema
    from fastapi_mail import ConnectionConfig
except ImportError:
    FastMail = None
    MessageSchema = None
    ConnectionConfig = None

conf = ConnectionConfig(

    MAIL_USERNAME = "gireddyvarshithreddy@gmail.com",

    MAIL_PASSWORD = "xpfo ccpi qfkg puhb",

    MAIL_FROM = "gireddyvarshithreddyl@gmail.com",

    MAIL_PORT = 587,

    MAIL_SERVER = "smtp.gmail.com",

    MAIL_STARTTLS = True,

    MAIL_SSL_TLS = False,

    USE_CREDENTIALS = True

) if ConnectionConfig else None

def generate_otp(length=4):
    start = 10 ** (length - 1)
    end = (10 ** length) - 1

    return str(
        random.randint(
            start,
            end
        )
    )

async def send_phone_otp(
    phone,
    otp
):
    print(f"--- SMS SIMULATION ---")
    print(f"To: {phone}")
    print(f"Message: Your CarbonSetu OTP is {otp}")
    print(f"----------------------")
    return True

async def send_email_otp(
    email,
    otp
):
    if not FastMail or not MessageSchema or not conf:
        raise RuntimeError("fastapi-mail is required to send email OTPs")

    html = f"""

    <h2>CarbonSetu Email Verification</h2>

    <h1>{otp}</h1>

    """

    message = MessageSchema(

        subject = "CarbonSetu OTP",

        recipients = [email],

        body = html,

        subtype = "html"

    )

    fm = FastMail(conf)

    await fm.send_message(message)
