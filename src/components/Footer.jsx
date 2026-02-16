import { FaGithub, FaEnvelope } from "react-icons/fa";
import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        © {new Date().getFullYear()} Yangın Söndürme ve Alarm Sistemi
      </div>
      <div className="footer-right">
        <a href="mailto:destekbolibolingolimbombo@gmail.com" className="footer-link">
          <FaEnvelope /> İletişim
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
          <FaGithub /> GitHub
        </a>
      </div>
    </footer>
  );
}

export default Footer;
