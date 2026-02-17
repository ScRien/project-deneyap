import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollRevealAll } from "../hooks/useScrollReveal";
import {
  FaFire,
  FaBell,
  FaEnvelope,
  FaShieldAlt,
  FaChartLine,
  FaUserCheck,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

function Home() {
  const pageRef = useRef(null);
  useScrollRevealAll(pageRef);

  return (
    <div ref={pageRef}>
      {/* ═══════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Ambient Orbs */}
        <div className="orb orb-orange w-[700px] h-[700px] -top-[200px] -right-[200px] absolute" />
        <div className="orb orb-red w-[500px] h-[500px] -bottom-[250px] -left-[150px] absolute" />
        <div className="orb orb-blue w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute" />

        {/* Floating decoration */}
        <div className="absolute top-24 right-16 w-20 h-20 border border-orange-500/10 rounded-2xl rotate-12 animate-[float_6s_ease-in-out_infinite] hidden lg:block" />
        <div className="absolute bottom-32 left-20 w-14 h-14 border border-red-500/10 rounded-xl -rotate-12 animate-[float_8s_ease-in-out_infinite_reverse] hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <div>
              <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Deneyap & TÜBİTAK Projesi
              </div>

              <h1 className="reveal delay-1 font-[var(--font-display)] text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6">
                Akıllı
                <br />
                <span className="gradient-text">Yangın Algılama</span>
                <br />
                Sistemi
              </h1>

              <p className="reveal delay-2 text-slate-400 text-lg leading-relaxed max-w-lg mb-8">
                Duman algılandığında sizi, sevdiklerinizi ve yetkilileri anında
                bilgilendiren IoT tabanlı güvenilir yangın algılama ve bildirim
                platformu.
              </p>

              <div className="reveal delay-3 flex flex-wrap gap-3">
                <Link
                  to="/customer"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 no-underline"
                >
                  Hemen Başla
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-300 no-underline"
                >
                  Ürünlerimizi Keşfet
                </Link>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div className="reveal-scale delay-2 relative flex justify-center">
              {/* Outer ring */}
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-orange-500/10 flex items-center justify-center animate-[rotate-slow_40s_linear_infinite] relative">
                {/* Orbiting dots */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />

                {/* Inner ring */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-orange-500/5 flex items-center justify-center animate-[counter-rotate_40s_linear_infinite]">
                  {/* Center icon */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 flex items-center justify-center shadow-2xl shadow-orange-500/10">
                    <FaFire className="text-4xl sm:text-5xl text-orange-400 animate-[float_3s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 top-20 glass-strong rounded-xl px-4 py-3 animate-[float_5s_ease-in-out_infinite] shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                    <FaCheckCircle className="text-green-400 text-sm" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Durum</div>
                    <div className="text-sm font-semibold text-green-400">
                      Güvenli
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-24 glass-strong rounded-xl px-4 py-3 animate-[float_6s_ease-in-out_infinite_reverse] shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                    <FaBell className="text-orange-400 text-sm" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500">Sensör</div>
                    <div className="text-sm font-semibold text-white">
                      7/24 Aktif
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — STATS BAR
          ═══════════════════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-[var(--color-dark-secondary)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {[
            ["7/24", "Kesintisiz İzleme"],
            ["<5sn", "Bildirim Hızı"],
            ["%99.9", "Uptime Oranı"],
            ["IoT", "Sensör Teknolojisi"],
          ].map(([val, label], i) => (
            <div
              key={i}
              className="reveal flex flex-col items-center py-8 hover:bg-white/[0.02] transition-colors"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-[var(--font-display)]">
                {val}
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — STORY: Problem
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="orb orb-red w-[500px] h-[500px] -top-[100px] -left-[200px] absolute" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Illustration */}
            <div className="reveal-left flex justify-center">
              <div className="relative w-80 h-80">
                {/* Warning pulse rings */}
                <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-[pulse-ring_3s_ease-out_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-red-500/15 animate-[pulse-ring_3s_ease-out_infinite_0.5s]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/10 flex items-center justify-center border border-red-500/20">
                    <span className="text-6xl">🔥</span>
                  </div>
                </div>
                {/* Scattered stats */}
                <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-xs text-red-400 font-semibold">
                  +%47 risk
                </div>
                <div className="absolute bottom-8 left-0 glass rounded-lg px-3 py-2 text-xs text-orange-400 font-semibold">
                  Geç bildirim
                </div>
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <span className="reveal text-xs font-semibold uppercase tracking-widest text-red-400 mb-3 block">
                Problem
              </span>
              <h2 className="reveal delay-1 font-[var(--font-display)] text-3xl sm:text-4xl font-bold leading-tight mb-6">
                Geleneksel Sistemler{" "}
                <span className="text-red-400">Yeterli Değil</span>
              </h2>
              <p className="reveal delay-2 text-slate-400 text-base leading-relaxed mb-6">
                Türkiye'de her yıl binlerce yangın vakası yaşanıyor. Geleneksel
                alarm sistemleri sadece ses çıkarıyor — sizle iletişime
                geçemiyor. Evde olmadığınızda, uyuduğunuzda veya uzaktayken
                kritik dakikalar kaybediliyor.
              </p>
              <div className="reveal delay-3 flex flex-col gap-3">
                {[
                  "Yangınların %72'si bildirim eksikliğinden büyüyor",
                  "Geleneksel alarmların sesini komşular bile duyamıyor",
                  "Uzaktan müdahale imkanı sıfır",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-slate-400 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — STORY: Solution
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--color-dark-secondary)] relative overflow-hidden">
        <div className="orb orb-orange w-[600px] h-[600px] -bottom-[200px] -right-[200px] absolute" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <div>
              <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
                Çözüm
              </span>
              <h2 className="reveal delay-1 font-[var(--font-display)] text-3xl sm:text-4xl font-bold leading-tight mb-6">
                DAST ile{" "}
                <span className="gradient-text">Akıllı Koruma</span>
              </h2>
              <p className="reveal delay-2 text-slate-400 text-base leading-relaxed mb-8">
                DAST, IoT duman dedektörlerinden gelen verileri gerçek zamanlı
                işler ve tehlike anında hem sizi hem de belirlediğiniz acil
                kişileri anında bilgilendirir. Nerede olursanız olun, güvende
                olun.
              </p>

              <div className="reveal delay-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <FaBell />,
                    title: "Anlık Bildirim",
                    desc: "Yangın algılandığında saniyeler içinde e-posta bildirimi",
                  },
                  {
                    icon: <FaChartLine />,
                    title: "Canlı İzleme",
                    desc: "Gerçek zamanlı sensör verilerini dashboard üzerinden takip",
                  },
                  {
                    icon: <FaUserCheck />,
                    title: "Onaylı Sistem",
                    desc: "Yetkili tarafından onaylanmış güvenli müşteri kayıt süreci",
                  },
                  {
                    icon: <FaShieldAlt />,
                    title: "Erken Uyarı",
                    desc: "Sensör iletimi kesildiğinde otomatik bilgilendirme",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-xl border border-white/5 hover:border-orange-500/20 hover:bg-orange-500/[0.03] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Illustration */}
            <div className="reveal-right flex justify-center">
              <div className="relative">
                {/* Dashboard mockup */}
                <div className="w-80 sm:w-96 glass-strong rounded-2xl p-5 border border-white/10 shadow-2xl">
                  {/* Top bar */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-3 text-[10px] text-slate-600">
                      dashboard.dast.app
                    </span>
                  </div>
                  {/* Mock stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      ["128", "Veri"],
                      ["0", "Alarm"],
                      ["✓", "Güvenli"],
                    ].map(([v, l], i) => (
                      <div
                        key={i}
                        className="bg-white/[0.03] rounded-lg p-3 text-center"
                      >
                        <div className="text-lg font-bold text-orange-400">
                          {v}
                        </div>
                        <div className="text-[10px] text-slate-500">{l}</div>
                      </div>
                    ))}
                  </div>
                  {/* Mock rows */}
                  {[1, 2, 3, 4].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <div className="h-2 w-20 bg-white/5 rounded" />
                      </div>
                      <div className="h-2 w-12 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>

                {/* Side notification */}
                <div className="absolute -right-6 top-12 glass-strong rounded-xl px-4 py-3 shadow-xl animate-[float_5s_ease-in-out_infinite]">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-orange-400 text-sm" />
                    <span className="text-xs text-white font-medium">
                      Bildirim gönderildi
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS (Steps)
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
              Nasıl Çalışır?
            </span>
            <h2 className="reveal delay-1 font-[var(--font-display)] text-3xl sm:text-4xl font-bold">
              5 Kolay Adımda Güvenlik
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                num: "01",
                title: "Kayıt Talebi",
                desc: "Müşteri formunu doldurun ve kayıt talebinizi gönderin.",
              },
              {
                num: "02",
                title: "Yetkili Onayı",
                desc: "Ekibimiz talebinizi inceleyip en kısa sürede onaylar.",
              },
              {
                num: "03",
                title: "Güvenli Giriş",
                desc: "E-postanıza gelen 6 haneli doğrulama kodu ile giriş yapın.",
              },
              {
                num: "04",
                title: "Canlı Takip",
                desc: "Dashboard üzerinden sensör verilerinizi gerçek zamanlı izleyin.",
              },
              {
                num: "05",
                title: "Anında Bildirim",
                desc: "Yangın algılandığında siz ve acil kişileriniz hemen bilgilendirilirsiniz.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="reveal group flex items-start gap-6 p-6 rounded-xl border border-white/5 hover:border-orange-500/15 hover:bg-orange-500/[0.02] transition-all duration-300"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="text-2xl font-extrabold text-orange-500/30 group-hover:text-orange-400 transition-colors font-[var(--font-display)] flex-shrink-0">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — CTA
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden border-t border-white/5">
        <div className="orb orb-orange w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute" />
        <div className="relative z-10 text-center max-w-xl mx-auto px-6">
          <h2 className="reveal font-[var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            Güvenliğinizi{" "}
            <span className="gradient-text">Bugün</span> Başlatın
          </h2>
          <p className="reveal delay-1 text-slate-500 mb-8">
            Birkaç dakikada kayıt olun, onay sonrası sisteme hemen erişin.
          </p>
          <div className="reveal delay-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/customer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 no-underline"
            >
              Müşteri Ol
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 transition-all duration-300 no-underline"
            >
              Destek Al
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
