import { Cube } from './cube.model';

export type Move = 'R' | "R'" | 'R2' | 'U' | "U'" | 'U2' | 'L' | "L'" | 'L2'
                  | 'F' | "F'" | 'F2' | 'D' | "D'" | 'D2' | 'B' | "B'" | 'B2';

export function applyMove(cube: Cube, move: Move, solution: Move[]): void {
  const dispatch: Record<Move, () => void> = {
    'R': () => cube.moveR(), "R'": () => cube.moveRPrime(), 'R2': () => cube.moveR2(),
    'U': () => cube.moveU(), "U'": () => cube.moveUPrime(), 'U2': () => cube.moveU2(),
    'L': () => cube.moveL(), "L'": () => cube.moveLPrime(), 'L2': () => cube.moveL2(),
    'F': () => cube.moveF(), "F'": () => cube.moveFPrime(), 'F2': () => cube.moveF2(),
    'D': () => cube.moveD(), "D'": () => cube.moveDPrime(), 'D2': () => cube.moveD2(),
    'B': () => cube.moveB(), "B'": () => cube.moveBPrime(), 'B2': () => cube.moveB2(),
  };

  dispatch[move]();
  solution.push(move);
}