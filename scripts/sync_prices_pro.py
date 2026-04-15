import requests
import re
import os

# --- CONFIGURATION ---
API_KEY = "3fe524b2271c45d909602dd4a6c55559" # Ta clé ScraperAPI
CATALOG = {
    "love": {"ref": "CRB4084600", "url": "https://www.cartier.com/fr-fr/joaillerie/bagues/bague-love-CRB4084600.html"},
    "clou": {"ref": "CRB4225900", "url": "https://www.cartier.com/fr-fr/joaillerie/bagues/bague-juste-un-clou-CRB4225900.html"},
    "clash": {"ref": "CRB4229800", "url": "https://www.cartier.com/fr-fr/joaillerie/bagues/bague-clash-de-cartier-CRB4229800.html"},
    "bracelet": {"ref": "CRB6035517", "url": "https://www.cartier.com/fr-fr/joaillerie/bracelets/bracelet-love-CRB6035517.html"},
    "trinity": {"ref": "CRB4052700", "url": "https://www.cartier.com/fr-fr/joaillerie/bagues/bague-trinity-CRB4052700.html"},
    "alhambra": {"ref": "VCARA41800", "url": "https://www.vancleefarpels.com/fr/fr/collections/jewelry/alhambra/vcara41800-vintage-alhambra-bracelet-5-motifs.html"},
    "reversible": {"ref": "VCARPGV500", "url": "https://www.vancleefarpels.com/fr/fr/collections/jewelry/alhambra/vcarpgv500-vintage-alhambra-reversible-ring.html"}
}

def get_official_price(url):
    """
    Utilise ScraperAPI pour contourner TOUTES les protections.
    """
    # En local on utilise la clé en dur, sur GitHub on utilise le Secret
    api_key = os.environ.get('SCRAPER_API_KEY') or API_KEY
    proxy_url = f"http://api.scraperapi.com?api_key={api_key}&url={url}&render=true"
    
    try:
        response = requests.get(proxy_url, timeout=60)
        # On cherche le prix dans le code source
        match = re.search(r'"price":\s*"?(\d+)', response.text)
        if match:
            return int(match.group(1))
    except Exception as e:
        print(f"Erreur scrap {url}: {e}")
    return None

def main():
    print("💎 REPLICA ULTIMATE SYNC — ACTIVÉ 💎")
    
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    any_change = False
    for pid, info in CATALOG.items():
        print(f"📡 Scraping {info['ref']}...")
        price = get_official_price(info["url"])
        
        if price and price > 100:
            discounted = int(price * 0.5)
            # Mise à jour du data-eur
            pattern = rf'data-product="{pid}" onclick="openCheckout\(\'(.*?)\', \d+\)">'
            replacement = f'data-product="{pid}" onclick="openCheckout(\'\\1\', {discounted})">'
            
            # Mise à jour visuelle du prix affiché
            # On cherche le span qui contient le data-eur juste avant le bouton
            html_new = re.sub(
                rf'data-eur="\d+">(\d+[\s\d]*) €</span>', 
                lambda m: f'data-eur="{discounted}">{discounted:,.0f} €</span>'.replace(',', ' '), 
                html
            )
            # Note: Le remplacement global est complexe, on cible via data-product
            html = re.sub(pattern, replacement, html)
            print(f"✅ Mis à jour : {price}€ -> {discounted}€")
            any_change = True

    if any_change:
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("🚀 Catalogue mis à jour et synchronisé.")

if __name__ == "__main__":
    main()
