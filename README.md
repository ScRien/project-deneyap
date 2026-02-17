# 🔥 Yangın Söndürme ve Alarm Sistemi

> Deneyap Teknoloji Atölyeleri & TÜBİTAK destekli akıllı yangın algılama ve bildirim platformu.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-11.9-FFCA28?logo=firebase)
![Express](https://img.shields.io/badge/Express-5.1-000000?logo=express)

## 📋 Proje Açıklaması

Bu platform, IoT duman sensörlerinden gelen verileri gerçek zamanlı olarak izler ve yangın algılandığında kullanıcıları, acil durum kişilerini ve yetkilileri **e-posta** ile anında bilgilendirir.

### Temel Özellikler

- 🔔 **Gerçek Zamanlı Sensör İzleme** — Firestore `onSnapshot` ile canlı veri akışı
- 📧 **E-posta Doğrulama & Bildirim** — Nodemailer ile 6 haneli OTP gönderimi
- 👥 **Müşteri Yönetimi** — Kayıt talebi → Admin onayı → Kullanıcı girişi akışı
- 🛡️ **Admin Paneli** — Bekleyen müşteri onayları yönetimi
- 📊 **Dashboard** — Sensör verileri, filtreleme, acil durum kişileri yönetimi
- ❓ **SSS / Destek** — Accordion tabanlı yardım sayfası

## 🏗️ Mimari

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Home   │ │ Customer │ │Dashboard │ │  Admin   │ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│       │           │            │             │       │
│       └───────────┴─────┬──────┴─────────────┘       │
│                         │                            │
│              ┌──────────▼──────────┐                 │
│              │  Firebase SDK       │                 │
│              │  (Firestore Client) │                 │
│              └──────────┬──────────┘                 │
└─────────────────────────┼────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │   Firebase Firestore  │
              │   (Cloud Database)    │
              └───────────────────────┘
                          
┌──────────────────────────────────────────────────────┐
│               BACKEND (Express.js)                    │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ /send-email-code │  │  /verify-email-code      │  │
│  │ (Nodemailer)     │  │  (OTP doğrulama)         │  │
│  └──────────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## 📂 Proje Yapısı

```
project-deneyap/
├── index.html                 # Vite giriş noktası
├── vite.config.js             # Vite yapılandırması
├── package.json               # Bağımlılıklar
├── .env                       # Ortam değişkenleri (gitignore'da)
├── .env.example               # Örnek ortam değişkenleri
│
├── src/
│   ├── main.jsx               # React giriş noktası
│   ├── App.jsx                # Router yapılandırması
│   │
│   ├── components/            # Paylaşılan bileşenler
│   │   ├── Header.jsx         # Navigasyon çubuğu
│   │   └── Footer.jsx         # Alt bilgi
│   │
│   ├── pages/                 # Sayfa bileşenleri
│   │   ├── Home.jsx           # Ana sayfa
│   │   ├── Customer.jsx       # Müşteri kayıt & giriş
│   │   ├── Dashboard.jsx      # Sensör izleme paneli
│   │   ├── About.jsx          # Hakkımızda
│   │   └── Support.jsx        # SSS / Destek
│   │
│   ├── admin/
│   │   └── Admin.jsx          # Admin onay paneli
│   │
│   ├── css/                   # Stil dosyaları
│   │   ├── Index.css          # Global stiller
│   │   ├── App.css            # Layout
│   │   ├── Header.css         # Header stili
│   │   ├── Footer.css         # Footer stili
│   │   ├── Home.css           # Ana sayfa stili
│   │   ├── Customer.css       # Müşteri sayfası stili
│   │   ├── Dashboard.css      # Dashboard stili
│   │   ├── About.css          # Hakkımızda stili
│   │   └── Support.css        # Destek sayfası stili
│   │
│   ├── firebase/              # Firebase yapılandırması
│   │   ├── config.js          # Firebase başlatma
│   │   ├── auth.js            # Auth yapılandırması
│   │   └── firestore.js       # Firestore yardımcıları
│   │
│   ├── backend/               # Express.js API sunucusu
│   │   └── index.js           # E-posta gönderimi & OTP doğrulama
│   │
│   ├── functions/             # Firebase Cloud Functions
│   │   └── index.js           # Cloud function tanımları
│   │
│   └── assets/                # Görseller
│       ├── deneyap.jpg
│       ├── duman-dedektor.jpg
│       ├── senlik.png
│       └── tubitak.png
```

## 🚀 Kurulum

### Gereksinimler
- Node.js ≥ 18
- npm ≥ 9
- Firebase projesi (Firestore etkinleştirilmiş)

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/ScRien/project-deneyap.git
cd project-deneyap

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenleyerek gerçek değerleri gir

# 4. Frontend'i başlat
npm run dev

# 5. Backend'i başlat (ayrı terminal)
node src/backend/index.js
```

### Ortam Değişkenleri

| Değişken   | Açıklama                          |
|-----------|-----------------------------------|
| `PORT`    | Backend sunucu portu (varsayılan: 5000) |
| `MAIL_USER` | Gmail hesabı                    |
| `MAIL_PASS` | Gmail uygulama şifresi          |

## 🧪 Kullanım Akışı

1. **Müşteri Kaydı**: `/customer` sayfasından bilgilerini doldurarak talep gönderir
2. **Admin Onayı**: `/admin-dashboard` sayfasından yetkili, talebi onaylar
3. **E-posta Girişi**: Onaylanan müşteri, e-posta + OTP ile giriş yapar
4. **Dashboard**: Sensör verilerini gerçek zamanlı izler, acil kişi yönetir

## 📄 Lisans

Bu proje eğitim amaçlıdır — Deneyap Teknoloji Atölyeleri kapsamında geliştirilmiştir.
