import { describe, expect, it } from 'vitest';

import { Cube } from '../cube.model';
import { CORNERS, isCornerSolved } from './corner-config';
import { isWhiteCrossSolved } from './white-cross';
import { restrictedSearch } from './restricted-search';
import { solveWhiteCrossBFS } from './cross-search';
import { Move } from '../move.util';

describe('Budget de recherche des coins', () => {

  it('mesure une recherche bornee apres resolution de la croix', () => {

    const cube = new Cube();

    cube.moveD();
    cube.moveL();
    cube.moveR2();
    cube.moveR2();
    cube.moveL2();
    cube.moveBPrime();
    cube.moveR();
    cube.moveBPrime();

    // Resoudre d'abord la croix
    const cross = solveWhiteCrossBFS(cube);

    expect(cross.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);

    // Premier coin encore non resolu
    const corner = CORNERS.find(c => !isCornerSolved(cube, c));

    expect(corner).toBeDefined();

    if (!corner) return;

    const moves: Move[] = [
      'U', "U'", 'U2',
      'D', "D'", 'D2',
      'R', "R'", 'R2',
      'L', "L'", 'L2',
      'F', "F'", 'F2',
      'B', "B'", 'B2'
    ];

    const goal = (c: Cube) =>
      isWhiteCrossSolved(c) &&
      isCornerSolved(c, corner);

    const start = performance.now();

    const result = restrictedSearch(
      cube,
      goal,
      moves,
      7,
      50_000
    );

    const elapsed = performance.now() - start;

    console.log('Coin :', corner.key);
    console.log('Succes :', result.success);
    console.log('Raison :', result.reason);
    console.log('Noeuds explores :', result.nodesVisited);
    console.log('Temps :', elapsed.toFixed(1), 'ms');

    expect(result.nodesVisited).toBeLessThanOrEqual(50_001);
  });

});