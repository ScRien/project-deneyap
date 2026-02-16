import serial
import time
import datetime
import re
import firebase_admin
from firebase_admin import credentials, firestore
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from dotenv import load_dotenv
from pathlib import Path
import os
import serial.tools.list_ports

# Portları listele
ports = serial.tools.list_ports.comports()
for port in ports:
    print(port.device)

# .env dosyasını yükle
dotenv_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path)

MAIL_USER = os.getenv("MAIL_USER")
MAIL_PASS = os.getenv("MAIL_PASS")
ITFAIYE = os.getenv("ITFAIYE")

# Firebase başlat
cred = credentials.Certificate("C:/React/deneyap-project/ide/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Veriyi ayıkla
def parse_data(line):
    try:
        match = re.search(r"Anlık: (\d+)\s+\|\s+Min: (\d+)\s+\|\s+Max: (\d+)", line)
        if match:
            now = datetime.datetime.now()
            return {
                "timestamp": now.isoformat(),
                "readable_time": now.strftime("%d.%m.%Y %H:%M:%S"),
                "current": int(match.group(1)),
                "min": int(match.group(2)),
                "max": int(match.group(3))
            }
    except Exception as e:
        print("⛔ Parse hatası:", e)
    return None

# Durum üret
def generate_status(data):
    return "🚨 Yangın algılandı!" if data["current"] > 1000 else "✅ Ortam Güvenli."

# Acil e-posta alıcılarını al
def get_emergency_contacts_by_email(customer_email):
    try:
        docs = db.collection("customers").where("email", "==", customer_email).where("approved", "==", True).stream()
        for doc in docs:
            customer = doc.to_dict()
            emails = []
            for entry in customer.get("emergencyContacts", []):
                # Boşluk, virgül ve noktalı virgülle ayır
                parts = re.split(r"[,\s;]+", entry.strip())
                for part in parts:
                    part = part.strip()
                    if "@" in part and "." in part:
                        emails.append(part)
            return emails
    except Exception as e:
        print("⚠️ E-posta listesi alınamadı:", e)
    return []

# Aktif müşteri e-postasını al
def get_active_customer_email():
    try:
        docs = db.collection("customers").where("approved", "==", True).limit(1).stream()
        for doc in docs:
            return doc.to_dict().get("email", None)
    except Exception as e:
        print("⚠️ E-posta çekilemedi:", e)
    return None

# Müşterinin adresini al
def get_address_by_email(customer_email):
    try:
        docs = db.collection("customers").where("email", "==", customer_email).where("approved", "==", True).stream()
        for doc in docs:
            customer = doc.to_dict()
            return customer.get("address", "Adres bulunamadı.")
    except Exception as e:
        print("⚠️ Adres alınamadı:", e)
    return "Adres alınamadı."

# Mail gönder
def send_alert_email(data, recipients, address):
    if not recipients:
        print("⚠️ Alıcı yok.")
        return

    subject = "🚨 Yangın Uyarısı - Deneyap Kart"
    body = f"""
🛑 Yangın alarmı tetiklendi!

📅 Tarih: {data['readable_time']}
💨 Anlık: {data['current']}
📉 Minimum: {data['min']}
📈 Maksimum: {data['max']}
📝 Durum: {data['status']}
🏠 Adres: {address}

📩 Sistem: DAST - Duman Algılama Sistemi
/-- Yangın Söndürme ve Alarm Sistemleri --/
"""

    # İtfaiyeye e-posta
    msg2 = MIMEMultipart()
    msg2["From"] = MAIL_USER
    msg2["To"] = ITFAIYE
    msg2["Subject"] = str(Header(subject, "utf-8"))
    msg2.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(MAIL_USER, MAIL_PASS)
            server.sendmail(MAIL_USER, ITFAIYE, msg2.as_string())
        print(f"[{data['readable_time']}] ✅ İtfaiyeye Mail gönderildi.")
    except Exception as e:
        print("❌ İtfaiyeye mail gönderilemedi:", e)

    # Kullanıcılara e-posta
    msg = MIMEMultipart()
    msg["From"] = MAIL_USER
    msg["To"] = ", ".join(recipients)
    msg["Subject"] = str(Header(subject, "utf-8"))
    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(MAIL_USER, MAIL_PASS)
            server.sendmail(MAIL_USER, recipients, msg.as_string())
        print(f"[{data['readable_time']}] ✅ Kullanıcılara Mail gönderildi.")
    except Exception as e:
        print("❌ Kullanıcılara mail gönderilemedi:", e)

# Seri portu başlat
ser = serial.Serial('COM8', 115200, timeout=1)
print("🚀 Sensör başlatıldı. Isınması için 30 saniye bekleniyor...")
time.sleep(30)

# Süre takibi
last_sent_time = None
ALERT_COOLDOWN_SECONDS = 180

# Müşteri e-posta adresini al
CUSTOMER_EMAIL = get_active_customer_email()
if not CUSTOMER_EMAIL:
    print("❌ Müşteri e-posta bilgisi alınamadı. Çıkılıyor.")
    exit()

# Sonsuz döngü
while True:
    try:
        line = ser.readline().decode("utf-8").strip()
        if not line:
            continue

        data = parse_data(line)
        if data:
            data["status"] = generate_status(data)
            data["email"] = CUSTOMER_EMAIL
            db.collection("sensorData").add(data)
            print(f"[{data['readable_time']}] 🔄 Kayıt eklendi. Durum: {data['status']}")

            if data["status"].startswith("🚨"):
                now = datetime.datetime.now()
                if not last_sent_time or (now - last_sent_time).total_seconds() > ALERT_COOLDOWN_SECONDS:
                    recipients = get_emergency_contacts_by_email(CUSTOMER_EMAIL)
                    address = get_address_by_email(CUSTOMER_EMAIL)  # 🏠 Adres çekiliyor
                    send_alert_email(data, recipients, address)
                    last_sent_time = now
                else:
                    print(f"[{data['readable_time']}] ⏳ Alarm bekleme süresi dolmadı.")
        time.sleep(10)

    except Exception as e:
        print("⛔ Hata:", e)
