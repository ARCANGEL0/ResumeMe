import { type SectionType, type SocialPlatform, type TemplateId } from './types/cv';

// Types
type TranslationSet = {
  labels: Record<string, string>;
  sectionTitles: Record<SectionType, string>;
  templateNames?: Partial<Record<TemplateId, string>>;
  templateDescriptions?: Partial<Record<TemplateId, string>>;
};

// Import all locale JSON files
import en from './locale/en/locale.json';
import pt from './locale/pt/locale.json';
import es from './locale/es/locale.json';
import fr from './locale/fr/locale.json';
import de from './locale/de/locale.json';
import it from './locale/it/locale.json';
import nl from './locale/nl/locale.json';
import pl from './locale/pl/locale.json';
import tr from './locale/tr/locale.json';
import uk from './locale/uk/locale.json';
import ru from './locale/ru/locale.json';
import ar from './locale/ar/locale.json';
import zh from './locale/zh/locale.json';
import ja from './locale/ja/locale.json';
import ko from './locale/ko/locale.json';
import id from './locale/id/locale.json';
import sv from './locale/sv/locale.json';
import no from './locale/no/locale.json';
import da from './locale/da/locale.json';
import fi from './locale/fi/locale.json';
import cs from './locale/cs/locale.json';
import sk from './locale/sk/locale.json';
import hu from './locale/hu/locale.json';
import ro from './locale/ro/locale.json';
import bg from './locale/bg/locale.json';
import hr from './locale/hr/locale.json';
import sr from './locale/sr/locale.json';
import sl from './locale/sl/locale.json';
import et from './locale/et/locale.json';
import lv from './locale/lv/locale.json';
import lt from './locale/lt/locale.json';
import el from './locale/el/locale.json';
import he from './locale/he/locale.json';
import bn from './locale/bn/locale.json';
import ur from './locale/ur/locale.json';
import ta from './locale/ta/locale.json';
import te from './locale/te/locale.json';
import ml from './locale/ml/locale.json';
import mr from './locale/mr/locale.json';
import gu from './locale/gu/locale.json';
import kn from './locale/kn/locale.json';
import pa from './locale/pa/locale.json';
import th from './locale/th/locale.json';
import vi from './locale/vi/locale.json';
import ms from './locale/ms/locale.json';
import tl from './locale/tl/locale.json';
import sw from './locale/sw/locale.json';
import hi from './locale/hi/locale.json';
import fa from './locale/fa/locale.json';

// Convert JSON to TranslationSet
function jsonToTranslationSet(json: any): TranslationSet {
  return {
    labels: json.labels || {},
    sectionTitles: json.sectionTitles || {},
    templateNames: json.templateNames || {},
    templateDescriptions: json.templateDescriptions || {},
  };
}

// All translations
const TRANSLATIONS: Record<string, TranslationSet> = {
  en: jsonToTranslationSet(en),
  pt: jsonToTranslationSet(pt),
  es: jsonToTranslationSet(es),
  fr: jsonToTranslationSet(fr),
  de: jsonToTranslationSet(de),
  it: jsonToTranslationSet(it),
  nl: jsonToTranslationSet(nl),
  pl: jsonToTranslationSet(pl),
  tr: jsonToTranslationSet(tr),
  uk: jsonToTranslationSet(uk),
  ru: jsonToTranslationSet(ru),
  ar: jsonToTranslationSet(ar),
  zh: jsonToTranslationSet(zh),
  ja: jsonToTranslationSet(ja),
  ko: jsonToTranslationSet(ko),
  id: jsonToTranslationSet(id),
  sv: jsonToTranslationSet(sv),
  no: jsonToTranslationSet(no),
  da: jsonToTranslationSet(da),
  fi: jsonToTranslationSet(fi),
  cs: jsonToTranslationSet(cs),
  sk: jsonToTranslationSet(sk),
  hu: jsonToTranslationSet(hu),
  ro: jsonToTranslationSet(ro),
  bg: jsonToTranslationSet(bg),
  hr: jsonToTranslationSet(hr),
  sr: jsonToTranslationSet(sr),
  sl: jsonToTranslationSet(sl),
  et: jsonToTranslationSet(et),
  lv: jsonToTranslationSet(lv),
  lt: jsonToTranslationSet(lt),
  el: jsonToTranslationSet(el),
  he: jsonToTranslationSet(he),
  bn: jsonToTranslationSet(bn),
  ur: jsonToTranslationSet(ur),
  ta: jsonToTranslationSet(ta),
  te: jsonToTranslationSet(te),
  ml: jsonToTranslationSet(ml),
  mr: jsonToTranslationSet(mr),
  gu: jsonToTranslationSet(gu),
  kn: jsonToTranslationSet(kn),
  pa: jsonToTranslationSet(pa),
  th: jsonToTranslationSet(th),
  vi: jsonToTranslationSet(vi),
  ms: jsonToTranslationSet(ms),
  tl: jsonToTranslationSet(tl),
  sw: jsonToTranslationSet(sw),
  hi: jsonToTranslationSet(hi),
  fa: jsonToTranslationSet(fa),
};

// Language options
export const LANGUAGE_OPTIONS = [
  { id: 'en', name: 'English', label: 'English', flag: '🇺🇸' },
  { id: 'pt', name: 'Português', label: 'Português', flag: '🇵🇹' },
  { id: 'es', name: 'Español', label: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', label: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'Deutsch', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', name: 'Italiano', label: 'Italiano', flag: '🇮🇹' },
  { id: 'nl', name: 'Nederlands', label: 'Nederlands', flag: '🇳🇱' },
  { id: 'pl', name: 'Polski', label: 'Polski', flag: '🇵🇱' },
  { id: 'tr', name: 'Türkçe', label: 'Türkçe', flag: '🇹🇷' },
  { id: 'uk', name: 'Українська', label: 'Українська', flag: '🇺🇦' },
  { id: 'ru', name: 'Русский', label: 'Русский', flag: '🇷🇺' },
  { id: 'ar', name: 'العربية', label: 'العربية', flag: '🇸🇦' },
  { id: 'zh', name: '中文', label: '中文', flag: '🇨🇳' },
  { id: 'ja', name: '日本語', label: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: '한국어', label: '한국어', flag: '🇰🇷' },
  { id: 'id', name: 'Bahasa Indonesia', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { id: 'sv', name: 'Svenska', label: 'Svenska', flag: '🇸🇪' },
  { id: 'no', name: 'Norsk', label: 'Norsk', flag: '🇳🇴' },
  { id: 'da', name: 'Dansk', label: 'Dansk', flag: '🇩🇰' },
  { id: 'fi', name: 'Suomi', label: 'Suomi', flag: '🇫🇮' },
  { id: 'cs', name: 'Čeština', label: 'Čeština', flag: '🇨🇿' },
  { id: 'sk', name: 'Slovenčina', label: 'Slovenčina', flag: '🇸🇰' },
  { id: 'hu', name: 'Magyar', label: 'Magyar', flag: '🇭🇺' },
  { id: 'ro', name: 'Română', label: 'Română', flag: '🇷🇴' },
  { id: 'bg', name: 'Български', label: 'Български', flag: '🇧🇬' },
  { id: 'hr', name: 'Hrvatski', label: 'Hrvatski', flag: '🇭🇷' },
  { id: 'sr', name: 'Српски', label: 'Српски', flag: '🇷🇸' },
  { id: 'sl', name: 'Slovenščina', label: 'Slovenščina', flag: '🇸🇮' },
  { id: 'et', name: 'Eesti', label: 'Eesti', flag: '🇪🇪' },
  { id: 'lv', name: 'Latviešu', label: 'Latviešu', flag: '🇱🇻' },
  { id: 'lt', name: 'Lietuvių', label: 'Lietuvių', flag: '🇱🇹' },
  { id: 'el', name: 'Ελληνικά', label: 'Ελληνικά', flag: '🇬🇷' },
  { id: 'he', name: 'עברית', label: 'עברית', flag: '🇮🇱' },
  { id: 'bn', name: 'বাংলা', label: 'বাংলা', flag: '🇧🇩' },
  { id: 'ur', name: 'اردو', label: 'اردو', flag: '🇵🇰' },
  { id: 'ta', name: 'தமிழ்', label: 'தமிழ்', flag: '🇮🇳' },
  { id: 'te', name: 'తెలుగు', label: 'తెలుగు', flag: '🇮🇳' },
  { id: 'ml', name: 'മലയാളം', label: 'മലയാളം', flag: '🇮🇳' },
  { id: 'mr', name: 'मराठी', label: 'मराठी', flag: '🇮🇳' },
  { id: 'gu', name: 'ગુજરાતી', label: 'ગુજરાતી', flag: '🇮🇳' },
  { id: 'kn', name: 'ಕನ್ನಡ', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { id: 'pa', name: 'ਪੰਜਾਬੀ', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { id: 'th', name: 'ภาษาไทย', label: 'ภาษาไทย', flag: '🇹🇭' },
  { id: 'vi', name: 'Tiếng Việt', label: 'Tiếng Việt', flag: '🇻🇳' },
  { id: 'ms', name: 'Bahasa Melayu', label: 'Bahasa Melayu', flag: '🇲🇾' },
  { id: 'tl', name: 'Wikang Tagalog', label: 'Wikang Tagalog', flag: '🇵🇭' },
  { id: 'sw', name: 'Kiswahili', label: 'Kiswahili', flag: '🇰🇪' },
  { id: 'hi', name: 'हिन्दी', label: 'हिन्दी', flag: '🇮🇳' },
  { id: 'fa', name: 'فارسی', label: 'فارسی', flag: '🇮🇷' },
];

export type UILanguage = (typeof LANGUAGE_OPTIONS)[number]['id'];
export type LocalizedLanguage = UILanguage;

export const DEFAULT_LANGUAGE: LocalizedLanguage = 'en';

// Placeholder builders
const PLACEHOLDER_BUILDERS: Partial<Record<UILanguage, (field: string) => string>> = {
  en: (field) => `Enter ${field.toLowerCase()}`,
  pt: (field) => `Introduza ${field.toLowerCase()}`,
  es: (field) => `Escribe ${field.toLowerCase()}`,
  fr: (field) => `Saisissez ${field.toLowerCase()}`,
  de: (field) => `${field} eingeben`,
  it: (field) => `Inserisci ${field.toLowerCase()}`,
  nl: (field) => `Voer ${field.toLowerCase()} in`,
  pl: (field) => `Wprowadź ${field.toLowerCase()}`,
  tr: (field) => `${field.toLowerCase()} girin`,
  uk: (field) => `Введіть ${field.toLowerCase()}`,
  ru: (field) => `Введите ${field.toLowerCase()}`,
  ar: (field) => `أدخل ${field.toLowerCase()}`,
  zh: (field) => `输入${field.toLowerCase()}`,
  ja: (field) => `${field.toLowerCase()}を入力`,
  ko: (field) => `${field.toLowerCase()} 입력`,
  id: (field) => `Masukkan ${field.toLowerCase()}`,
  sv: (field) => `Ange ${field.toLowerCase()}`,
  no: (field) => `Skriv inn ${field.toLowerCase()}`,
  da: (field) => `Indtast ${field.toLowerCase()}`,
  fi: (field) => `Syötä ${field.toLowerCase()}`,
  cs: (field) => `Zadejte ${field.toLowerCase()}`,
  sk: (field) => `Zadajte ${field.toLowerCase()}`,
  hu: (field) => `Adja meg ${field.toLowerCase()}`,
  ro: (field) => `Introduceți ${field.toLowerCase()}`,
  bg: (field) => `Въведете ${field.toLowerCase()}`,
  hr: (field) => `Unesite ${field.toLowerCase()}`,
  sr: (field) => `Унесите ${field.toLowerCase()}`,
  sl: (field) => `Vnesite ${field.toLowerCase()}`,
  et: (field) => `Sisesta ${field.toLowerCase()}`,
  lv: (field) => `Ievadiet ${field.toLowerCase()}`,
  lt: (field) => `Įveskite ${field.toLowerCase()}`,
  el: (field) => `Εισάγετε ${field.toLowerCase()}`,
  he: (field) => `הכנס ${field.toLowerCase()}`,
  bn: (field) => `${field.toLowerCase()} লিখুন`,
  ur: (field) => `${field.toLowerCase()} درج کریں`,
  ta: (field) => `${field.toLowerCase()} உள்ளிடவும்`,
  te: (field) => `${field.toLowerCase()} నమోదు చేయండి`,
  ml: (field) => `${field.toLowerCase()} നൽകുക`,
  mr: (field) => `${field.toLowerCase()} टाइप करा`,
  gu: (field) => `${field.toLowerCase()} દાખલ કરો`,
  kn: (field) => `${field.toLowerCase()} ನಮೂದಿಸಿ`,
  pa: (field) => `${field.toLowerCase()} ਦਾਖਲ ਕਰੋ`,
  th: (field) => `ป้อน${field.toLowerCase()}`,
  vi: (field) => `Nhập ${field.toLowerCase()}`,
  ms: (field) => `Masukkan ${field.toLowerCase()}`,
  tl: (field) => `Ilagay ang ${field.toLowerCase()}`,
  sw: (field) => `Weka ${field.toLowerCase()}`,
  hi: (field) => `${field.toLowerCase()} दर्ज करें`,
  fa: (field) => `نام ${field.toLowerCase()} را وارد کنید`,
};

// Drop section labels
const DROP_SECTION_LABELS: Partial<Record<UILanguage, string>> = {
  en: 'Drop a section here',
  pt: 'Solte uma secção aqui',
  es: 'Suelta una sección aquí',
  fr: 'Déposez une section ici',
  de: 'Abschnitt hier ablegen',
  it: 'Rilascia una sezione qui',
  nl: 'Sectie hier neerzetten',
  pl: 'Upuść sekcję tutaj',
  tr: 'Bölümü buraya bırakın',
  uk: 'Киньте розділ сюди',
  ru: 'Перетащите раздел сюда',
  ar: 'أفلت قسمًا هنا',
  zh: '将部分拖放到此处',
  ja: 'セクションをここにドロップ',
  ko: '섹션을 여기에 놓으세요',
  id: 'Jatuhkan bagian di sini',
  sv: 'Släpp en sektion här',
  no: 'Slipp en seksjon her',
  da: 'Slip en sektion her',
  fi: 'Pudota osio tähän',
  cs: 'Přetáhněte sekci sem',
  sk: 'Pretiahnite sekciu sem',
  hu: 'Húzza ide a szakaszt',
  ro: 'Trageți o secțiune aici',
  bg: 'Пуснете секция тук',
  hr: 'Ovdje ispustite odjeljak',
  sr: 'Ovde ispustite odeljak',
  sl: 'Tukaj spustite razdelek',
  et: 'Lohista sektsioon siia',
  lv: 'Ievelciet sada šeit',
  lt: 'Numeskite skyrių čia',
  el: 'Αφήστε μια ενότητα εδώ',
  he: 'שחרר סקשן כאן',
  bn: 'এখানে একটি অংশ ফেলে দিন',
  ur: 'یہاں سیکشن ڈراپ کریں',
  ta: 'இங்கே ஒரு பகுதியை இழக்கவும்',
  te: 'ఇక్కడ సెక్షన్ డ్రాప్ చేయండి',
  ml: 'ഇവിടെ ഒരു വിഭാഗം ഇടുക',
  mr: 'येथे विभाग टाका',
  gu: 'અહીં વિભાગ છોડો',
  kn: 'ಇಲ್ಲಿ ವಿಭಾಗವನ್ನು ಬಿಡಿ',
  pa: 'ਇੱਥੇ ਸੈਕਸ਼ਨ ਡਰੌਪ ਕਰੋ',
  th: 'วางส่วนที่นี่',
  vi: 'Thả phần vào đây',
  ms: 'Jatuhkan bahagian di sini',
  tl: 'Ihulog ang seksyon dito',
  sw: 'Weka sehemu hapa',
  hi: 'यहां अनुभाग डालें',
  fa: 'بخش را اینجا رها کنید',
};

// Developed by translations
const DEVELOPED_BY_TRANSLATIONS: Partial<Record<UILanguage, string>> = {
  en: 'developed by: ARCANGELO',
  pt: 'desenvolvido por: ARCANGELO',
  es: 'desarrollado por: ARCANGELO',
  fr: 'développé par: ARCANGELO',
  de: 'entwickelt von: ARCANGELO',
  it: 'sviluppato da: ARCANGELO',
  nl: 'ontwikkeld door: ARCANGELO',
  pl: 'stworzony przez: ARCANGELO',
  tr: 'ARCANGELO tarafından geliştirildi',
  uk: 'розроблено: ARCANGELO',
  ru: 'разработано: ARCANGELO',
  ar: 'طوره: ARCANGELO',
  zh: '由 ARCANGELO 开发',
  ja: 'ARCANGELO によって開発されました',
  ko: 'ARCANGELO가 개발했습니다',
  id: 'dikembangkan oleh: ARCANGELO',
  sv: 'utvecklad av: ARCANGELO',
  no: 'utviklet av: ARCANGELO',
  da: 'udviklet af: ARCANGELO',
  fi: 'kehittänyt: ARCANGELO',
  cs: 'vytvořil: ARCANGELO',
  sk: 'vytvoril: ARCANGELO',
  hu: 'fejlesztette: ARCANGELO',
  ro: 'dezvoltat de: ARCANGELO',
  bg: 'разработено от: ARCANGELO',
  hr: 'razvio: ARCANGELO',
  sr: 'развио: ARCANGELO',
  sl: 'razvil: ARCANGELO',
  et: 'arendanud: ARCANGELO',
  lv: 'izstrādājis: ARCANGELO',
  lt: 'sukūrė: ARCANGELO',
  el: 'αναπτύχθηκε από: ARCANGELO',
  he: 'פותח על ידי: ARCANGELO',
  bn: 'ARCANGELO দ্বারা তৈরি',
  ur: 'ARCANGELO نے تیار کیا',
  ta: 'ARCANGELO ஆல் உருவாக்கப்பட்டது',
  te: 'ARCANGELO ద్వారా అభివృద్ధి చేయబడింది',
  ml: 'ARCANGELO വികസിപ്പിച്ചു',
  mr: 'ARCANGELO यांनी विकसित केले',
  gu: 'ARCANGELO દ્વારા વિકસિત',
  kn: 'ARCANGELO ಅವರಿಂದ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ',
  pa: 'ARCANGELO ਦੁਆਰਾ ਵਿਕਸਤ ਕੀਤਾ',
  th: 'พัฒนาโดย ARCANGELO',
  vi: 'được phát triển bởi ARCANGELO',
  ms: 'dibangunkan oleh ARCANGELO',
  tl: 'binuo ni ARCANGELO',
  sw: 'imeundwa na ARCANGELO',
  hi: 'ARCANGELO द्वारा विकसित',
  fa: 'توسط ARCANGELO توسعه یافته است',
};

// Default template names
const DEFAULT_TEMPLATE_NAMES: Record<TemplateId, string> = {
  modern: 'Modern',
  classic: 'Classic',
  minimal: 'Minimal',
  creative: 'Creative',
  professional: 'Professional',
  executive: 'Executive',
  slate: 'Slate',
  ivory: 'Ivory',
  summit: 'Summit',
  studio: 'Studio',
  atlas: 'Atlas',
  dossier: 'Dossier',
  north: 'North',
  zenith: 'Zenith',
  editorial: 'Editorial',
};

// Get translation for a language
export function getTranslation(language: UILanguage): TranslationSet {
  const translation = TRANSLATIONS[language] || TRANSLATIONS.en;
  if (!translation) {
    return {
      labels: {},
      sectionTitles: { custom: 'Custom', experience: 'Experience', education: 'Education', skills: 'Skills', languages: 'Languages', projects: 'Projects', certifications: 'Certifications' },
      templateNames: {},
      templateDescriptions: {},
    };
  }
  return translation;
}

// Get a label
export function t(language: UILanguage, key: string): string {
  const translation = getTranslation(language);
  return translation.labels[key] || key;
}

// Get section title
export function getSectionTitle(language: UILanguage, sectionType: SectionType | string): string {
  const translation = getTranslation(language);
  return translation.sectionTitles[sectionType as SectionType] || sectionType;
}

// Get placeholder
export function getPlaceholder(language: UILanguage, field: string): string {
  const builder = PLACEHOLDER_BUILDERS[language];
  if (builder) {
    return builder(field);
  }
  return `Enter ${field.toLowerCase()}`;
}

// Get drop section label
export function getDropSectionLabel(language: UILanguage): string {
  return DROP_SECTION_LABELS[language] || 'Drop a section here';
}

// Get developed by text
export function getDevelopedBy(language: UILanguage): string {
  return DEVELOPED_BY_TRANSLATIONS[language] || 'Developed by Henry Arcangelo';
}

// Get template name
export function getTemplateName(language: UILanguage, templateId: TemplateId): string {
  const translation = getTranslation(language);
  return translation.templateNames?.[templateId] || DEFAULT_TEMPLATE_NAMES[templateId] || templateId;
}

// Get template description
export function getTemplateDescription(language: UILanguage, templateId: TemplateId): string {
  const translation = getTranslation(language);
  return translation.templateDescriptions?.[templateId] || '';
}

// Get social platform label
export function getSocialPlatformLabel(language: UILanguage, platform: SocialPlatform, fallback?: string): string {
  const translation = getTranslation(language);
  return translation.labels[platform] || fallback || platform;
}

// Get localized special section title
export function getLocalizedSpecialSectionTitle(language: UILanguage, sectionTitle: string): string {
  const translation = getTranslation(language);
  // Try to get from sectionTitles, otherwise return the original
  const title = translation.sectionTitles[sectionTitle as keyof typeof translation.sectionTitles];
  return title || sectionTitle;
}

// Check if section title is default
export function isDefaultSectionTitle(sectionType: SectionType | string, title: string): boolean {
  // Check if the title matches the default language title for this section type
  const defaultTitle = getSectionTitle(DEFAULT_LANGUAGE, sectionType);
  return title === defaultTitle || title === sectionType;
}

// Get all default section titles for a section type (for language switching)
export function getAllDefaultTitles(sectionType: SectionType | string): Set<string> {
  const titles = new Set<string>();
  for (const lang of Object.keys(TRANSLATIONS)) {
    const title = getSectionTitle(lang as UILanguage, sectionType);
    if (title) {
      titles.add(title);
    }
  }
  return titles;
}

export default TRANSLATIONS;