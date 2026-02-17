import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Customer from "./pages/Customer";
import Support from "./pages/Support";
import Admin from "./admin/Admin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-dark-base)]">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route
            path="/dashboard"
            element={
              localStorage.getItem("userEmail") ? (
                <Dashboard />
              ) : (
                <Navigate to="/customer" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
