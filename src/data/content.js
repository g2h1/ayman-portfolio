// المصدر الوحيد لكل نصوص الموقع بالعربي والإنجليزي
// Single source of truth for every bilingual string on the site

export const content = {
  ar: {
    nav: {
      home: "الرئيسية",
      work: "الأعمال",
      pricing: "الأسعار",
      contact: "تواصل معايا",
    },
    hero: {
      eyebrow: "Graphic Designer · Video Editor",
      title: "أيمن منصور",
      subtitle: "بصمّم وبمونتج حاجات بتتوقف عندها.",
      cta: "شوف الأعمال",
      ticker: [
        "Branding",
        "Motion Graphics",
        "Social Media",
        "Video Editing",
        "Visual Identity",
      ],
    },
    footer: {
      rights: "جميع الحقوق محفوظة",
      tagline: "القاهرة، مصر",
    },
    placeholder: {
      comingSoon: "القسم ده جاي في المرحلة الجاية",
    },
    work: {
      title: "الأعمال",
      subtitle: "مجموعة مختارة من مشاريع البراندنج والمونتاج والتصميم",
      all: "الكل",
      close: "قفل",
      placeholderNotice:
        "دي مشاريع تجريبية لحد ما تبعتلي صور أعمالك الحقيقية",
    },
  },
  en: {
    nav: {
      home: "Home",
      work: "Work",
      pricing: "Pricing",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Graphic Designer · Video Editor",
      title: "Ayman Mansour",
      subtitle: "I design and edit things worth stopping for.",
      cta: "See the work",
      ticker: [
        "Branding",
        "Motion Graphics",
        "Social Media",
        "Video Editing",
        "Visual Identity",
      ],
    },
    footer: {
      rights: "All rights reserved",
      tagline: "Cairo, Egypt",
    },
    placeholder: {
      comingSoon: "This section is coming in the next phase",
    },
    work: {
      title: "Work",
      subtitle: "A selected collection of branding, editing, and design projects",
      all: "All",
      close: "Close",
      placeholderNotice:
        "These are placeholder projects until you send your real work",
    },
  },
};

export const categories = [
  { key: "branding", ar: "براندنج", en: "Branding" },
  { key: "motion", ar: "موشن جرافيك", en: "Motion Graphics" },
  { key: "social", ar: "سوشيال ميديا", en: "Social Media" },
  { key: "video", ar: "مونتاج", en: "Video Editing" },
];

export const projects = [
  { id: 1, category: "branding", year: 2025, ar: "هوية بصرية — مقهى نوستالجيا", en: "Visual Identity — Nostalgia Café", tint: "ember" },
  { id: 2, category: "motion", year: 2025, ar: "إعلان موشن جرافيك — تطبيق توصيل", en: "Motion Ad — Delivery App", tint: "gold" },
  { id: 3, category: "social", year: 2024, ar: "حملة سوشيال ميديا — إطلاق منتج", en: "Social Campaign — Product Launch", tint: "ember-glow" },
  { id: 4, category: "social", year: 2024, ar: "تصميم بوستات — علامة مشروبات", en: "Post Designs — Beverage Brand", tint: "gold" },
  { id: 5, category: "video", year: 2024, ar: "مونتاج فيديو — فيلم قصير", en: "Video Edit — Short Film", tint: "ember" },
  { id: 6, category: "branding", year: 2023, ar: "شعار ودليل هوية — علامة أزياء", en: "Logo & Brand Guide — Fashion Label", tint: "ember-glow" },
  { id: 7, category: "motion", year: 2023, ar: "انتقالات متحركة — ريلز إنستجرام", en: "Animated Transitions — Instagram Reels", tint: "gold" },
  { id: 8, category: "video", year: 2023, ar: "مونتاج بودكاست — حلقات أسبوعية", en: "Podcast Edit — Weekly Episodes", tint: "ember" },
];
