import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ── Config ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();

// CORS — production'da belirli domain'lere kısıtla
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS izni reddedildi."));
      }
    },
  })
);

app.use(express.json());

// ── Mail Transporter ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ── In-memory OTP Store ──
// { email: { code: "123456", expiresAt: Date } }
const emailCodes = {};

// OTP temizleme — süresi dolmuş kodları kaldır
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 dakika

function cleanupExpiredCodes() {
  const now = Date.now();
  for (const email in emailCodes) {
    if (emailCodes[email].expiresAt <= now) {
      delete emailCodes[email];
    }
  }
}

// Her dakika temizle
setInterval(cleanupExpiredCodes, 60 * 1000);

// ── Routes ──

// Health check
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Backend çalışıyor.",
    timestamp: new Date().toISOString(),
  });
});

// Doğrulama kodu gönder
app.post("/send-email-code", async (req, res) => {
  const { to } = req.body;

  if (!to || typeof to !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Geçerli bir e-posta adresi zorunludur." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: `"Yangın Alarm Sistemi" <${process.env.MAIL_USER}>`,
    to,
    subject: "🔐 Doğrulama Kodunuz",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: auto; padding: 32px; background: #0f172a; border-radius: 16px; color: #e2e8f0;">
        <h2 style="color: #f97316; margin-bottom: 16px;">🔥 Yangın Alarm Sistemi</h2>
        <p>Giriş için doğrulama kodunuz:</p>
        <div style="background: #1e293b; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">Bu kod 5 dakika geçerlidir. Kodu kimseyle paylaşmayın.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    emailCodes[to] = {
      code,
      expiresAt: Date.now() + OTP_EXPIRY_MS,
    };
    res.json({ success: true, message: "Doğrulama kodu gönderildi." });
  } catch (err) {
    console.error("E-posta gönderme hatası:", err.message);
    res.status(500).json({
      success: false,
      message: "Kod gönderilemedi. Lütfen daha sonra tekrar deneyin.",
    });
  }
});

// Doğrulama kodu kontrol
app.post("/verify-email-code", (req, res) => {
  const { to, code } = req.body;

  if (!to || !code) {
    return res
      .status(400)
      .json({ success: false, message: "E-posta ve kod zorunludur." });
  }

  const stored = emailCodes[to];

  if (!stored) {
    return res
      .status(401)
      .json({ success: false, message: "Kod bulunamadı veya süresi dolmuş." });
  }

  if (stored.expiresAt <= Date.now()) {
    delete emailCodes[to];
    return res
      .status(401)
      .json({ success: false, message: "Kodun süresi dolmuş. Yeni kod talep edin." });
  }

  if (stored.code === code.toString()) {
    delete emailCodes[to]; // Tek kullanımlık
    return res.json({ success: true, message: "Doğrulama başarılı." });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Girdiğiniz kod yanlış." });
  }
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend çalışıyor: http://localhost:${PORT}`);
});
