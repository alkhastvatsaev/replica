import requests
import re
import os

# --- BASE DE DONNÉES DES RÉFÉRENCES (Ground Truth) ---
# Ajoute ici tes références officielles. Le script cherchera EXACTEMENT ça.
CATALOG = {
    "love": {"ref": "CRB4084600", "name": "Bague Love", "brand": "Cartier"},
    "clou": {"ref": "CRB4225900", "name": "Bague Juste un Clou", "brand": "Cartier"},
    "clash": {"ref": "CRB4229800", "name": "Bague Clash", "brand": "Cartier"},
    "bracelet": {"ref": "CRB6035517", "name": "Bracelet Love", "brand": "Cartier"},
    "trinity": {"ref": "CRB4052700", "name": "Bague Trinity", "brand": "Cartier"},
    "alhambra": {"ref": "VCARA41800", "name": "Bracelet Alhambra", "brand": "VCA"},
    "reversible": {"ref": "VCARPGV500", "name": "Bague Réversible", "brand": "VCA"}
}

def fetch_price_by_ref(ref, brand):
    """
    Cherche le prix sur Google Search en filtrant sur le site officiel.
    C'est plus robuste que de scraper directement les pages protégées.
    """
    search_url = f"https://www.google.com/search?q={brand}+{ref}+prix+officiel+france"
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
    
    try:
        response = requests.get(search_url, headers=headers)
        # On cherche un motif de prix (ex: 5 250 €, 2.150,00 €)
        prices = re.findall(r'(\d+[\s|\.]?\d+)\s?€', response.text)
        if prices:
            # On prend le prix le plus probable (souvent le premier ou le plus élevé)
            clean_prices = [int(p.replace(" ", "").replace(".", "")) for p in prices]
            return max(clean_prices)
    except:
        return None
    return None

def main():
    print("💎 REPLICA PRICE SYNC — MODE SÉCURISÉ 💎")
    print("------------------------------------------")
    
    new_data = {}
    for key, item in CATALOG.items():
        print(f"🔍 Recherche {item['name']} (Ref: {item['ref']})...")
        price = fetch_price_by_ref(item['ref'], item['brand'])
        
        if price:
            print(f"✅ Trouvé : {price} €")
            new_data[key] = price
        else:
            print(f"⚠️ Impossible de trouver le prix pour {item['ref']}. Le script gardera l'ancien prix.")

    print("\n--- RÉCAPITULATIF DES MISES À JOUR ---")
    for key, price in new_data.items():
        print(f"- {CATALOG[key]['name']} : {price}€ (Boutique) -> {int(price*0.5)}€ (Replica)")
    
    print("\n[INFO] Pour appliquer ces prix à ton site Vercel, je peux mettre à jour index.html maintenant.")

if __name__ == "__main__":
    main()
