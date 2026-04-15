import requests
import re
import os

# --- PRODUITS À SURVEILLER ---
CATALOG = {
    "love": {"ref": "CRB4084600", "q": "Cartier CRB4084600 prix neuf"},
    "clou": {"ref": "CRB4225900", "q": "Cartier CRB4225900 prix neuf"},
    "clash": {"ref": "CRB4229800", "q": "Cartier CRB4229800 prix neuf"},
    "bracelet": {"ref": "CRB6035517", "q": "Cartier CRB6035517 prix neuf"},
    "trinity": {"ref": "CRB4052700", "q": "Cartier CRB4052700 prix neuf"},
    "alhambra": {"ref": "VCARA41800", "q": "Van Cleef Arpels VCARA41800 prix neuf"},
    "reversible": {"ref": "VCARPGV500", "q": "Van Cleef Arpels VCARPGV500 prix neuf"}
}

def get_price_from_google(query):
    """
    Simule une recherche Google pour trouver le prix dans les snippets.
    Très efficace et jamais bloqué par Cartier.
    """
    url = f"https://www.google.fr/search?q={query.replace(' ', '+')}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        # On cherche un montant suivi de € ou EUR
        # On cible les formats type : "2 150,00 €" ou "5250 €"
        matches = re.findall(r'(\d+[\s|\.]?\d+)\s?(?:€|EUR)', response.text)
        if matches:
            # On nettoie et on convertit
            prices = [int(p.replace('\xa0', '').replace(' ', '').replace('.', '').replace(',', '')) for p in matches if len(p) > 2]
            # On prend la valeur la plus vraisemblable (le prix officiel est souvent le plus élevé ou répété)
            if prices:
                # Filtrage : un prix de luxe est rarement en dessous de 500€ pour ces refs
                valid_prices = [p for p in prices if p > 500]
                return max(valid_prices) if valid_prices else None
    except Exception as e:
        print(f"Erreur recherche {query}: {e}")
    return None

def main():
    print("🤖 REPLICA BOT : Synchronisation gratuite en cours...")
    
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    updates = 0
    for pid, data in CATALOG.items():
        print(f"🔍 Vérification {pid}...")
        official_price = get_price_from_google(data["q"])
        
        if official_price:
            discounted = int(official_price * 0.5)
            # Mise à jour dans le HTML
            # On met à jour l'attribut data-eur="{X}"
            new_html = re.sub(
                rf'data-product="{pid}" onclick="openCheckout\(\'(.*?)\', \d+\)">',
                f'data-product="{pid}" onclick="openCheckout(\'\\1\', {discounted})">',
                html
            )
            if new_html != html:
                html = new_html
                updates += 1
                print(f"✅ {pid} : {official_price}€ -> {discounted}€ (Replica)")
        else:
            print(f"⚠️ {pid} : Prix non trouvé, on garde l'ancien.")

    if updates > 0:
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\n✨ terminé ! {updates} prix mis à jour.")
    else:
        print("\n🙌 Aucun changement nécessaire.")

if __name__ == "__main__":
    main()
