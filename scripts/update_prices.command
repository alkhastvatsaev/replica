#!/bin/bash
cd "$(dirname "$0")"
echo "--- SYNCHRONISATION DES PRIX REPLICA ---"
python3 sync_prices.py
echo "--- TERMINÉ ---"
sleep 5
