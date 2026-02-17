# 📖 Teknik Dokümantasyon — Yangın Söndürme ve Alarm Sistemi

## İçindekiler

1. [Sistem Genel Bakışı](#1-sistem-genel-bakışı)
2. [Teknoloji Stack'i](#2-teknoloji-stacki)
3. [Mimari Tasarım](#3-mimari-tasarım)
4. [Veri Modeli](#4-veri-modeli)
5. [API Referansı](#5-api-referansı)
6. [Kimlik Doğrulama Akışı](#6-kimlik-doğrulama-akışı)
7. [Frontend Bileşen Mimarisi](#7-frontend-bileşen-mimarisi)
8. [Güvenlik Notları](#8-güvenlik-notları)
9. [Bilinen Sorunlar & Çözümler](#9-bilinen-sorunlar--çözümler)
10. [Gelecek İyileştirmeler](#10-gelecek-iyileştirmeler)

---

## 1. Sistem Genel Bakışı

Yangın Söndürme ve Alarm Sistemi, IoT tabanlı duman sensörlerinin verilerini gerçek zamanlı olarak toplayan, analiz eden ve yangın tespit edildiğinde ilgili kişileri anında bilgilendiren bir platformdur.

### Sistem Akışı

```
IoT Sensör → Firebase Firestore → React Dashboard (gerçek zamanlı)
                                         │
                                   Yangın algılandı?
                                    ├── Evet → Express API → E-posta bildirimi
                                    └── Hayır → Normal izleme devam eder
```

### Kullanıcı Rolleri

| Rol        | Yetkiler                                                      |
|-----------|---------------------------------------------------------------|
| **Ziyaretçi** | Ana sayfa, hakkımızda, destek sayfalarına erişim            |
| **Müşteri**   | Kayıt talebi gönderme, OTP ile giriş, dashboard erişimi    |
| **Admin**     | Müşteri taleplerini onaylama/reddetme                       |

---

## 2. Teknoloji Stack'i

### Frontend
| Teknoloji         | Sürüm   | Amaç                          |
|-------------------|---------|-------------------------------|
| React             | 19.1    | UI bileşen kütüphanesi       |
| React Router DOM  | 7.6     | Client-side routing          |
| React Icons       | 5.5     | İkon kütüphanesi             |
| Vite              | 7.0     | Build tool & dev server      |

### Backend
| Teknoloji    | Sürüm   | Amaç                              |
|-------------|---------|-----------------------------------|
| Express.js  | 5.1     | HTTP API sunucusu                 |
| Nodemailer  | 7.0     | E-posta gönderimi                 |
| dotenv      | 17.0    | Ortam değişkenleri yönetimi       |
| CORS        | 2.8     | Cross-Origin kaynak paylaşımı     |

### Veritabanı & Servisler
| Servis             | Amaç                              |
|--------------------|-----------------------------------|
| Firebase Firestore | NoSQL veritabanı (gerçek zamanlı) |
| Firebase Auth      | Kimlik doğrulama altyapısı        |
| Gmail SMTP         | E-posta gönderimi                 |

---

## 3. Mimari Tasarım

### 3.1 Frontend Mimarisi

```
main.jsx
  └── BrowserRouter
        └── App.jsx
              ├── Header (her sayfada)
              ├── Routes
              │     ├── /            → Home
              │     ├── /aboutUs     → About
              │     ├── /customer    → Customer
              │     ├── /dashboard   → Dashboard (korumalı)
              │     ├── /admin-dashboard → Admin
              │     └── /support     → Support
              └── Footer (her sayfada)
```

### 3.2 Backend Mimarisi

Express.js sunucusu iki ana endpoint sunar:

- `POST /send-email-code` — OTP üretir ve e-posta ile gönderir
- `POST /verify-email-code` — Gönderilen OTP'yi doğrular

OTP kodları sunucu belleğinde (`emailCodes` objesi) saklanır.

### 3.3 State Yönetimi

- **Kullanıcı Oturumu**: `localStorage` üzerinden `userEmail` anahtarı
- **Bileşen State**: React `useState` hook'u
- **Gerçek Zamanlı Veri**: Firestore `onSnapshot` listener'ları
- **Header Senkronizasyonu**: 500ms `setInterval` ile localStorage izleme

---

## 4. Veri Modeli

### 4.1 Firestore Koleksiyonları

#### `customers` Koleksiyonu

```javascript
{
  fullName: "Ahmet Yılmaz",           // string — müşteri adı
  email: "ahmet@example.com",          // string — e-posta adresi
  address: "İstanbul, Kadıköy",        // string — fiziksel adres
  emergencyContacts: [                  // array<string> — acil kişi listesi
    "Mehmet mehmet@example.com",
    "Ayşe ayse@example.com"
  ],
  approved: false,                      // boolean — admin onay durumu
  createdAt: Timestamp                  // Firestore Timestamp
}
```

#### `sensorData` Koleksiyonu

```javascript
{
  current: 245,                         // number — anlık sensör değeri
  min: 100,                             // number — minimum değer
  max: 950,                             // number — maksimum değer
  status: "✅ Ortam Güvenli.",          // string — durum metni
  timestamp: Timestamp                  // Firestore Timestamp
}
```

**Durum Değerleri:**
- `"✅ Ortam Güvenli."` — Normal seviye
- `"🚨 Yangın algılandı!"` — Tehlike seviyesi (current > 950)

---

## 5. API Referansı

### `POST /send-email-code`

6 haneli OTP üretir ve e-posta ile gönderir.

**Request Body:**
```json
{
  "to": "kullanici@example.com"
}
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Kod gönderildi"
}
```

**Hata Yanıtı (500):**
```json
{
  "success": false,
  "message": "Kod gönderilemedi",
  "error": "hata detayı"
}
```

---

### `POST /verify-email-code`

OTP doğrulaması yapar.

**Request Body:**
```json
{
  "to": "kullanici@example.com",
  "code": "123456"
}
```

**Başarılı Yanıt (200):**
```json
{
  "success": true,
  "message": "Kod doğru"
}
```

**Hata Yanıtı (401):**
```json
{
  "success": false,
  "message": "Kod yanlış"
}
```

---

## 6. Kimlik Doğrulama Akışı

```
Kullanıcı                Frontend              Backend              Firebase
   │                        │                     │                    │
   ├── Kayıt talebi ──────►│                     │                    │
   │                        ├── addDoc ──────────────────────────────►│
   │                        │                     │                    │
   │    (Admin onaylar)     │                     │                    │
   │                        │                     │                    │
   ├── E-posta girer ──────►│                     │                    │
   │                        ├── Firestore sorgu ─────────────────────►│
   │                        │◄── Onaylı mı? ─────────────────────────┤
   │                        │                     │                    │
   │                        ├── /send-email-code ►│                    │
   │                        │                     ├── OTP e-posta gönder
   │                        │◄── success ────────┤                    │
   │                        │                     │                    │
   ├── OTP girer ──────────►│                     │                    │
   │                        ├── /verify-email-code►│                   │
   │                        │◄── success ────────┤                    │
   │                        │                     │                    │
   │                        ├── localStorage.set("userEmail")          │
   │◄── Dashboard'a yönlendir                     │                    │
```

---

## 7. Frontend Bileşen Mimarisi

### Sayfa Bileşenleri

| Bileşen       | Dosya Yolu              | Sorumluluk                           |
|--------------|------------------------|--------------------------------------|
| `Home`       | `pages/Home.jsx`       | Hero, özellikler, kayıt bilgisi     |
| `Customer`   | `pages/Customer.jsx`   | Kayıt formu + OTP giriş            |
| `Dashboard`  | `pages/Dashboard.jsx`  | Sensör izleme + acil kişi yönetimi  |
| `About`      | `pages/About.jsx`      | Proje tanıtımı                      |
| `Support`    | `pages/Support.jsx`    | SSS accordion                       |
| `Admin`      | `admin/Admin.jsx`      | Müşteri onay paneli                 |

### Paylaşılan Bileşenler

| Bileşen  | Dosya Yolu               | Sorumluluk               |
|---------|-------------------------|--------------------------|
| `Header` | `components/Header.jsx` | Navigasyon + oturum durumu |
| `Footer` | `components/Footer.jsx` | Copyright + linkler       |

---

## 8. Güvenlik Notları

### Mevcut Güvenlik Önlemleri
- ✅ Service account key'ler `.gitignore`'da
- ✅ `.env` dosyası `.gitignore`'da
- ✅ OTP kodları tek kullanımlık

### Dikkat Edilmesi Gerekenler
- ⚠️ Firebase API key'leri frontend kodunda açık (client SDK için normal, ancak Firestore rules ile korunmalı)
- ⚠️ Admin panelinde şifre koruması gerekiyor
- ⚠️ OTP kodlarına süre sınırı eklenmeli
- ⚠️ Rate limiting uygulanmalı
- ⚠️ CORS origin'leri sınırlandırılmalı

---

## 9. Bilinen Sorunlar & Çözümler

| Sorun | Çözüm |
|-------|-------|
| Firebase config frontend'de açık | Firestore Security Rules ile korunmalı |
| Admin şifresi hardcoded | Backend API ile güvenli auth gerekli |
| OTP süre sınırı yok | `setTimeout` ile 5dk otomatik silme |
| CORS `origin: "*"` | Production'da belirli domain olmalı |
| Dashboard yetkisiz erişim | Route guard iyileştirilmeli |

---

## 10. Gelecek İyileştirmeler

### Kısa Vadeli (1-2 Hafta)
- [ ] OTP kodlarına süre sınırı (5 dakika)
- [ ] Rate limiting (brute-force koruması)
- [ ] Admin panel için güvenli kimlik doğrulama
- [ ] Firestore Security Rules güncellemesi
- [ ] Loading ve error state'leri iyileştirme
- [ ] Form validasyonu eklenmesi

### Orta Vadeli (1-2 Ay)
- [ ] Firebase Auth tam entegrasyonu (Google, Email/Password)
- [ ] Push notification desteği (Firebase Cloud Messaging)
- [ ] SMS bildirim entegrasyonu (Twilio)
- [ ] Sensör verisi grafikleştirme (Chart.js veya Recharts)
- [ ] PWA desteği (offline erişim)
- [ ] Dark/Light tema değiştirici
- [ ] Çoklu dil desteği (TR/EN)

### Uzun Vadeli (3-6 Ay)
- [ ] ESP32/Arduino doğrudan entegrasyonu
- [ ] Coğrafi konum bazlı sensör haritası
- [ ] Yapay zeka destekli yangın tahmin modeli
- [ ] WhatsApp/Telegram bot entegrasyonu
- [ ] Detaylı raporlama & Analytics
- [ ] Role-based access control (RBAC)
- [ ] Production deployment (Firebase Hosting + Cloud Run)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Unit & Integration testleri
