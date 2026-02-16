// Deneyap Kart + MQ-2 Duman Sensörü + 3 Buzzer (Ambulans Sesi Efekti)

#define GAS_PIN A0          // MQ-2'nin analog çıkışı A0'a bağlı
#define THRESHOLD 1000       // Tehlike sınırı (ortama göre ayarlanmalı)
#define READINGS 10         // Ortalama almak için ölçüm sayısı

#define BUZZER1 12
#define BUZZER2 13
#define BUZZER3 14

int gasValue = 0;
int minVal = 1023;
int maxVal = 0;

void setup() {
  Serial.begin(115200);

  // Sensör ısınması için bilgilendirme ve bekleme
  Serial.println("🟢 MQ-2 Duman Dedektörü Başladı");
  Serial.println("⏳ Sensör ısınması için 30 saniye bekleniyor...");
  delay(30);  // 30 saniyelik ısınma süresi

  // Buzzer pin ayarları
  pinMode(BUZZER1, OUTPUT);
  pinMode(BUZZER2, OUTPUT);
  pinMode(BUZZER3, OUTPUT);
  digitalWrite(BUZZER1, LOW);
  digitalWrite(BUZZER2, LOW);
  digitalWrite(BUZZER3, LOW);

  Serial.println("✅ Sensör hazır. Ölçüm başlıyor...");
}

void loop() {
  gasValue = getAverageGasValue(READINGS);

  if (gasValue < minVal) minVal = gasValue;
  if (gasValue > maxVal) maxVal = gasValue;

  Serial.print("Anlık: ");
  Serial.print(gasValue);
  Serial.print(" | Min: ");
  Serial.print(minVal);
  Serial.print(" | Max: ");
  Serial.print(maxVal);

  if (gasValue == 0) {
    Serial.println(" --> 🚨 Sensör Boş Değer! Ambulans Modu!");
    // Kısa bir alarm sesi (1 saniye)
    ambulanceSound(1000);
  } else if (gasValue > THRESHOLD) {
    Serial.println(" --> 🚨 Yüksek Gaz Değeri! Yangın Tehlikesi!");
    // Yeni ölçüm gelene kadar sürekli alarm (10 saniye)
    ambulanceSound(READINGS * 1000); 
  } else {
    Serial.println(" --> ✅ Ortam Güvenli.");
    // Tüm buzzerları kapat
    digitalWrite(BUZZER1, LOW);
    digitalWrite(BUZZER2, LOW);
    digitalWrite(BUZZER3, LOW);
    delay(1000);  // Güvenli durumda bekleme
  }
}

// 📊 Ortalama gaz değeri hesaplayan fonksiyon
int getAverageGasValue(int count) {
  long total = 0;
  for (int i = 0; i < count; i++) {
    total += analogRead(GAS_PIN);
    delay(1000);  // Her okuma arasında 1 saniye bekleme
  }
  return total / count;
}

// 🚨 Ambulans tarzı siren efekti fonksiyonu (sürekli döngülü)
void ambulanceSound(unsigned long durationMs) {
  unsigned long startTime = millis();
  int toneDelay = 150;

  while (millis() - startTime < durationMs) {
    digitalWrite(BUZZER1, HIGH); delay(toneDelay); digitalWrite(BUZZER1, LOW);
    digitalWrite(BUZZER2, HIGH); delay(toneDelay); digitalWrite(BUZZER2, LOW);
    digitalWrite(BUZZER3, HIGH); delay(toneDelay); digitalWrite(BUZZER3, LOW);
  }
}

