# Maison 7 - Directives de Développement IA

> [!IMPORTANT]
> **MAINTENANCE QR CODE :** L'utilisateur prévoit de changer le domaine du site prochainement. Il faudra régénérer les tracés vectoriels du fichier `MAISON7_CARD_FOR_PRINT_ONLY.svg` avec la nouvelle URL dès qu'elle sera connue.


## 📱 Dimensions de Simulation (CRITIQUE)

Toute simulation ou capture d'écran doit être effectuée avec les dimensions d'un iPhone réel :

- **Largeur cible :** 375px à 393px (iPhone SE / iPhone 17 Pro).
- **Format :** Portrait uniquement.
- **Règle d'or :** Ne jamais tester sur une fenêtre large, car cela masque les erreurs d'alignement des titres longs.

## 📏 Règles de Design

- **Alignement horizontal :** Les boutons "COMMANDER" et les prix doivent toujours être alignés sur la même ligne horizontale dans une grille, quelle que soit la longueur du texte de l'article (1, 2 ou 3 lignes).
- **Structure :** Utiliser `display: flex` avec `margin-top: auto` sur le bloc de prix pour garantir cet alignement.
- **Hauteur des titres :** Toujours prévoir un `min-height` suffisant (actuellement `4.5em`) pour absorber les retours à la ligne sur mobile.

## ✍️ Ton & Communication
- **Zéro Emoji :** Interdiction stricte d'utiliser des emojis dans les messages sortants (WhatsApp, notifications). Cela nuit à l'image de marque luxe et peut paraître généré par IA.
- **Style Conciergerie :** Utiliser des labels clairs, une ponctuation parfaite et un ton formel/courtois. Majuscules uniquement pour les en-têtes et les noms propres indispensables.

## 💰 Stratégie de Tarification & Catalogue

Pour tout produit ajouté au catalogue (Cartier, Bulgari, Van Cleef, etc.), suivre obligatoirement cette procédure :

1.  **TITRE :** Utiliser le nom officiel de la collection (ex: "Serpenti Viper" et non juste "Serpenti").
2.  **PRIX DE RÉFÉRENCE :** Chercher le prix de vente public actuel (Retail) sur le site officiel de la marque.
3.  **CALCUL DU PRIX DE VENTE :** Le site applique automatiquement une réduction de **-50%** (via l'algorithme `eurPrice / 2`). 
4.  **SAISIE :** Dans `inventory.js`, renseigner la valeur `priceEur` avec le **Prix Boutique Officiel** trouvé à l'étape 2.

*Exemple Bulgari :* 
- Prix Boutique : 4 450 €
- Saisie dans inventory : `priceEur: 4450`
- Affichage client final : **2 225 €**

## 🛠 Tests Automatiques

Les tests Playwright sont configurés sur **iPhone 17 Pro**. Ne pas modifier ces dimensions sans validation.
