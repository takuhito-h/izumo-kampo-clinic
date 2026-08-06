// サイト共通の構造化データ（JSON-LD）ノード。
// @id で参照される実体はここに一元化する（ページごとに書くと内容がぶれるため）。
// URL は本番ドメイン基準で書く（postbuild の relativize は href/src 属性のみ変換するので影響を受けない）。

export const SITE = "https://izumo-kampo.clinic";
export const WEBSITE_ID = `${SITE}/#website`;
export const ORG_ID = `${SITE}/#organization`;
export const DOCTOR_ID = `${SITE}/doctor#miyamoto`;

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE}/`,
  name: "出雲漢方クリニック",
  inLanguage: "ja",
  publisher: { "@id": ORG_ID },
};

// 院長。Physician は「診療所」を表す型なので、人物は Person で表現する
export const doctorNode = {
  "@type": "Person",
  "@id": DOCTOR_ID,
  name: "宮本 信宏",
  alternateName: "みやもと のぶひろ",
  jobTitle: ["出雲漢方クリニック 院長", "島根大学医学部 漢方医学 臨床教授"],
  url: `${SITE}/doctor`,
  image: `${SITE}/wp-content/uploads/2022/06/fffb166affaac3a2ac359a84542b712a.jpg`,
  worksFor: { "@id": ORG_ID },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "国家資格",
    name: "医師免許",
  },
  knowsAbout: ["漢方治療", "漢方医学", "オンライン診療", "東洋医学", "外科"],
};

export const clinicNode = {
  "@type": ["MedicalClinic", "Organization"],
  "@id": ORG_ID,
  name: "出雲漢方クリニック",
  url: `${SITE}/`,
  logo: `${SITE}/wp-content/uploads/2022/04/S__63782986.png`,
  description:
    "島根県出雲市の漢方クリニック。初診から再診までオンライン診療（保険診療）に対応し、全国の患者さんを診療しています。",
  address: {
    "@type": "PostalAddress",
    postalCode: "693-0001",
    streetAddress: "今市町736-11",
    addressLocality: "出雲市",
    addressRegion: "島根県",
    addressCountry: "JP",
  },
  areaServed: { "@type": "Country", name: "日本" },
  availableLanguage: {
    "@type": "Language",
    name: "Japanese",
    alternateName: "ja",
  },
  knowsAbout: ["漢方治療", "漢方薬", "オンライン診療", "東洋医学"],
  founder: { "@id": DOCTOR_ID },
  employee: { "@id": DOCTOR_ID },
  isAcceptingNewPatients: true,
  // time.astro の診療時間表と対応（金曜午後は島根大学のため休診）
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      name: "対面診療（午前）",
      dayOfWeek: [
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
      ],
      opens: "09:00",
      closes: "12:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      name: "対面診療（午後）",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
      ],
      opens: "14:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      name: "オンライン診療",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
        "https://schema.org/Saturday",
        "https://schema.org/Sunday",
      ],
      opens: "08:30",
      closes: "18:00",
    },
  ],
};

// </script> によるHTML早期終了を防ぐためエスケープしてから埋め込む
export const toJsonLd = (schema) =>
  JSON.stringify(schema).replace(/</g, "\\u003c");
