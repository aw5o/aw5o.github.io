// translations.js
let currentLanguage = 'en';
let translations = {};

// Available languages
const languages = {
  en: 'English',
  de: 'Deutsch',
  pl: 'Polski',
  es: 'Español',
  ko: '한국어',
  ja: '日本語',
  nl: 'Nederlands'
};

// Load translations for the current language
async function loadTranslations(lang) {
  try {
    const module = await import(`./translations/${lang}.js`);
    translations = module.default;
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    applyTranslations();
  } catch (error) {
    console.error(`Error loading ${lang} translations:`, error);
    // Fallback to English if selected language fails
    if (lang !== 'en') {
      await loadTranslations('en');
    }
  }
}

// Apply translations to the page
function applyTranslations() {
  // Update language dropdown
  const langDropdown = document.getElementById('languageDropdown');
  if (langDropdown) {
    langDropdown.innerHTML = `<i class="fas fa-globe me-1"></i> ${languages[currentLanguage]}`;
  }
  
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = translations[key];
      } else if (element.tagName === 'IMG') {
        element.alt = translations[key];
      } else {
        element.innerHTML = translations[key];
      }
    }
  });
  
  // Update page title
  const pageTitle = document.querySelector('title');
  if (pageTitle && translations[`${document.body.dataset.page}.title`]) {
    pageTitle.textContent = translations[`${document.body.dataset.page}.title`];
  }
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && translations[`${document.body.dataset.page}.description`]) {
    metaDescription.content = translations[`${document.body.dataset.page}.description`];
  }
}

// Initialize translation system
async function initTranslations() {
  // Set page identifier
  const path = window.location.pathname;
  if (path.includes('terms')) {
    document.body.dataset.page = 'terms';
  } else if (path.includes('success')) {
    document.body.dataset.page = 'success';
  } else {
    document.body.dataset.page = 'index';
  }
  
  // Load saved language or default to English
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  await loadTranslations(savedLang);
  
  // Set up language switcher
  const langItems = document.querySelectorAll('.dropdown-item[data-lang]');
  langItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.getAttribute('data-lang');
      loadTranslations(lang);
    });
  });
}

// Expose for use in other scripts
window.translations = {
  loadTranslations,
  applyTranslations,
  initTranslations,
  currentLanguage: () => currentLanguage
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initTranslations);