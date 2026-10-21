
import { describe, expect, it } from 'vitest';
import { generateScramble } from './scramble.util';

describe('generateScramble', () => {

  it('génère 20 mouvements par défaut', () => {
    const scramble = generateScramble();

    expect(scramble.length).toBe(20);
  });

  it('respecte la longueur demandée', () => {
    const scramble = generateScramble(10);

    expect(scramble.length).toBe(10);
  });

  it('ne répète pas deux fois la même face consécutivement', () => {
    const scramble = generateScramble(100);

    for (let i = 1; i < scramble.length; i++) {
      expect(scramble[i][0]).not.toBe(scramble[i - 1][0]);
    }
  });

  it('ne génère que des mouvements valides', () => {
    const validMoves = [
      'R', "R'", 'R2',
      'L', "L'", 'L2',
      'U', "U'", 'U2',
      'D', "D'", 'D2',
      'F', "F'", 'F2',
      'B', "B'", 'B2'
    ];

    const scramble = generateScramble(100);

    for (const move of scramble) {
      expect(validMoves).toContain(move);
    }
  });

});
