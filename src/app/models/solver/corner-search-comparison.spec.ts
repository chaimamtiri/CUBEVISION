import { describe, expect, it } from 'vitest';

import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { CORNERS, isCornerSolved } from './corner-config';
import { isWhiteCrossSolved } from './white-cross';
import { solveWhiteCrossBFS } from './cross-search';
import { restrictedSearch } from './restricted-search';

const ALL_MOVES: Move[] = [
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2'
];

function faceMoves(face: string): Move[] {
  return [face, `${face}'`, `${face}2`] as Move[];
}

describe('Comparaison des recherches des coins', () => {
  it('compare deux ensembles de mouvements', () => {
    const cube = new Cube();

    cube.moveD();
    cube.moveL();
    cube.moveR2();
    cube.moveR2();
    cube.moveL2();
    cube.moveBPrime();
    cube.moveR();
    cube.moveBPrime();

    const cross = solveWhiteCrossBFS(cube);

    expect(cross.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);

    const corner = CORNERS.find(
      c => !isCornerSolved(cube, c)
    );

    expect(corner).toBeDefined();
    if (!corner) return;

    const limitedMoves: Move[] = [
      ...faceMoves('U'),
      ...faceMoves('D'),
      ...faceMoves(corner.sideA),
      ...faceMoves(corner.sideB)
    ];

    const goal = (c: Cube) =>
      isWhiteCrossSolved(c) &&
      isCornerSolved(c, corner);

    const strategies = [
      { name: 'Limitee', moves: limitedMoves },
      { name: 'Complete', moves: ALL_MOVES }
    ];

    console.log('Coin analyse :', corner.key);

    for (const strategy of strategies) {
      const copy = cube.clone();

      const start = performance.now();

      const result = restrictedSearch(
        copy,
        goal,
        strategy.moves,
        7,
        50_000
      );

      const elapsed = performance.now() - start;

      console.log(
        strategy.name,
        '| Succes :', result.success,
        '| Raison :', result.reason,
        '| Noeuds :', result.nodesVisited,
        '| Temps :', elapsed.toFixed(1), 'ms'
      );

      expect(result.nodesVisited).toBeLessThanOrEqual(50_001);

      if (result.success) {
        expect(goal(copy)).toBe(true);
      }
    }
  });
});