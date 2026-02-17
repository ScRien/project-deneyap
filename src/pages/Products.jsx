import { useRef } from "react";
import { Link } from "react-router-dom";
import { useScrollRevealAll } from "../hooks/useScrollReveal";
import {
    FaFire,
    FaWifi,
    FaServer,
    FaMobileAlt,
    FaBell,
    FaArrowRight,
    FaCheckCircle,
    FaCogs,
    FaCloud,
    FaEnvelope,
} from "react-icons/fa";

const PRODUCTS = [
    {
        icon: <FaFire />,
        title: "DAST Sensör Ünitesi",
        desc: "Yüksek hassasiyetli MQ-2 duman sensörü ile donatılmış, ESP32 tabanlı IoT algılama ünitesi. 7/24 ortamı izler ve anomali tespit eder.",
        features: [
            "MQ-2 Duman Sensörü",
            "ESP32 Mikrodenetleyici",
            "Wi-Fi Bağlantı",
            "Düşük Güç Tüketimi",
        ],
        color: "from-orange-500 to-red-500",
        glow: "shadow-orange-500/20",
    },
    {
        icon: <FaServer />,
        title: "Bulut Altyapısı",
        desc: "Firebase Firestore üzerinde gerçek zamanlı veri akışı ve depolama. Sensör verileri milisaniyeler içinde dashboard'a yansır.",
        features: [
            "Firebase Firestore",
            "Gerçek Zamanlı Sync",
            "Güvenli API",
            "Otomatik Ölçeklendirme",
        ],
        color: "from-blue-500 to-cyan-500",
        glow: "shadow-blue-500/20",
    },
    {
        icon: <FaMobileAlt />,
        title: "Web Dashboard",
        desc: "Modern, responsive web arayüzü ile sensör verilerinizi her cihazdan takip edin. Acil durum kişilerinizi yönetin.",
        features: [
            "Responsive Tasarım",
            "Canlı Veri Tablosu",
            "Kişi Yönetimi",
            "E-Posta ile Giriş",
        ],
        color: "from-purple-500 to-pink-500",
        glow: "shadow-purple-500/20",
    },
];

const TECH_STACK = [
    { icon: <FaCogs />, label: "ESP32 + MQ-2", desc: "Sensör Donanımı" },
    { icon: <FaWifi />, label: "Wi-Fi / HTTP", desc: "İletişim" },
    { icon: <FaCloud />, label: "Firebase", desc: "Bulut Veritabanı" },
    { icon: <FaBell />, label: "React", desc: "Web Arayüzü" },
    { icon: <FaServer />, label: "Express.js", desc: "Backend API" },
    { icon: <FaEnvelope />, label: "Nodemailer", desc: "E-posta Bildirimi" },
];

function Products() {
    const pageRef = useRef(null);
    useScrollRevealAll(pageRef);

    return (
        <div ref={pageRef}>
            {/* ═══ HERO ═══ */}
            <section className="relative py-24 text-center overflow-hidden">
                <div className="orb orb-orange w-[600px] h-[600px] -top-[200px] left-1/2 -translate-x-1/2 absolute" />
                <div className="max-w-3xl mx-auto px-6 relative z-10">
                    <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
                        Ürünlerimiz
                    </span>
                    <h1 className="reveal delay-1 font-[var(--font-display)] text-4xl sm:text-5xl font-extrabold mb-6">
                        Uçtan Uca{" "}
                        <span className="gradient-text">Yangın Güvenliği</span>{" "}
                        Çözümü
                    </h1>
                    <p className="reveal delay-2 text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                        Sensörden ekrana, algılamadan bildirime — tüm süreç DAST
                        ekosisteminde entegre çalışır.
                    </p>
                </div>
            </section>

            {/* ═══ PRODUCTS ═══ */}
            <section className="py-20 bg-[var(--color-dark-secondary)] border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {PRODUCTS.map((product, i) => (
                            <div
                                key={i}
                                className="reveal group relative rounded-2xl border border-white/5 bg-white/[0.01] p-8 hover:border-white/10 transition-all duration-500 flex flex-col"
                                style={{ transitionDelay: `${i * 0.12}s` }}
                            >
                                {/* Icon */}
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-white text-xl mb-6 shadow-lg ${product.glow} group-hover:scale-105 transition-transform duration-300`}
                                >
                                    {product.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 font-[var(--font-display)]">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                                    {product.desc}
                                </p>

                                {/* Features */}
                                <div className="space-y-2">
                                    {product.features.map((f, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center gap-2 text-sm text-slate-500"
                                        >
                                            <FaCheckCircle className="text-xs text-green-500/70 flex-shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ ARCHITECTURE DIAGRAM ═══ */}
            <section className="py-24 relative overflow-hidden">
                <div className="orb orb-blue w-[400px] h-[400px] -bottom-[100px] -right-[100px] absolute" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="reveal text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3 block">
                            Mimari
                        </span>
                        <h2 className="reveal delay-1 font-[var(--font-display)] text-2xl sm:text-3xl font-bold">
                            Sistem Nasıl Bağlanır?
                        </h2>
                    </div>

                    {/* Flow diagram */}
                    <div className="reveal delay-2 flex flex-wrap justify-center items-center gap-4">
                        {[
                            {
                                icon: "🔥",
                                label: "Sensör",
                                sub: "ESP32 + MQ-2",
                                color: "border-orange-500/20 bg-orange-500/5",
                            },
                            { arrow: true },
                            {
                                icon: "☁️",
                                label: "Firebase",
                                sub: "Firestore DB",
                                color: "border-blue-500/20 bg-blue-500/5",
                            },
                            { arrow: true },
                            {
                                icon: "🖥️",
                                label: "Dashboard",
                                sub: "React Web App",
                                color: "border-purple-500/20 bg-purple-500/5",
                            },
                            { arrow: true },
                            {
                                icon: "📧",
                                label: "Bildirim",
                                sub: "E-posta / Alarm",
                                color: "border-green-500/20 bg-green-500/5",
                            },
                        ].map((item, i) =>
                            item.arrow ? (
                                <div
                                    key={i}
                                    className="text-slate-600 text-lg hidden sm:block"
                                >
                                    →
                                </div>
                            ) : (
                                <div
                                    key={i}
                                    className={`flex flex-col items-center gap-2 px-6 py-5 rounded-xl border ${item.color} min-w-[120px] transition-all hover:scale-105 duration-300`}
                                >
                                    <span className="text-3xl">{item.icon}</span>
                                    <span className="text-sm font-semibold text-white">
                                        {item.label}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {item.sub}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* ═══ TECH STACK ═══ */}
            <section className="py-20 bg-[var(--color-dark-secondary)] border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="reveal font-[var(--font-display)] text-2xl sm:text-3xl font-bold">
                            Teknoloji Yığını
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {TECH_STACK.map((tech, i) => (
                            <div
                                key={i}
                                className="reveal group flex flex-col items-center text-center p-5 rounded-xl border border-white/5 hover:border-orange-500/15 bg-white/[0.01] hover:bg-orange-500/[0.02] transition-all duration-300"
                                style={{ transitionDelay: `${i * 0.06}s` }}
                            >
                                <div className="text-xl text-orange-400 mb-2 group-hover:scale-110 transition-transform">
                                    {tech.icon}
                                </div>
                                <span className="text-xs font-semibold text-white mb-0.5">
                                    {tech.label}
                                </span>
                                <span className="text-[10px] text-slate-500">{tech.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className="py-24 relative overflow-hidden">
                <div className="orb orb-orange w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute" />
                <div className="text-center max-w-xl mx-auto px-6 relative z-10">
                    <h2 className="reveal font-[var(--font-display)] text-3xl font-bold mb-4">
                        Sistem Hakkında Daha Fazla ?
                    </h2>
                    <p className="reveal delay-1 text-slate-500 mb-8">
                        Hemen kayıt olun veya destek ekibimize yazın.
                    </p>
                    <div className="reveal delay-2 flex flex-wrap justify-center gap-3">
                        <Link
                            to="/customer"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 no-underline"
                        >
                            Müşteri Ol
                            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Products;
