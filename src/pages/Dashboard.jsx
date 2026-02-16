import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
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
import "../css/Dashboard.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [activeTab, setActiveTab] = useState("duman");
  const [recordLimit, setRecordLimit] = useState(20);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/");
    } else {
      setUserEmail(email);
    }
  }, [navigate]);

  useEffect(() => {
    const col = collection(db, "sensorData");
    const conditions = [];

    if (filterStatus === "safe") {
      conditions.push(where("status", "==", "✅ Ortam Güvenli."));
    } else if (filterStatus === "danger") {
      conditions.push(where("status", "==", "🚨 Yangın algılandı!"));
    }

    if (dateRange !== "all") {
      const days = parseInt(dateRange);
      const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      conditions.push(where("timestamp", ">=", Timestamp.fromDate(pastDate)));
    }

    const q = query(
      col,
      ...conditions,
      orderBy("timestamp", "desc"),
      limit(recordLimit)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.timestamp && data.timestamp.seconds) {
          data.timestamp = new Date(data.timestamp.seconds * 1000);
        } else if (typeof data.timestamp === "string") {
          data.timestamp = new Date(data.timestamp);
        }
        return data;
      });
      setData(items);
    });

    return () => unsubscribe();
  }, [recordLimit, filterStatus, dateRange]);

  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      if (!userEmail) return;
      const col = collection(db, "customers");
      const q = query(
        col,
        where("email", "==", userEmail),
        where("approved", "==", true)
      );
      const snapshot = await getDocs(q);
      const contacts = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.emergencyContacts && Array.isArray(data.emergencyContacts)) {
          data.emergencyContacts.forEach((entry) => {
            // entry string, "AdSoyad email" veya "email"
            const parts = entry.split(" ");
            if (parts.length >= 2) {
              const email = parts.pop(); // son parça e-posta
              const name = parts.join(" ");
              contacts.push({ name, email });
            } else {
              // sadece email var, name boş bırak
              contacts.push({ name: "", email: entry });
            }
          });
        }
      });
      setEmergencyContacts(contacts);
    };
    fetchEmergencyContacts();
  }, [userEmail]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleDeleteContact = async (index) => {
    const updated = [...emergencyContacts];
    updated.splice(index, 1);
    setEmergencyContacts(updated);

    const col = collection(db, "customers");
    const q = query(
      col,
      where("email", "==", userEmail),
      where("approved", "==", true)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      const ref = doc(db, "customers", docSnap.id);
      await updateDoc(ref, { emergencyContacts: updated });
    });
  };

  const handleEditContact = (index) => {
    const contact = emergencyContacts[index];
    setEditIndex(index);
    setEditName(contact.name);
    setEditEmail(contact.email);
  };

  const handleSaveEdit = async () => {
    const updated = [...emergencyContacts];
    updated[editIndex] = { name: editName, email: editEmail };
    setEmergencyContacts(updated);
    setEditIndex(null);

    const col = collection(db, "customers");
    const q = query(
      col,
      where("email", "==", userEmail),
      where("approved", "==", true)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      const ref = doc(db, "customers", docSnap.id);
      const newList = updated.map(
        (contact) => `${contact.name},${contact.email}`
      );
      await updateDoc(ref, { emergencyContacts: newList });
    });
  };

  const handleAddContact = async () => {
    if (!newEmail.trim()) {
      alert("E-posta zorunludur.");
      return;
    }
    // name zorunlu değil
    const updated = [
      ...emergencyContacts,
      { name: newName.trim(), email: newEmail.trim() },
    ];
    setEmergencyContacts(updated);
    setNewName("");
    setNewEmail("");

    const col = collection(db, "customers");
    const q = query(
      col,
      where("email", "==", userEmail),
      where("approved", "==", true)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      const ref = doc(db, "customers", docSnap.id);
      const firestoreContacts = updated.map((c) =>
        c.name ? `${c.name} ${c.email}` : c.email
      );
      await updateDoc(ref, { emergencyContacts: firestoreContacts });
    });
  };

  useEffect(() => {
    if (!userEmail) return;

    const col = collection(db, "sensorData");
    const conditions = [];

    if (filterStatus === "safe") {
      conditions.push(where("status", "==", "✅ Ortam Güvenli."));
    } else if (filterStatus === "danger") {
      conditions.push(where("status", "==", "🚨 Yangın algılandı!"));
    }

    if (dateRange !== "all") {
      const days = parseInt(dateRange);
      const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      conditions.push(where("timestamp", ">=", Timestamp.fromDate(pastDate)));
    }

    // query fonksiyonuna tüm where koşullarını tek tek ekle
    const q = query(
      col,
      ...conditions,
      orderBy("timestamp", "desc"),
      limit(recordLimit)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.timestamp && data.timestamp.seconds) {
          data.timestamp = new Date(data.timestamp.seconds * 1000);
        } else if (typeof data.timestamp === "string") {
          data.timestamp = new Date(data.timestamp);
        }
        return data;
      });
      setData(items);
    });

    return () => unsubscribe();
  }, [recordLimit, filterStatus, dateRange, userEmail]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🛠️ Deneyap Yönetim Paneli</h1>
        <div>
          {userEmail && <p className="user-info">Giriş yapan: {userEmail}</p>}
          <button className="logout-btn" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </header>

      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab("duman")}
          className={activeTab === "duman" ? "active" : ""}
        >
          Duman Bilgileri
        </button>
        <button
          onClick={() => setActiveTab("acil")}
          className={activeTab === "acil" ? "active" : ""}
        >
          Acil Durum Kişileri
        </button>
      </div>

      {activeTab === "duman" && (
        <div className="table-wrapper">
          <div className="filters">
            <select
              onChange={(e) => setRecordLimit(parseInt(e.target.value))}
              value={recordLimit}
            >
              <option value={20}>Son 20</option>
              <option value={50}>Son 50</option>
              <option value={100}>Son 100</option>
              <option value={250}>Son 250</option>
              <option value={500}>Son 500</option>
              <option value={9999}>Tümü</option>
            </select>
            <select
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="danger">Yangın Var</option>
              <option value="safe">Yangın Yok</option>
            </select>
          </div>
          <table className="sensor-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Anlık</th>
                <th>Min</th>
                <th>Max</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className={
                    row.current > 950 || row.status.includes("🚨")
                      ? "danger-row"
                      : ""
                  }
                >
                  <td>
                    {row.timestamp instanceof Date
                      ? row.timestamp.toLocaleString()
                      : "-"}
                  </td>
                  <td>{row.current}</td>
                  <td>{row.min}</td>
                  <td>{row.max}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "acil" && (
        <div className="table-wrapper">
          <h2>Acil Durum Kişileri</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="email"
              placeholder="E-posta"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button className="logout-btn" onClick={handleAddContact}>
              Ekle
            </button>
          </div>
          <table className="sensor-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ad Soyad</th>
                <th>E-Posta</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {emergencyContacts.map((contact, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    {editIndex === idx ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      contact.name
                    )}
                  </td>
                  <td>
                    {editIndex === idx ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      contact.email
                    )}
                  </td>
                  <td>
                    {editIndex === idx ? (
                      <>
                        <button className="logout-btn" onClick={handleSaveEdit}>
                          Kaydet
                        </button>
                        <button
                          className="logout-btn"
                          onClick={() => setEditIndex(null)}
                        >
                          İptal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="logout-btn"
                          onClick={() => handleEditContact(idx)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="logout-btn"
                          onClick={() => handleDeleteContact(idx)}
                        >
                          Sil
                        </button>
                      </>
                    )}
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

export default Dashboard;
