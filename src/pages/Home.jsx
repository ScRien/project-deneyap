import "../css/Home.css";
import { FaBell, FaSms, FaUserCheck, FaDatabase, FaTools } from "react-icons/fa";
import { Link } from "react-router-dom";
import Image from "../assets/duman-dedektor.jpg";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Yangın Söndürme ve Alarm Sistemi</h1>
          <p>
            Duman algılandığında sizi, sevdiklerinizi ve yetkilileri anında bilgilendiren, güvenilir ve akıllı yangın algılama sistemi.
          </p>
          <Link to="/customer" className="cta-button">
            Müşteri Ol
          </Link>
        </div>
        <img src={Image} alt="Yangın Alarm Sistemi" className="hero-image" />
      </section>

      <section className="features">
        <h2>Nasıl Çalışır?</h2>
        <div className="feature-list">
          <div className="feature-card">
            <FaBell className="feature-icon" />
            <h3>Duman Dedektörleri</h3>
            <p>Sistemimizde yüksek hassasiyetli duman dedektörleri ortamı sürekli izler.</p>
          </div>
          <div className="feature-card">
            <FaSms className="feature-icon" />
            <h3>Hızlı SMS Bildirimi</h3>
            <p>Yangın durumunda size, belirlediğiniz acil kişilere ve itfaiyeye anında SMS gönderilir.</p>
          </div>
          <div className="feature-card">
            <FaUserCheck className="feature-icon" />
            <h3>Yetkili Onaylı Kayıt</h3>
            <p>Kayıtlarınız yetkili tarafından onaylandıktan sonra güvenle kullanabilirsiniz.</p>
          </div>
          <div className="feature-card">
            <FaDatabase className="feature-icon" />
            <h3>Canlı Sensör Takibi</h3>
            <p>Sensörlerin durumu düzenli olarak izlenir, sorunlar anında tespit edilir.</p>
          </div>
          <div className="feature-card">
            <FaTools className="feature-icon" />
            <h3>Erken Uyarı Sistemi</h3>
            <p>Sensör veri iletimi kesildiğinde sizi ve yetkilileri otomatik olarak bilgilendirir.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>Sisteme Nasıl Kayıt Olunur?</h2>
        <ol>
          <li>Sitemiz üzerinden müşteri olma talebinizi iletin.</li>
          <li>Yetkilimiz talebinizi inceleyip onay verir.</li>
          <li>Telefonunuza gelen SMS doğrulama kodu ile giriş yapabilirsiniz.</li>
          <li>Sensör verilerinizi kolayca takip edin ve güvenle yaşayın.</li>
          <li>Yangın durumunda sistem sizi, acil durum kişilerinizi ve itfaiyeyi anında bilgilendirir.</li>
        </ol>
      </section>

      <section className="support-section">
        <h2>Yardıma mı İhtiyacınız Var?</h2>
        <p>Uzman destek ekibimiz her zaman yanınızda.</p>
        <Link to="/support" className="cta-button">
          Destek Sayfası
        </Link>
      </section>
    </div>
  );
}

export default Home;
