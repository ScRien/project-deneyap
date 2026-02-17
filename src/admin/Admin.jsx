import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useToast } from "../components/Toast";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";

function Admin() {
  const ADMIN_PASSWORD = "123456";
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) fetchPending();
  }, [loggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      toast.success("Admin girişi başarılı.");
    } else toast.error("Şifre yanlış!");
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "customers"), where("approved", "==", false));
      const snap = await getDocs(q);
      setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast.error("Liste yüklenemedi.");
    }
    setLoading(false);
  };

  const approve = async (id) => {
    try {
      await updateDoc(doc(db, "customers", id), { approved: true });
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Müşteri onaylandı.");
    } catch (err) {
      console.error(err);
      toast.error("Onay başarısız.");
    }
  };

  // ── Login ──
  if (!loggedIn) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-white/5 bg-white/[0.01] text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xl mx-auto mb-5 shadow-lg shadow-orange-500/20">
            <FaShieldAlt />
          </div>
          <h2 className="text-xl font-bold font-[var(--font-display)] mb-1">
            Admin Paneli
          </h2>
          <p className="text-slate-500 text-xs mb-6">
            Devam etmek için yönetici şifresini girin.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-white text-center text-lg tracking-widest placeholder-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Panel ──
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-[var(--font-display)] text-2xl font-bold">
          <span className="gradient-text">Yönetim Paneli</span>
        </h2>
        <button
          onClick={() => setLoggedIn(false)}
          className="px-4 py-2 rounded-lg border border-white/8 text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-all"
        >
          Çıkış
        </button>
      </div>

      {/* Stats */}
      <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] mb-8 inline-flex flex-col items-center">
        <div className="text-3xl font-bold text-orange-400 font-[var(--font-display)]">
          {customers.length}
        </div>
        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
          Bekleyen Talep
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 animate-pulse">
          Yükleniyor...
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16">
          <FaCheckCircle className="text-4xl text-green-500/40 mx-auto mb-3" />
          <p className="text-slate-500">
            Bekleyen müşteri yok — tüm talepler onaylanmış.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                {["Ad Soyad", "E-Posta", "Adres", "Acil Kişiler", "İşlem"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">
                    {c.fullName}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{c.email}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-[150px] truncate">
                    {c.address}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {Array.isArray(c.emergencyContacts)
                      ? c.emergencyContacts.join(", ")
                      : c.emergencyContacts || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => approve(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                    >
                      <FaCheckCircle className="text-[10px]" /> Onayla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
