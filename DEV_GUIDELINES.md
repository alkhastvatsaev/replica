# Maison 7 - Directives de Développement IA

## 📱 Dimensions de Simulation (CRITIQUE)

Toute simulation ou capture d'écran doit être effectuée avec les dimensions d'un iPhone réel :

- **Largeur cible :** 375px à 393px (iPhone SE / iPhone 17 Pro).
- **Format :** Portrait uniquement.
- **Règle d'or :** Ne jamais tester sur une fenêtre large, car cela masque les erreurs d'alignement des titres longs.

## 📏 Règles de Design

- **Alignement horizontal :** Les boutons "COMMANDER" et les prix doivent toujours être alignés sur la même ligne horizontale dans une grille, quelle que soit la longueur du texte de l'article (1, 2 ou 3 lignes).
- **Structure :** Utiliser `display: flex` avec `margin-top: auto` sur le bloc de prix pour garantir cet alignement.
- **Hauteur des titres :** Toujours prévoir un `min-height` suffisant (actuellement `4.5em`) pour absorber les retours à la ligne sur mobile.

## 🛠 Tests Automatiques

Les tests Playwright sont configurés sur **iPhone 17 Pro**. Ne pas modifier ces dimensions sans validation.
