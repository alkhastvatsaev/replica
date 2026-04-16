#!/bin/bash
# On se place dans le dossier du projet
cd "$(dirname "$0")"

# On s'assure que Node et npm sont dans le PATH
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

PORT=3000

echo "------------------------------------------------"
echo "✨ MAISON 7 : Lancement du serveur local..."
echo "Port : $PORT"
echo "------------------------------------------------"

# On ouvre le navigateur
open "http://localhost:$PORT"

# Lancement du serveur via Vite (le standard moderne)
npm start
