// ─── CONFIGURATION ────────────────────────────────────────────────
const WA_PHONE = "33745999118";
const TRANSLATIONS = {
    fr: { buy: "COMMANDER", wa_msg: "Bonjour, je suis intéressé par ce produit : " },
    en: { buy: "MESSAGE SELLER", wa_msg: "Hello, I am interested in this product: " },
    ru: { buy: "СВЯЗАТЬСЯ", wa_msg: "Здравствуйте, меня интересует этот товар: " },
    ar: { buy: "واصل المستشار", wa_msg: "مرحباً، أنا مهتم بهذا المنتج: " }
};

let currentLang = 'fr';
let currentCurrency = 'EUR';
let currentSymbol = '€';
let currentRates = { 'EUR': 1, 'USD': 1.08, 'AED': 3.97, 'RUB': 98.5, 'KZT': 485 };

// ─── LOGIQUE DE CONVERSION ───────────────────────────────────────
async function fetchRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        currentRates = data.rates;
        renderAllSections();
    } catch (e) { console.error("Erreur taux:", e); }
}

function convertAndRound(eurPrice) {
    const salePrice = eurPrice / 2; // Règle des -50% appliquée ici une fois pour toutes
    return Math.round(salePrice * (currentRates[currentCurrency] || 1));
}

function formatPrice(amount) {
    const formatted = new Intl.NumberFormat('fr-FR').format(amount);
    const symbolAfter = ['AED', 'RUB', 'KZT'];
    return symbolAfter.includes(currentCurrency) ? `${formatted} ${currentSymbol}` : `${currentSymbol} ${formatted}`;
}

// ─── RENDU DU SITE ──────────────────────────────────────────────
function renderSection(brandID) {
    const container = document.getElementById(`${brandID}-grid`);
    if (!container) return;
    
    const products = PRODUCTS[brandID] || [];
    container.innerHTML = products.map(p => `
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
                     onclick="openCheckout('${p.name}', ${p.priceEur / 2}, '${p.ref}')">
                    <span>${TRANSLATIONS[currentLang].buy}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAllSections() {
    renderSection('cartier');
    renderSection('vca');
    renderSection('bulgari');
}

// ─── ACTIONS ────────────────────────────────────────────────────
function openCheckout(name, salePriceEur, ref) {
    const t = TRANSLATIONS[currentLang];
    const priceLocal = convertAndRound(salePriceEur * 2); // Le prix converti est déjà -50%
    const priceStr = formatPrice(priceLocal);
    
    const btn = event.currentTarget;
    const imgPath = btn.getAttribute('data-img');
    const imgUrl = `${window.location.origin}/${imgPath}`;
    
    const message = `${t.wa_msg} ${name.toUpperCase()} (Ref: ${ref} - ${priceStr})\n\nPhoto : ${imgUrl}`;
    window.location.href = `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(message)}`;
}

function setCurrency(curr, symbol) {
    currentCurrency = curr;
    currentSymbol = symbol;
    document.querySelectorAll('.currency-btn').forEach(b => b.classList.toggle('active', b.innerText.includes(symbol)));
    renderAllSections();
}

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.innerText.toLowerCase() === lang));
    renderAllSections();
}

// ─── INITIALISATION ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    fetchRates();
    // Géo-détection simplifiée (placeholder)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Dubai')) setCurrency('AED', 'د.إ');
    if (tz.includes('Moscow')) { setCurrency('RUB', '₽'); setLanguage('ru'); }
    if (tz.includes('Almaty')) { setCurrency('KZT', '₸'); setLanguage('ru'); }
});
