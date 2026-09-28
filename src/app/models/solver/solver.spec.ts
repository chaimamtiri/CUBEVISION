import { Cube } from '../cube.model';
import { Move, applyMove } from '../move.util';
import { isWhiteCrossSolved } from './white-cross';
import { CORNERS, isCornerSolved } from './corner-config';
import { solve } from './solver';
import { solveWhiteCrossBFS } from './cross-search';
import { solveOneCorner } from './white-corners';

const ALL_MOVES: Move[] = [
  'R', "R'", 'R2', 'L', "L'", 'L2',
  'U', "U'", 'U2', 'D', "D'", 'D2',
  'F', "F'", 'F2', 'B', "B'", 'B2',
];

function randomScramble(cube: Cube, count: number, seed: number): Move[] {
  const applied: Move[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = 0; i < count; i++) {
    const move = ALL_MOVES[Math.floor(rand() * ALL_MOVES.length)];
    applyMove(cube, move, applied);
  }
  return applied;
}

describe('EXPLORATION - solveWhiteCorners en conditions réelles, coin par coin', () => {
  it('trace chaque coin avec la contrainte alreadySolved, comme le vrai solveWhiteCorners', () => {
    const cube = new Cube();
    randomScramble(cube, 8, 1);
    solveWhiteCrossBFS(cube);

    const solved: typeof CORNERS = [];
    for (const corner of CORNERS) {
      const start = Date.now();
      const result = solveOneCorner(cube, corner, solved);
      const elapsed = Date.now() - start;
      console.log(`corner ${corner.key}: success=${result.success}, moves=${result.solution.length}, tempsMs=${elapsed}`);
      if (!result.success) break;
      solved.push(corner);
    }
  }, 60000);
});