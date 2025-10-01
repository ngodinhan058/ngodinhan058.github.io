// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en_comond.json";
import jp from "./locales/jp_comond.json";

i18n
  .use(LanguageDetector) // phát hiện từ query/localStorage/navigator
  .use(initReactI18next)
  .init({
    resources: {
      EN: { common: en },
      JP: { common: jp },
    },
    fallbackLng: "JP",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"]
    }
  });

export default i18n;
