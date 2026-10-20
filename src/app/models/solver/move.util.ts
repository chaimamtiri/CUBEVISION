import { Cube } from '../cube.model';

export type Move = 'R' | "R'" | 'R2' | 'U' | "U'" | 'U2' | 'L' | "L'" | 'L2'
                  | 'F' | "F'" | 'F2' | 'D' | "D'" | 'D2' | 'B' | "B'" | 'B2';

const DISPATCH: Record<Move, (cube: Cube) => void> = {
  'R': c => c.moveR(), "R'": c => c.moveRPrime(), 'R2': c => c.moveR2(),
  'U': c => c.moveU(), "U'": c => c.moveUPrime(), 'U2': c => c.moveU2(),
  'L': c => c.moveL(), "L'": c => c.moveLPrime(), 'L2': c => c.moveL2(),
  'F': c => c.moveF(), "F'": c => c.moveFPrime(), 'F2': c => c.moveF2(),
  'D': c => c.moveD(), "D'": c => c.moveDPrime(), 'D2': c => c.moveD2(),
  'B': c => c.moveB(), "B'": c => c.moveBPrime(), 'B2': c => c.moveB2(),
};

export function applyMove(cube: Cube, move: Move, solution: Move[]): void {
  DISPATCH[move](cube);
  solution.push(move);
}

export const INVERSE_MOVE: Record<Move, Move> = {
  'R': "R'", "R'": 'R', 'R2': 'R2',
  'L': "L'", "L'": 'L', 'L2': 'L2',
  'U': "U'", "U'": 'U', 'U2': 'U2',
  'D': "D'", "D'": 'D', 'D2': 'D2',
  'F': "F'", "F'": 'F', 'F2': 'F2',
  'B': "B'", "B'": 'B', 'B2': 'B2',
};

// Annule une séquence de mouvements dans l'ordre inverse, sans enregistrer
// ces annulations dans une solution (utilisé pour restaurer un cube après un essai raté).

export function undoMoves(cube: Cube, moves: Move[]): void {
  const inverse: Record<Move, Move> = {
    'R': "R'", "R'": 'R', 'R2': 'R2',
    'L': "L'", "L'": 'L', 'L2': 'L2',
    'U': "U'", "U'": 'U', 'U2': 'U2',
    'D': "D'", "D'": 'D', 'D2': 'D2',
    'F': "F'", "F'": 'F', 'F2': 'F2',
    'B': "B'", "B'": 'B', 'B2': 'B2',
  };

  for (let i = moves.length - 1; i >= 0; i--) {
    applyMove(cube, inverse[moves[i]], []);
  }
}
