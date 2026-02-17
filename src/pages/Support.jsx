import { useState, useRef } from "react";
import { useScrollRevealAll } from "../hooks/useScrollReveal";
import { CONFIG } from "../config";
import {
  FaPlus,
  FaMinus,
  FaEnvelope,
  FaGithub,
  FaQuestionCircle,
  FaChevronDown,
  FaLifeRing,
  FaBookOpen,
  FaComments,
} from "react-icons/fa";

const CATEGORIES = [
  {
    id: "general",
    icon: <FaBookOpen />,
    label: "Genel",
    items: [
      {
        q: "DAST nedir?",
        a: "DAST (Deneyap Akıllı Sensör Teknolojisi), IoT tabanlı duman dedektörlerinden gelen verileri gerçek zamanlı izleyen ve tehlike anında kullanıcıları bilgilendiren bir yangın algılama ve alarm sistemidir.",
      },
      {
        q: "Sistem nasıl çalışıyor?",
        a: "ESP32 mikrodenetleyiciye bağlı MQ-2 duman sensörü ortamı sürekli izler. Duman algılandığında veriler Firebase üzerinden dashboard'a iletilir ve kayıtlı kişilere otomatik e-posta gönderilir.",
      },
      {
        q: "Proje kimler tarafından geliştirildi?",
        a: "Bu proje, Deneyap Teknoloji Atölyeleri bünyesinde TÜBİTAK desteğiyle geliştirilmektedir. Detaylı bilgi için Hakkımızda sayfasını ziyaret edebilirsiniz.",
      },
    ],
  },
  {
    id: "account",
    icon: <FaQuestionCircle />,
    label: "Hesap",
    items: [
      {
        q: "Müşteri olmak için ne yapmalıyım?",
        a: "Panel sayfasından 'Kayıt Ol' sekmesine geçerek ad-soyad, e-posta, adres ve acil durum kişi bilgilerinizi doldurmanız yeterlidir. Yetkilimiz talebinizi inceleyip onayladıktan sonra giriş yapabilirsiniz.",
      },
      {
        q: "Giriş için şifre gerekli mi?",
        a: "Hayır! DAST, şifresiz (passwordless) giriş kullanır. E-postanıza tek seferlik 6 haneli doğrulama kodu gönderilir. Bu kod 5 dakika geçerlidir.",
      },
      {
        q: "Doğrulama kodu gelmiyor, ne yapmalıyım?",
        a: "Öncelikle spam/gereksiz klasörünüzü kontrol edin. Hâlâ gelmediyse 60 saniye sonra 'Tekrar gönder' butonuna basabilirsiniz. Sorun devam ederse destek ekibimize ulaşın.",
      },
    ],
  },
  {
    id: "features",
    icon: <FaComments />,
    label: "Özellikler",
    items: [
      {
        q: "Acil durum kişilerimi nasıl yönetirim?",
        a: "Dashboard'daki 'Acil Kişiler' sekmesinden acil durum kişilerinizi ekleyebilir, düzenleyebilir veya silebilirsiniz. Yangın algılandığında bu kişilere de bildirim gönderilir.",
      },
      {
        q: "Sensör verileri ne sıklıkla güncellenir?",
        a: "Veriler Firebase Firestore üzerinden gerçek zamanlı (realtime) aktarılır ve dashboard'a anında yansır. Filtreleme ile son 24 saat, 7 gün veya 30 günlük verileri görebilirsiniz.",
      },
      {
        q: "Yangın dışındaki dumanı da algılıyor mu?",
        a: "MQ-2 sensörü yanıcı gazlar ve duman partikülleri algılar. Sigara dumanı veya mutfak buharı gibi durumlarda da tetiklenebilir. Eşik değerleri bu tür yanlış alarmları minimize edecek şekilde kalibre edilmiştir.",
      },
    ],
  },
];

function Support() {
  const pageRef = useRef(null);
  useScrollRevealAll(pageRef);

  const [activeCat, setActiveCat] = useState("general");
  const [openIdx, setOpenIdx] = useState(null);

  const currentItems =
    CATEGORIES.find((c) => c.id === activeCat)?.items || [];

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <div ref={pageRef}>
      {/* ═══ HERO ═══ */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="orb orb-orange w-[500px] h-[500px] -top-[200px] left-1/2 -translate-x-1/2 absolute" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="reveal inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white text-2xl mb-6 mx-auto shadow-xl shadow-orange-500/20">
            <FaLifeRing />
          </div>
          <h1 className="reveal delay-1 font-[var(--font-display)] text-4xl sm:text-5xl font-extrabold mb-4">
            Destek <span className="gradient-text">Merkezi</span>
          </h1>
          <p className="reveal delay-2 text-slate-400 text-lg max-w-xl mx-auto">
            Sıkça sorulan sorulara göz atın veya destek ekibimize ulaşın.
          </p>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="py-20 bg-[var(--color-dark-secondary)] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          {/* Category tabs */}
          <div className="reveal flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCat(cat.id);
                  setOpenIdx(null);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeCat === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300 hover:bg-white/[0.02]"
                  }`}
              >
                <span className="text-xs">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {currentItems.map((item, idx) => (
              <div
                key={`${activeCat}-${idx}`}
                className="reveal rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10"
                style={{ transitionDelay: `${idx * 0.08}s` }}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${openIdx === idx ? "text-orange-400" : "text-white"
                      }`}
                  >
                    {item.q}
                  </span>
                  <span
                    className={`text-orange-400 transition-transform duration-300 flex-shrink-0 ${openIdx === idx ? "rotate-180" : ""
                      }`}
                  >
                    <FaChevronDown className="text-xs" />
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${openIdx === idx ? "max-h-[400px]" : "max-h-0"
                    }`}
                >
                  <div className="px-6 pb-5 pt-0 border-t border-white/5">
                    <p className="text-sm text-slate-400 leading-relaxed pt-4">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb orb-blue w-[400px] h-[400px] -bottom-[100px] -right-[100px] absolute" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="reveal font-[var(--font-display)] text-2xl sm:text-3xl font-bold mb-3">
              Sorunuz Burada <span className="gradient-text">Yanıtlanmadıysa</span>
            </h2>
            <p className="reveal delay-1 text-slate-500 text-sm">
              Doğrudan bize ulaşabilirsiniz.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href={`mailto:${CONFIG.CONTACT_EMAIL}`}
              className="reveal group p-6 rounded-2xl border border-white/5 hover:border-orange-500/15 bg-white/[0.01] hover:bg-orange-500/[0.02] transition-all duration-300 no-underline text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-3 text-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                <FaEnvelope />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                E-posta
              </h3>
              <p className="text-xs text-slate-500">{CONFIG.CONTACT_EMAIL}</p>
            </a>

            <a
              href={CONFIG.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal delay-1 group p-6 rounded-2xl border border-white/5 hover:border-purple-500/15 bg-white/[0.01] hover:bg-purple-500/[0.02] transition-all duration-300 no-underline text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3 text-xl group-hover:bg-purple-500 group-hover:text-white transition-all">
                <FaGithub />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">GitHub</h3>
              <p className="text-xs text-slate-500">Kaynak kodunu inceleyin</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Support;
