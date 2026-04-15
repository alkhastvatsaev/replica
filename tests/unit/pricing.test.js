import { describe, it, expect } from 'vitest';
import { smartRound, convertAndRound } from '../../js/app.js';

describe('Logique de Prix - MAISON 7', () => {
    
    it('devrait appliquer une remise de 50%', () => {
        // En EUR, 1000€ officiel -> 500€ boutique
        expect(convertAndRound(1000)).toBe(500);
    });

    it('devrait arrondir les prix Luxe (EUR/USD au 5 le plus proche)', () => {
        // 1075 / 2 = 537.5 -> Devrait arrondir à 540 ou 535 selon la logique.
        // Notre logique actuelle est Math.ceil(val / 5) * 5
        expect(smartRound(537.5, 'EUR')).toBe(540);
        expect(smartRound(532.1, 'EUR')).toBe(535);
    });

    it('devrait arrondir proprement pour les Dirhams (AED - à la dizaine)', () => {
        // 537.5 * 3.97 = 2133.875 -> Arrondi à la dizaine -> 2130
        expect(smartRound(2133.875, 'AED')).toBe(2130);
    });

    it('devrait arrondir proprement pour les Roubles (RUB - à la centaine)', () => {
        // 537.5 * 98.5 = 52943.75 -> Arrondi à la centaine -> 52900
        expect(smartRound(52943.75, 'RUB')).toBe(52900);
    });

});
