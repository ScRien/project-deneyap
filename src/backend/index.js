import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

let emailCodes = {};

// Ana sayfa testi için
app.get("/", (req, res) => {
  res.send("Backend çalışıyor.");
});

// POST /send-email-code olarak değiştirildi:
app.post("/send-email-code", async (req, res) => {
  const { to } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000); // 6 haneli kod

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: "Doğrulama Kodu",
    text: `Giriş için doğrulama kodunuz: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    emailCodes[to] = code.toString(); // Belleğe kaydet
    res.json({ success: true, message: "Kod gönderildi" });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Kod gönderilemedi",
        error: err.message,
      });
  }
});

app.post("/verify-email-code", (req, res) => {
  const { to, code } = req.body;

  if (!to || !code) {
    return res.status(400).json({ success: false, message: "Eksik bilgi" });
  }

  if (emailCodes[to] === code) {
    delete emailCodes[to]; // Kod sadece bir kez kullanılabilir
    return res.json({ success: true, message: "Kod doğru" });
  } else {
    return res.status(401).json({ success: false, message: "Kod yanlış" });
  }
});

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${PORT}`);
});
