import { Routes, Route, Navigate } from "react-router-dom";
import "./css/App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Customer from "./pages/Customer";
import Support from "./pages/Support";
import Admin from "./admin/Admin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutUs" element={<About />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard"
            element={
              localStorage.getItem("userEmail") ? (
                <Dashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
