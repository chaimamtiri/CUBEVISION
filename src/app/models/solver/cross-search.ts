import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { isWhiteCrossSolved } from './white-cross';

const ALL_MOVES: Move[] = [
  'R', "R'", 'R2', 'L', "L'", 'L2',
  'U', "U'", 'U2', 'D', "D'", 'D2',
  'F', "F'", 'F2', 'B', "B'", 'B2',
];

const AXIS: Record<string, 'UD' | 'LR' | 'FB'> = {
  U: 'UD', D: 'UD', L: 'LR', R: 'LR', F: 'FB', B: 'FB',
};

const INVERSE: Record<Move, Move> = {
  'R': "R'", "R'": 'R', 'R2': 'R2',
  'L': "L'", "L'": 'L', 'L2': 'L2',
  'U': "U'", "U'": 'U', 'U2': 'U2',
  'D': "D'", "D'": 'D', 'D2': 'D2',
  'F': "F'", "F'": 'F', 'F2': 'F2',
  'B': "B'", "B'": 'B', 'B2': 'B2',
};

const DISPATCH: Record<Move, (cube: Cube) => void> = {
  'R': c => c.moveR(), "R'": c => c.moveRPrime(), 'R2': c => c.moveR2(),
  'L': c => c.moveL(), "L'": c => c.moveLPrime(), 'L2': c => c.moveL2(),
  'U': c => c.moveU(), "U'": c => c.moveUPrime(), 'U2': c => c.moveU2(),
  'D': c => c.moveD(), "D'": c => c.moveDPrime(), 'D2': c => c.moveD2(),
  'F': c => c.moveF(), "F'": c => c.moveFPrime(), 'F2': c => c.moveF2(),
  'B': c => c.moveB(), "B'": c => c.moveBPrime(), 'B2': c => c.moveB2(),
};

export interface SearchResult {
  success: boolean;
  solution: Move[];
}

function search(cube: Cube, depthLeft: number, path: Move[], lastAxis: string | null): boolean {
  if (isWhiteCrossSolved(cube)) return true;
  if (depthLeft === 0) return false;

  for (const move of ALL_MOVES) {
    const face = move[0];
    if (AXIS[face] === lastAxis) continue; // évite les mouvements redondants du même axe

    DISPATCH[move](cube);       // applique
    path.push(move);

    if (search(cube, depthLeft - 1, path, AXIS[face])) return true;

    path.pop();
    DISPATCH[INVERSE[move]](cube); // annule, au lieu de cloner
  }
  return false;
}

// Recherche en profondeur limitée croissante : essaie 1 coup, puis 2, puis 3...
// jusqu'à trouver une solution. Mémoire utilisée : proportionnelle à la profondeur, pas au nombre de possibilités.
export function solveWhiteCrossBFS(cube: Cube, maxDepth = 8): SearchResult {
  for (let depth = 0; depth <= maxDepth; depth++) {
    const path: Move[] = [];
    if (search(cube, depth, path, null)) {
      return { success: true, solution: path };
    }
  }
  return { success: false, solution: [] };
}