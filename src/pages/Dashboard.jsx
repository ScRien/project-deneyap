import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { useToast } from "../components/Toast";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  Timestamp,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  FaChartLine,
  FaUsers,
  FaSignOutAlt,
  FaPlus,
  FaPen,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [activeTab, setActiveTab] = useState("sensor");
  const [recordLimit, setRecordLimit] = useState(20);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(true);

  // Contacts
  const [contacts, setContacts] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) navigate("/customer");
    else setUserEmail(email);
  }, [navigate]);

  // Sensor data
  useEffect(() => {
    if (!userEmail) return;
    setLoading(true);
    const col = collection(db, "sensorData");
    const conditions = [];
    if (filterStatus === "safe")
      conditions.push(where("status", "==", "✅ Ortam Güvenli."));
    if (filterStatus === "danger")
      conditions.push(where("status", "==", "🚨 Yangın algılandı!"));
    if (dateRange !== "all") {
      const days = parseInt(dateRange);
      conditions.push(
        where("timestamp", ">=", Timestamp.fromDate(new Date(Date.now() - days * 86400000)))
      );
    }
    const q = query(col, ...conditions, orderBy("timestamp", "desc"), limit(recordLimit));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => {
          const row = d.data();
          if (row.timestamp?.seconds) row.timestamp = new Date(row.timestamp.seconds * 1000);
          else if (typeof row.timestamp === "string") row.timestamp = new Date(row.timestamp);
          return row;
        });
        setData(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [recordLimit, filterStatus, dateRange, userEmail]);

  // Emergency contacts
  useEffect(() => {
    if (!userEmail) return;
    (async () => {
      try {
        const q = query(collection(db, "customers"), where("email", "==", userEmail), where("approved", "==", true));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((d) => {
          const arr = d.data().emergencyContacts;
          if (Array.isArray(arr)) {
            arr.forEach((entry) => {
              const parts = entry.trim().split(" ");
              if (parts.length >= 2) {
                const email = parts.pop();
                list.push({ name: parts.join(" "), email });
              } else list.push({ name: "", email: entry.trim() });
            });
          }
        });
        setContacts(list);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userEmail]);

  const saveContacts = useCallback(
    async (updated) => {
      try {
        const q = query(collection(db, "customers"), where("email", "==", userEmail), where("approved", "==", true));
        const snap = await getDocs(q);
        const arr = updated.map((c) => (c.name ? `${c.name} ${c.email}` : c.email));
        for (const d of snap.docs) await updateDoc(doc(db, "customers", d.id), { emergencyContacts: arr });
      } catch (err) {
        console.error(err);
        toast.error("Kayıt başarısız.");
      }
    },
    [userEmail, toast]
  );

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const addContact = async () => {
    if (!newEmail.trim()) return toast.warning("E-posta zorunlu.");
    const updated = [...contacts, { name: newName.trim(), email: newEmail.trim() }];
    setContacts(updated);
    setNewName("");
    setNewEmail("");
    await saveContacts(updated);
    toast.success("Kişi eklendi.");
  };

  const deleteContact = async (idx) => {
    const updated = contacts.filter((_, i) => i !== idx);
    setContacts(updated);
    await saveContacts(updated);
    toast.info("Kişi silindi.");
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditName(contacts[idx].name);
    setEditEmail(contacts[idx].email);
  };

  const saveEdit = async () => {
    if (!editEmail.trim()) return;
    const updated = [...contacts];
    updated[editIdx] = { name: editName.trim(), email: editEmail.trim() };
    setContacts(updated);
    setEditIdx(null);
    await saveContacts(updated);
    toast.success("Güncellendi.");
  };

  const totalRecords = data.length;
  const dangerCount = data.filter((r) => r.status?.includes("🚨")).length;
  const safeCount = totalRecords - dangerCount;
  const latestValue = data.length > 0 ? data[0].current ?? "—" : "—";

  const inputClasses =
    "px-3 py-2 rounded-lg bg-white/[0.03] border border-white/8 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold">
            <span className="gradient-text">Kontrol Paneli</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-slate-400 text-sm hover:text-white hover:bg-white/5 transition-all"
        >
          <FaSignOutAlt className="text-xs" /> Çıkış
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Kayıt", value: totalRecords, color: "text-orange-400" },
          { label: "Güvenli", value: safeCount, color: "text-green-400" },
          { label: "Alarm", value: dangerCount, color: "text-red-400" },
          { label: "Son Değer", value: latestValue, color: "text-blue-400" },
        ].map((s, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/8 transition-colors"
          >
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              {s.label}
            </div>
            <div className={`text-2xl font-bold font-[var(--font-display)] ${s.color}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5 w-fit mb-6">
        {[
          { key: "sensor", icon: <FaChartLine />, label: "Sensör Verileri" },
          { key: "contacts", icon: <FaUsers />, label: "Acil Kişiler" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === t.key
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/15"
                : "text-slate-500 hover:text-slate-300"
              }`}
          >
            <span className="text-xs">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Sensor ── */}
      {activeTab === "sensor" && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              {
                value: recordLimit,
                onChange: (e) => setRecordLimit(parseInt(e.target.value)),
                options: [
                  [20, "Son 20"],
                  [50, "Son 50"],
                  [100, "Son 100"],
                  [500, "Son 500"],
                ],
              },
              {
                value: filterStatus,
                onChange: (e) => setFilterStatus(e.target.value),
                options: [
                  ["all", "Tüm Durumlar"],
                  ["danger", "🚨 Yangın"],
                  ["safe", "✅ Güvenli"],
                ],
              },
              {
                value: dateRange,
                onChange: (e) => setDateRange(e.target.value),
                options: [
                  ["all", "Tüm Zamanlar"],
                  ["1", "Son 24 Saat"],
                  ["7", "Son 7 Gün"],
                  ["30", "Son 30 Gün"],
                ],
              },
            ].map((sel, i) => (
              <select key={i} className={inputClasses} value={sel.value} onChange={sel.onChange}>
                {sel.options.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">
              Yükleniyor...
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-500">Henüz veri yok.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    {["Tarih", "Anlık", "Min", "Max", "Durum"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.map((row, i) => {
                    const isDanger = row.current > 950 || row.status?.includes("🚨");
                    return (
                      <tr key={i} className={`transition-colors ${isDanger ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-white/[0.02]"}`}>
                        <td className="px-4 py-3 text-slate-400">
                          {row.timestamp instanceof Date ? row.timestamp.toLocaleString("tr-TR") : "—"}
                        </td>
                        <td className="px-4 py-3 text-white font-medium">{row.current ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-400">{row.min ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-400">{row.max ?? "—"}</td>
                        <td className={`px-4 py-3 font-medium ${isDanger ? "text-red-400" : "text-green-400"}`}>
                          {row.status ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Contacts ── */}
      {activeTab === "contacts" && (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              type="text"
              className={`${inputClasses} flex-1 min-w-[140px]`}
              placeholder="Ad Soyad"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="email"
              className={`${inputClasses} flex-1 min-w-[180px]`}
              placeholder="E-posta"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button
              onClick={addContact}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <FaPlus className="text-xs" /> Ekle
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">👤</div>
              <p className="text-slate-500">Henüz kişi eklenmemiş.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    {["#", "Ad Soyad", "E-Posta", "İşlem"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contacts.map((c, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3">
                        {editIdx === i ? (
                          <input className={inputClasses} value={editName} onChange={(e) => setEditName(e.target.value)} />
                        ) : (
                          <span className="text-white">{c.name || "—"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editIdx === i ? (
                          <input className={inputClasses} value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                        ) : (
                          <span className="text-slate-400">{c.email}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {editIdx === i ? (
                            <>
                              <button onClick={saveEdit} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                                <FaSave className="text-xs" />
                              </button>
                              <button onClick={() => setEditIdx(null)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">
                                <FaTimes className="text-xs" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(i)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                <FaPen className="text-xs" />
                              </button>
                              <button onClick={() => deleteContact(i)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                <FaTrash className="text-xs" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
