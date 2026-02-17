import { useRef } from "react";
import { useScrollRevealAll } from "../hooks/useScrollReveal";
import { FaLinkedin, FaGithub, FaQuoteLeft } from "react-icons/fa";

const TEAM = [
  {
    name: "Muhammet",
    role: "Proje Lideri & Full-Stack Geliştirici",
    avatar: "M",
    color: "from-orange-500 to-red-500",
    desc: "Sistem mimarisi, frontend/backend geliştirme ve IoT entegrasyonu.",
  },
  {
    name: "Deneyap Mentor",
    role: "Teknik Danışman",
    avatar: "D",
    color: "from-blue-500 to-cyan-500",
    desc: "Proje rehberliği, teknik danışmanlık ve kod incelemesi.",
  },
  {
    name: "Ekip Üyesi",
    role: "Donanım & Sensör Tasarımı",
    avatar: "E",
    color: "from-purple-500 to-pink-500",
    desc: "Duman dedektörü devre tasarımı ve IoT sensör kalibrasyonu.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "Fikir & Araştırma",
    desc: "Yangın güvenliği sorunları araştırıldı, IoT tabanlı çözüm konsepti oluşturuldu.",
  },
  {
    year: "2025",
    title: "Geliştirme",
    desc: "Donanım prototipi, sensör entegrasyonu, web platformu ve backend altyapısı geliştirildi.",
  },
  {
    year: "2026",
    title: "Test & Sunum",
    desc: "Sistem testleri, TÜBİTAK 4006 sergisi ve kullanıcı geri bildirimleri ile iyileştirmeler.",
  },
];

function About() {
  const pageRef = useRef(null);
  useScrollRevealAll(pageRef);

  return (
    <div ref={pageRef}>
      {/* ═══ HERO ═══ */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="orb orb-orange w-[500px] h-[500px] -top-[200px] left-1/2 -translate-x-1/2 absolute" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
            Hakkımızda
          </span>
          <h1 className="reveal delay-1 font-[var(--font-display)] text-4xl sm:text-5xl font-extrabold mb-6">
            Gençlerin{" "}
            <span className="gradient-text">Geleceği İnşa Etme</span>{" "}
            Hikayesi
          </h1>
          <p className="reveal delay-2 text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            Bu proje, Deneyap Teknoloji Atölyeleri bünyesinde TÜBİTAK desteğiyle
            geliştirilmiştir. Amacımız IoT tabanlı akıllı bir yangın algılama ve
            bildirim sistemi oluşturarak topluma değer katmaktır.
          </p>
        </div>
      </section>

      {/* ═══ PARTNERS ═══ */}
      <section className="py-20 bg-[var(--color-dark-secondary)] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="reveal font-[var(--font-display)] text-2xl sm:text-3xl font-bold">
              Destekleyenler
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Deneyap */}
            <div className="reveal group p-6 rounded-2xl border border-white/5 hover:border-orange-500/15 bg-white/[0.01] hover:bg-orange-500/[0.02] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                D
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Deneyap Teknoloji Atölyeleri
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                T.C. Sanayi ve Teknoloji Bakanlığı öncülüğünde, TÜBİTAK
                koordinasyonunda faaliyet gösteren Deneyap Teknoloji Atölyeleri,
                gençlere yazılım, robotik, elektronik ve yapay zeka alanlarında
                eğitim sunar.
              </p>
            </div>

            {/* TÜBİTAK */}
            <div className="reveal delay-1 group p-6 rounded-2xl border border-white/5 hover:border-blue-500/15 bg-white/[0.01] hover:bg-blue-500/[0.02] transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                T
              </div>
              <h3 className="text-lg font-bold text-white mb-2">TÜBİTAK</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Türkiye Bilimsel ve Teknolojik Araştırma Kurumu, bilimsel
                araştırmaları destekler ve koordine eder. Deneyap programının
                koordinatörlüğünü yürütmektedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
              Yolculuk
            </span>
            <h2 className="reveal delay-1 font-[var(--font-display)] text-2xl sm:text-3xl font-bold">
              Proje Zaman Çizelgesi
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/30 via-orange-500/10 to-transparent" />

            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  className="reveal flex gap-6"
                  style={{ transitionDelay: `${i * 0.15}s` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold z-10 relative">
                      {item.year}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="py-24 bg-[var(--color-dark-secondary)] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
              Ekip
            </span>
            <h2 className="reveal delay-1 font-[var(--font-display)] text-2xl sm:text-3xl font-bold">
              Arkasındaki İnsanlar
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="reveal group text-center p-6 rounded-2xl border border-white/5 hover:border-orange-500/10 bg-white/[0.01] transition-all duration-500"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  {member.avatar}
                </div>
                <h3 className="text-base font-semibold text-white mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs text-orange-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section className="py-20 relative overflow-hidden">
        <div className="orb orb-orange w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute" />
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <FaQuoteLeft className="reveal text-3xl text-orange-500/30 mx-auto mb-6" />
          <p className="reveal delay-1 text-xl sm:text-2xl text-slate-300 font-medium leading-relaxed italic mb-6">
            "Teknoloji, insanların hayatını korumak için kullanıldığında gerçek
            anlamını bulur."
          </p>
          <div className="reveal delay-2">
            <span className="text-sm text-slate-500">— DAST Ekibi</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
