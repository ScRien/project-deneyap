import { useState, useEffect, useRef } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { useScrollRevealAll } from "../hooks/useScrollReveal";
import { CONFIG } from "../config";
import {
  FaFire,
  FaCheckCircle,
  FaBell,
  FaShieldAlt,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";

function Customer() {
  const navigate = useNavigate();
  const toast = useToast();
  const pageRef = useRef(null);
  useScrollRevealAll(pageRef);

  // ── State ──
  const [tab, setTab] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);

  // Register
  const [reg, setReg] = useState({
    fullName: "",
    email: "",
    address: "",
    emergencyContacts: "",
  });

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // ── Redirect if logged in ──
  useEffect(() => {
    if (localStorage.getItem("userEmail")) navigate("/dashboard");
  }, [navigate]);

  // ── Cooldown ──
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // ── Register ──
  const handleReg = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contacts = reg.emergencyContacts
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      await addDoc(collection(db, "customers"), {
        fullName: reg.fullName.trim(),
        email: reg.email.trim().toLowerCase(),
        address: reg.address.trim(),
        emergencyContacts: contacts,
        approved: false,
        createdAt: new Date(),
      });

      toast.success(
        "Talebiniz alındı! Onay sonrası giriş yapabilirsiniz."
      );
      setReg({ fullName: "", email: "", address: "", emergencyContacts: "" });
      setTab("login");
    } catch (err) {
      console.error(err);
      toast.error("Kayıt sırasında bir hata oluştu.");
    }
    setLoading(false);
  };

  // ── Send OTP ──
  const sendCode = async (e) => {
    e?.preventDefault();
    if (!loginEmail.trim()) {
      toast.warning("E-posta adresinizi girin.");
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, "customers"),
        where("email", "==", loginEmail.trim().toLowerCase()),
        where("approved", "==", true)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        toast.error("Onaylı bir hesap bulunamadı.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${CONFIG.API_URL}/send-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: loginEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        setCooldown(CONFIG.OTP_RESEND_COOLDOWN);
        toast.success("Doğrulama kodu gönderildi.");
      } else {
        toast.error(data.message || "Kod gönderilemedi.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucuya bağlanılamadı. Backend çalışıyor mu?");
    }
    setLoading(false);
  };

  // ── Verify OTP ──
  const verifyCode = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/verify-email-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: loginEmail.trim().toLowerCase(),
          code: otp.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userEmail", loginEmail.trim().toLowerCase());
        toast.success("Giriş başarılı!");
        setTimeout(() => navigate("/dashboard"), 600);
      } else {
        toast.error(data.message || "Kod yanlış.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Doğrulama hatası.");
    }
    setLoading(false);
  };

  return (
    <div ref={pageRef}>
      <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
        {/* ═══ LEFT — BRANDING ═══ */}
        <div className="relative flex flex-col justify-center px-8 sm:px-16 py-16 overflow-hidden bg-[var(--color-dark-primary)]">
          <div className="orb orb-orange w-[500px] h-[500px] -bottom-[200px] -right-[200px] absolute" />
          <div className="relative z-10 max-w-md">
            <div className="reveal w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl mb-8 shadow-xl shadow-orange-500/20">
              <FaFire />
            </div>

            <h1 className="reveal delay-1 font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Güvenliğiniz
              <br />
              <span className="gradient-text">Bizim Önceliğimiz</span>
            </h1>

            <p className="reveal delay-2 text-slate-400 text-sm leading-relaxed mb-8">
              DAST ile yangın algılama ve bildirim sistemine hemen kayıt olun.
              Birkaç dakikada sistemi kullanmaya başlayın.
            </p>

            <div className="reveal delay-3 hidden lg:flex flex-col gap-3">
              {[
                [<FaCheckCircle key="1" />, "Dakikalar içinde kayıt"],
                [<FaBell key="2" />, "Gerçek zamanlı bildirimler"],
                [<FaShieldAlt key="3" />, "Güvenli OTP ile giriş"],
              ].map(([icon, text], i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-slate-500 text-sm"
                >
                  <span className="text-orange-400 text-xs">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT — FORMS ═══ */}
        <div className="flex flex-col justify-center px-8 sm:px-16 py-16 bg-[var(--color-dark-base)]">
          <div className="max-w-sm mx-auto w-full">
            {/* Tabs */}
            <div className="reveal flex p-1 rounded-xl bg-white/[0.03] border border-white/5 mb-8">
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setCodeSent(false);
                    setOtp("");
                  }}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${tab === t
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {t === "login" ? "Giriş Yap" : "Kayıt Ol"}
                </button>
              ))}
            </div>

            {/* ── LOGIN ── */}
            {tab === "login" && (
              <div className="animate-[fadeInUp_0.3s_ease]">
                <h2 className="text-2xl font-bold mb-1 font-[var(--font-display)]">
                  Hoş Geldiniz
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  E-posta adresinizle güvenli giriş yapın.
                </p>

                {!codeSent ? (
                  <form onSubmit={sendCode} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                        E-posta
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="ornek@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all duration-300"
                    >
                      {loading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verifyCode} className="space-y-4">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                      <FaInfoCircle />
                      <span>
                        <strong>{loginEmail}</strong> adresine kod gönderildi.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Doğrulama Kodu
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/8 text-white text-center text-2xl font-bold tracking-[8px] placeholder-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        maxLength={6}
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 transition-all duration-300"
                    >
                      {loading ? "Doğrulanıyor..." : "Giriş Yap"}
                    </button>

                    <div className="flex items-center justify-center gap-3 text-xs">
                      <button
                        type="button"
                        className="text-slate-500 hover:text-orange-400 transition-colors disabled:text-slate-700"
                        disabled={cooldown > 0 || loading}
                        onClick={sendCode}
                      >
                        {cooldown > 0
                          ? `Tekrar gönder (${cooldown}s)`
                          : "Tekrar gönder"}
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        type="button"
                        className="text-slate-500 hover:text-orange-400 transition-colors flex items-center gap-1"
                        onClick={() => {
                          setCodeSent(false);
                          setOtp("");
                        }}
                      >
                        <FaArrowLeft className="text-[10px]" /> Farklı e-posta
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ── REGISTER ── */}
            {tab === "register" && (
              <div className="animate-[fadeInUp_0.3s_ease]">
                <h2 className="text-2xl font-bold mb-1 font-[var(--font-display)]">
                  Kayıt Talebi
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  Bilgilerinizi doldurun, onay sonrası giriş yapabilirsiniz.
                </p>

                <form onSubmit={handleReg} className="space-y-4">
                  {[
                    {
                      label: "Ad Soyad",
                      name: "fullName",
                      type: "text",
                      ph: "Ahmet Yılmaz",
                    },
                    {
                      label: "E-posta",
                      name: "email",
                      type: "email",
                      ph: "ornek@email.com",
                    },
                  ].map(({ label, name, type, ph }) => (
                    <div key={name}>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                        {label}
                      </label>
                      <input
                        type={type}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder={ph}
                        value={reg[name]}
                        onChange={(e) =>
                          setReg((p) => ({ ...p, [name]: e.target.value }))
                        }
                        required
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Adres
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none h-20"
                      placeholder="Mahalle, Sokak, İlçe/İl"
                      value={reg.address}
                      onChange={(e) =>
                        setReg((p) => ({ ...p, address: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">
                      Acil Durum Kişileri{" "}
                      <span className="text-slate-600 normal-case">
                        (virgülle ayırın)
                      </span>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none h-20"
                      placeholder="İsim email@ornek.com, İsim2 email2@ornek.com"
                      value={reg.emergencyContacts}
                      onChange={(e) =>
                        setReg((p) => ({
                          ...p,
                          emergencyContacts: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 transition-all duration-300"
                  >
                    {loading ? "Gönderiliyor..." : "Talebi Gönder"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
