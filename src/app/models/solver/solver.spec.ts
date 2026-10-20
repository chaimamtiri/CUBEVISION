import { Cube } from '../cube.model';
import { Move, applyMove } from '../move.util';
import { isWhiteCrossSolved } from './white-cross';
import { CORNERS, isCornerSolved } from './corner-config';
import { solve } from './solver';
import { solveWhiteCrossBFS } from './cross-search';


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

describe('solve (croix + coins)', () => {
  it('cube neuf → résolu immédiatement', () => {
    const cube = new Cube();
    const result = solve(cube);
    expect(result.success).toBe(true);
    expect(result.stepsCompleted).toEqual(['white-cross', 'white-corners']);
  });

  it('résout la croix et les coins sur 5 scrambles aléatoires différents', () => {
    for (let seed = 1; seed <= 5; seed++) {
      const cube = new Cube();
      randomScramble(cube, 8, seed);

      const result = solve(cube);

      expect(result.success, `seed ${seed}; completed: ${result.stepsCompleted.join(', ')}`).toBe(true);
      expect(isWhiteCrossSolved(cube)).toBe(true);
      for (const corner of CORNERS) {
        expect(isCornerSolved(cube, corner)).toBe(true);
      }
    }
  }, 60000);
});

it('vérifie le mélange seed 1', () => {
  const cube = new Cube();

  const scramble = randomScramble(cube, 8, 1);

  console.log('Mélange seed 1 :', scramble);

  const cross = solveWhiteCrossBFS(cube);

  console.log('Croix réussie :', cross.success);
  console.log('Mouvements de la croix :', cross.solution);

  expect(cross.success).toBe(true);
  expect(isWhiteCrossSolved(cube)).toBe(true);
}, 15000);


it('inverse correctement le mélange seed 1', () => {
  const cube = new Cube();

  const scramble = randomScramble(cube, 8, 1);

  const inverse: Record<Move, Move> = {
    R: "R'", "R'": "R", R2: "R2",
    L: "L'", "L'": "L", L2: "L2",
    U: "U'", "U'": "U", U2: "U2",
    D: "D'", "D'": "D", D2: "D2",
    F: "F'", "F'": "F", F2: "F2",
    B: "B'", "B'": "B", B2: "B2"
  };

  const reverseMoves = scramble
    .slice()
    .reverse()
    .map(move => inverse[move]);

  for (const move of reverseMoves) {
    applyMove(cube, move, []);
  }

  expect(cube.isSolved()).toBe(true);
}, 15000);

