import "../css/About.css";
import deneyapImg from "../assets/deneyap.jpg";
import tubitakImg from "../assets/tubitak.png";
import senlikImg from "../assets/senlik.png";

function About() {
  return (
    <div className="about-page">
      <header className="about-hero">
        <h1>Hakkımızda</h1>
        <p>
          Bu proje, Deneyap Teknoloji Atölyeleri ve TÜBİTAK desteğiyle,
          yangın güvenliğini dijitalleştirmek ve herkes için daha güvenli yaşam alanları sunmak amacıyla geliştirilmiştir.
        </p>
      </header>

      <section className="card-grid">
        <div className="card">
          <img src={deneyapImg} alt="Deneyap" />
          <h2>Deneyap Atölyeleri</h2>
          <p>
            Türkiye'nin dört bir yanında gençlerin teknoloji üretmesini
            destekleyen Deneyap; bu projenin doğduğu yer.
          </p>
        </div>
        <div className="card">
          <img src={tubitakImg} alt="TÜBİTAK" />
          <h2>TÜBİTAK Desteği</h2>
          <p>
            Bilim ve teknolojiyi destekleyen TÜBİTAK, bu projeye rehberlik ve kaynak sunarak büyümesini sağladı.
          </p>
        </div>
        <div className="card">
          <img src={senlikImg} alt="Proje Şenliği" />
          <h2>Proje Şenliği</h2>
          <p>
            Genç projelerin tanıtıldığı etkinlikte yerimizi aldık. Projemiz ziyaretçilerden büyük ilgi gördü.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
