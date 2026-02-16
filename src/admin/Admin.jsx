import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function Admin() {
  // Basit admin şifresi
  const ADMIN_PASSWORD = "123456"; // İstersen değiştirebilirsin

  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admin giriş kontrolü
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      fetchPendingCustomers();
    } else {
      alert("Şifre yanlış");
    }
  };

  // Onaylanmamış müşterileri çek
  const fetchPendingCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "customers"), where("approved", "==", false));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(list);
    } catch (error) {
      alert("Müşteriler alınamadı");
      console.error(error);
    }
    setLoading(false);
  };

  // Müşteriyi onayla
  const approveCustomer = async (id) => {
    try {
      const customerRef = doc(db, "customers", id);
      await updateDoc(customerRef, { approved: true });
      alert("Müşteri onaylandı");
      fetchPendingCustomers(); // Listeyi güncelle
    } catch (error) {
      alert("Onaylama başarısız");
      console.error(error);
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Admin Girişi</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Onay Bekleyen Müşteriler</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : customers.length === 0 ? (
        <p>Onay bekleyen müşteri yok.</p>
      ) : (
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-Mail</th>
              <th>Adres</th>
              <th>Acil Durumda Aranacak Kişiler</th>
              <th>Onay Durumu</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>{c.address}</td>
                <td>{c.emergencyContacts.join(", ")}</td>
                <td>
                  <button onClick={() => approveCustomer(c.id)}>Onayla</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
