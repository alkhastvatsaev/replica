import { PRODUCTS } from './inventory.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── CONFIGURATION ────────────────────────────────────────────────
const WA_PHONE = '33745999118';
const TRANSLATIONS = {
  fr: { buy: 'CONTACTER', wa_msg: 'Bonjour, je suis intéressé par cette pièce : ' },
  en: { buy: 'CONTACT', wa_msg: 'Hello, I am interested in this item: ' },
  ru: { buy: 'СВЯЗАТЬСЯ', wa_msg: 'Здравствуйте, меня интересует это изделие: ' },
  ar: { buy: 'اتصال', wa_msg: 'مرحباً، أنا مهتم بهذه القطعة: ' },
};

let currentLang = 'en';
let currentCurrency = 'USD';
let currentSymbol = '$';
let currentRates = { EUR: 1, USD: 1.08, AED: 3.97, RUB: 98.5, KZT: 485 };

// ─── LOGIQUE DE CONVERSION & ARRONDIS ────────────────────────────
async function fetchRates() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const data = await response.json();
    currentRates = data.rates;

    // Détection par IP pour la monnaie et la langue
    await autoDetectUser();

    renderAllSections();
  } catch (e) {
    console.error('Erreur initialisation:', e);
    renderAllSections(); // On affiche quand même en EUR par défaut
  }
}

async function autoDetectUser() {
  try {
    const geoReq = await fetch('https://ipapi.co/json/');
    const geo = await geoReq.json();

    const country = geo.country_code; // FR, US, AE, RU, KZ...

    if (['AE', 'QA', 'SA', 'OM'].includes(country)) {
      setCurrency('AED', 'د.إ');
      setLanguage('ar');
    } else if (['RU', 'BY'].includes(country)) {
      setCurrency('RUB', '₽');
      setLanguage('ru');
    } else if (['KZ'].includes(country)) {
      setCurrency('KZT', '₸');
      setLanguage('ru');
    } else if (['US', 'GB', 'CA'].includes(country)) {
      setCurrency('USD', '$');
      setLanguage('en');
    } else {
      setCurrency('EUR', '€');
      setLanguage('fr');
    }
  } catch (e) {
    // Fallback sur le fuseau horaire si l'IP API échoue
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Dubai')) setCurrency('AED', 'د.إ');
    else if (tz.includes('Moscow')) {
      setCurrency('RUB', '₽');
      setLanguage('ru');
    } else if (tz.includes('Almaty')) {
      setCurrency('KZT', '₸');
      setLanguage('ru');
    }
  }
}

function smartRound(value, currency) {
  if (currency === 'EUR' || currency === 'USD') {
    // Arrondi au 5 le plus proche (ex: 2153 -> 2155)
    return Math.ceil(value / 5) * 5;
  }
  if (currency === 'AED') {
    // Arrondi à la dizaine (ex: 7852 -> 7850)
    return Math.round(value / 10) * 10;
  }
  // Pour les grosses devises (RUB, KZT), arrondi à la centaine
  return Math.round(value / 100) * 100;
}

function convertAndRound(eurPrice) {
  const salePrice = eurPrice / 2;
  const rawConverted = salePrice * (currentRates[currentCurrency] || 1);
  return smartRound(rawConverted, currentCurrency);
}

function formatPrice(amount) {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  const symbolAfter = ['AED', 'RUB', 'KZT'];
  return symbolAfter.includes(currentCurrency)
    ? `${formatted} ${currentSymbol}`
    : `${currentSymbol} ${formatted}`;
}

// ─── RENDU DU SITE ──────────────────────────────────────────────
function renderSection(brandID) {
  const container = document.getElementById(`${brandID}-grid`);
  if (!container) return;

  const products = PRODUCTS[brandID] || [];
  container.innerHTML = products
    .map(
      (p) => `
        <div class="product-card">
            <div class="img-container">
                <img src="${p.img}" class="minimal-img" alt="${p.name}">
            </div>
            <h2>${p.name.toUpperCase()}</h2>
            <div class="price-row">
                <div class="price-box">
                    <span class="sale-price">${formatPrice(convertAndRound(p.priceEur))}</span>
                </div>
                <div class="wa-buy-btn ${brandID}" 
                     data-img="${p.img}" 
                     onclick="openCheckout(event, '${p.name}', ${p.priceEur / 2}, '${p.ref}')">
                    <span>${TRANSLATIONS[currentLang].buy}</span>
                </div>
            </div>
        </div>
    `
    )
    .join('');
}

// --- GESTION DU QR CODE DYNAMIQUE ---
function setupQRCode() {
  const logos = [document.getElementById('main-logo'), document.getElementById('gate-logo')];
  const overlay = document.getElementById('qr-overlay');
  const qrContainer = document.getElementById('qr-container');

  if (overlay && qrContainer) {
    logos.forEach((logo) => {
      if (logo) {
        logo.addEventListener('click', () => {
          const now = new Date();
          const hourKey =
            now.getFullYear().toString() +
            (now.getMonth() + 1).toString() +
            now.getDate().toString() +
            now.getHours().toString();
          const accessUrl = window.location.origin + '/?access=' + hourKey;

          const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
            accessUrl
          )}&color=000&bgcolor=fff`;

          qrContainer.innerHTML = `<img src="${qrImageUrl}" alt="QR Access" style="display:block; width:100%; height:100%;">`;
          overlay.style.display = 'flex';
          
          // Animation combinée : Fond flou + Carte qui surgit
          gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          gsap.fromTo('.digital-card', 
            { scale: 0.8, y: 40, opacity: 0 }, 
            { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }
          );
        });
      }
    });

    overlay.addEventListener('click', () => {
      gsap.to('.digital-card', { scale: 0.8, opacity: 0, duration: 0.3 });
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => (overlay.style.display = 'none'),
      });
    });
  }
}

function renderAllSections() {
  renderSection('cartier');
  renderSection('vca');
  renderSection('bulgari');

  setupQRCode();

  // Gestion de la Gate
  const enterBtn = document.getElementById('enter-button');
  const gate = document.getElementById('entry-gate');

  if (enterBtn && gate) {
    enterBtn.addEventListener('click', () => {
      gsap.to(gate, {
        duration: 1.2,
        opacity: 0,
        pointerEvents: 'none',
        ease: 'power4.inOut',
        onComplete: () => {
          // Animation de révélation des produits après la gate
          gsap.from('.product-card', {
            duration: 1,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            ease: 'power2.out',
          });
        },
      });
    });
  }
}

// ─── ACTIONS ────────────────────────────────────────────────────
function openCheckout(event, name, salePriceEur, ref) {
  if (event) event.preventDefault();

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS['fr'];
  const priceLocal = convertAndRound(salePriceEur * 2);
  const priceStr = formatPrice(priceLocal);

  // Récupération sécurisée de l'image
  const btn = event ? event.currentTarget : null;
  const imgPath = btn ? btn.getAttribute('data-img') : 'images/logo.png';
  const imgUrl = `${window.location.origin}/${imgPath}`;

  // Message structuré et professionnel (Style Conciergerie Luxe)
  const message =
    `MAISON 7\n\n` +
    `Item : ${name.toUpperCase()}\n` +
    `Ref : ${ref}\n` +
    `Price : ${priceStr}\n\n` +
    `View : ${imgUrl}\n\n` +
    `I would like more information regarding this piece.`;

  const waUrl = `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(message)}`;
  window.location.href = waUrl;
}

function setCurrency(curr, symbol) {
  currentCurrency = curr;
  currentSymbol = symbol;
  document
    .querySelectorAll('.currency-btn')
    .forEach((b) => b.classList.toggle('active', b.innerText.includes(symbol)));
  renderAllSections();
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document
    .querySelectorAll('.lang-btn')
    .forEach((b) => b.classList.toggle('active', b.innerText.toLowerCase() === lang));
  renderAllSections();
}

// ─── INITIALISATION ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchRates();
  // Géo-détection simplifiée (placeholder)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes('Dubai')) setCurrency('AED', 'د.إ');
  if (tz.includes('Moscow')) {
    setCurrency('RUB', '₽');
    setLanguage('ru');
  }
  if (tz.includes('Almaty')) {
    setCurrency('KZT', '₸');
    setLanguage('ru');
  }
});
if (typeof window !== 'undefined') {
  window.smartRound = smartRound;
  window.convertAndRound = convertAndRound;
  window.openCheckout = openCheckout;
  window.setCurrency = setCurrency;
  window.setLanguage = setLanguage;
}
export {
  smartRound,
  convertAndRound,
  formatPrice,
  TRANSLATIONS,
  openCheckout,
  setCurrency,
  setLanguage,
};
