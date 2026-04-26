# 🐓 Okuyan Horoz - Dijital Kitap Dünyası

**Okuyan Horoz**, modern web teknolojileri ile geliştirilmiş, hem envanter yönetimi hem de kullanıcı deneyimini ön planda tutan bir dijital kütüphane ve satış simülasyonu platformudur. Yazılım mühendisliği prensipleri doğrultusunda, veritabanı tutarlılığı ve şık bir arayüz (UI) odaklı inşa edilmiştir.

---

## 🚀 Öne Çıkan Özellikler

* **Dinamik Dashboard:** Recharts kütüphanesi kullanılarak son 1 yıllık satış verilerinin (Revenue) aylık bazda görselleştirilmesi.
* **Rol Tabanlı Erişim (RBAC):** Admin ve Misafir kullanıcılar için farklı yetkilendirme seviyeleri.
* **Akıllı Sepet Yönetimi:** `localStorage` entegrasyonu ile kullanıcı bazlı sepet kalıcılığı (User-specific cart persistence).
* **Veritabanı Bütünlüğü:** `Foreign Key` kısıtlamaları ile satış verisi olan ürünlerin silinmesini engelleyen güvenli mimari.
* **Gelişmiş Admin Araçları:** Tek tıkla sistemi fabrika ayarlarına döndüren (Reset) ve gerçekçi test verileri yükleyen yönetim paneli.
* **Modern UI/UX:** Tailwind CSS ve Lucide-React ikon seti ile tamamen responsive ve minimalist tasarım.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

### **Frontend**
* **React.js** (Vite altyapısı ile)
* **Tailwind CSS** (Styling)
* **Recharts** (Veri Görselleştirme)
* **Lucide-React** (İkon Seti)

### **Backend & Database**
* **Node.js & Express.js** (REST API)
* **PostgreSQL** (Neon.tech Serverless DB)
* **PG Library** (Veritabanı sürücüsü)

---

## 📊 Veri ve İş Mantığı (Business Logic)

Proje, gerçek bir işletme senaryosunu simüle etmek adına özel bir veri yapısına sahiptir:
* **Ekim Ayı Anomalisi:** Satış verilerinde Ekim ayı bilerek boş bırakılmıştır. Bu, sistemin veri olmayan durumlarda grafik üzerinde nasıl tepki verdiğini (0 değerini işleme) test etmek ve iş süreçlerindeki kesintileri simüle etmek amacıyla yapılmıştır.
* **Referans Bütünlüğü:** Satış kaydı bulunan kitaplar silinemez. Bu, muhasebe kayıtlarının korunmasını sağlayan kritik bir mühendislik tercihidir.

