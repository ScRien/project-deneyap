import { useState } from "react";
import "../css/Support.css";

const faqData = [
  {
    question: "Giriş yapmakta sorun yaşıyorum, ne yapmalıyım?",
    answer:
      "Lütfen kayıt olduğunuz e-posta adresini doğru yazdığınızdan emin olun. Giriş için size gönderilen kodun süresi dolmuş olabilir, tekrar giriş yaparak yeni bir kod talep edin.",
  },
  {
    question: "E-posta kodu gelmiyor, neden olabilir?",
    answer:
      "E-posta kodu bazen spam klasörüne düşebilir. Orayı kontrol edin. Hâlâ ulaşamıyorsanız sistem yöneticisine başvurun.",
  },
  {
    question: "Acil durum e-postaları neden bana ulaşmıyor?",
    answer:
      "Acil e-posta listesine kayıtlı olduğunuzdan ve adresin doğru yazıldığından emin olun. Sistem sadece onaylı kullanıcıların acil kişilerine uyarı gönderir.",
  },
  {
    question: "Veriler neden anında görünmüyor?",
    answer:
      "Sensör verileri dakikada bir güncellenmektedir. Sayfayı yenileyerek tekrar kontrol edebilirsiniz.",
  },
];

function Support() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="support-container">
      <h1>🆘 Yardım & Sıkça Sorulan Sorular</h1>
      <p>Karşılaştığınız sorunlarla ilgili yanıtları aşağıda bulabilirsiniz.</p>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">{item.question}</div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Support;
