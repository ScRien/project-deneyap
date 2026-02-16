import "../css/Customer.css";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Customer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    emergencyContacts: "",
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userEmail");
    if (stored) {
      setUser({ email: stored });
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emergencyContactsArr = formData.emergencyContacts
        .split(",")
        .map((c) => c.trim());

      await addDoc(collection(db, "customers"), {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        emergencyContacts: emergencyContactsArr,
        approved: false,
        createdAt: new Date(),
      });

      alert("Talebiniz alındı. Onay sonrası e-posta ile kod gönderilecek.");
      setFormData({
        fullName: "",
        email: "",
        address: "",
        emergencyContacts: "",
      });
    } catch (err) {
      console.error("Kayıt hatası:", err);
      alert("Kayıt sırasında hata oluştu.");
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!loginEmail) return alert("Lütfen e-posta girin.");

    try {
      // 1️⃣ Firestore'da bu email'e sahip müşteri var mı kontrol et
      const q = query(
        collection(db, "customers"),
        where("email", "==", loginEmail),
        where("approved", "==", true)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.");
        return;
      }

      // 2️⃣ Eğer varsa mail gönder
      const res = await fetch("http://localhost:5000/send-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: loginEmail,
          subject: "Giriş Kodunuz",
          text: "Kodunuz: 123456", // (Gerçek sistemde bu kodu random üretmelisin)
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCodeSent(true);
        alert("Doğrulama kodu e-posta adresinize gönderildi.");
      } else {
        alert(data.message || "Kod gönderilemedi.");
      }
    } catch (err) {
      console.error("Kod gönderme hatası:", err);
      alert("Kod gönderilirken hata oluştu.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!emailCode) return alert("Kod girin.");

    try {
      const res = await fetch("http://localhost:5000/verify-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: loginEmail, code: emailCode }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userEmail", loginEmail);
        setUser({ email: loginEmail });
        alert("Giriş başarılı!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Kod yanlış.");
      }
    } catch (err) {
      console.error("Kod doğrulama hatası:", err);
      alert("Doğrulama sırasında hata oluştu.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div className="customer-page">
      {!user ? (
        <>
          <section className="info-card">
            <h1>Müşteri Başvuru Sayfası</h1>
            <p>
              Duman algılandığında sistem e-posta ile uyarı gönderir. Önce kayıt
              talebinizi oluşturun, sonra giriş yapın.
            </p>
          </section>

          <section className="form-card">
            <h2>Kayıt Talebi</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Ad Soyad:
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                E-posta:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Adres:
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Acil Kişiler (virgülle ayır):
                <textarea
                  name="emergencyContacts"
                  value={formData.emergencyContacts}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Talebi Gönder</button>
            </form>
          </section>

          <section className="login-card">
            <h3>Giriş Yap</h3>
            <form onSubmit={codeSent ? handleLoginSubmit : handleSendCode}>
              <label>
                E-posta:
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={codeSent}
                  required
                />
              </label>

              {codeSent && (
                <label>
                  Kod:
                  <input
                    type="text"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    required
                  />
                </label>
              )}

              <button type="submit">
                {codeSent ? "Giriş Yap" : "Kodu Gönder"}
              </button>
            </form>
          </section>
        </>
      ) : (
        <section className="welcome-card">
          <h2>Yönetim Paneli</h2>
          <p>Giriş yaptınız: {user.email}</p>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </section>
      )}
    </div>
  );
}

export default Customer;
