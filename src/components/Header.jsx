import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFireExtinguisher } from "react-icons/fa";
import { AiOutlineHome, AiOutlineInfoCircle, AiOutlineUser } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";

import "../css/Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("userEmail") !== null);

  // Sayfa içinde localStorage değişimini izleyerek güncelle
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("userEmail") !== null);
    };

    // Sayfa içindeki değişiklikleri de yakalamak için eventListener yerine interval tercih edebiliriz
    const interval = setInterval(handleStorageChange, 500); // 0.5 saniyede bir kontrol

    return () => clearInterval(interval); // Temizlik
  }, []);

  return (
    <header className="header">
      <div className="logo-section">
        <FaFireExtinguisher className="logo-icon" />
        <span className="logo-text">Yangın Söndürme ve Alarm Sistemi</span>
      </div>

      <nav className="nav-links">
        <Link to="/" className="nav-item">
          <AiOutlineHome /> Anasayfa
        </Link>
        <Link to="/aboutUs" className="nav-item">
          <AiOutlineInfoCircle /> Hakkımızda
        </Link>
        <Link to={isLoggedIn ? "/dashboard" : "/customer"} className="nav-item">
          <AiOutlineUser /> {isLoggedIn ? "Panel" : "Müşteri"}
        </Link>
        <div className="vertical-line" />
        <Link to="/support" className="nav-item">
          <BiSupport /> Yardım & Destek
        </Link>
      </nav>
    </header>
  );
}

export default Header;
