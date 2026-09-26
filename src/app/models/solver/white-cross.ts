import { Cube } from '../cube.model';
import { Move, applyMove } from '../move.util';
import { SIDES, SideConfig, SideKey, faceOf } from './side-config';


export function isEdgeSolved(cube: Cube, side: SideConfig): boolean {
  return cube.U.color[side.touchU] === 'WHITE' && faceOf(cube, side.key).color[1] === side.color;
}

export function isWhiteCrossSolved(cube: Cube): boolean {
  return (Object.values(SIDES) as SideConfig[]).every(side => isEdgeSolved(cube, side));
}

// Cas 1 : arête coincée sur D, blanc vers le bas, sous la bonne face
export function solveEdgeOnBottom(cube: Cube, side: SideConfig, solution: Move[]): boolean {
  const face = faceOf(cube, side.key);
  const whiteOnD = cube.D.color[side.touchD] === 'WHITE';
  const colorOnFace = face.color[7] === side.color;

  if (whiteOnD && colorOnFace) {
    applyMove(cube, side.move2, solution);
    return true;
  }
  return false;
}

// Cas 2 : arête coincée en couche du milieu, entre cette face et la suivante
export function solveEdgeInMiddleLayer(cube: Cube, side: SideConfig, solution: Move[]): boolean {
  const face = faceOf(cube, side.key);
  const nextSide = SIDES[side.next];
  const nextFace = faceOf(cube, nextSide.key);

  const colorOnSide = face.color[5] === side.color;
  const whiteOnNext = nextFace.color[3] === 'WHITE';

  if (colorOnSide && whiteOnNext) {
    applyMove(cube, nextSide.move, solution);
    return true;
  }
  return false;
}

// Cas 3 : arête déjà sur U, adjacente à sa destination, mais mal orientée
export function solveEdgeMisorientedAdjacent(cube: Cube, side: SideConfig, solution: Move[]): boolean {
  const nextSide = SIDES[side.next];
  const nextFace = faceOf(cube, nextSide.key);

  const colorOnU = cube.U.color[nextSide.touchU] === side.color;
  const whiteOnNext = nextFace.color[1] === 'WHITE';

  if (colorOnU && whiteOnNext) {
    applyMove(cube, side.movePrime, solution);
    applyMove(cube, "U'", solution);
    applyMove(cube, side.move, solution);
    return true;
  }
  return false;
}

// Point d'entrée pour une arête donnée : essaie chaque cas connu, dans l'ordre
export function solveCrossEdge(cube: Cube, side: SideConfig, solution: Move[]): boolean {
  if (isEdgeSolved(cube, side)) return true;
  if (solveEdgeOnBottomAnywhere(cube, side, solution)) return true;
  if (solveEdgeInMiddleLayer(cube, side, solution)) return true;
  if (solveEdgeMisorientedAdjacent(cube, side, solution)) return true;
  if (solveEdgeCorrectlyOrientedWrongSlot(cube, side, solution)) return true;
  return false;
}

export interface SolveResult {
  success: boolean;
  solution: Move[];
}

export function solveWhiteCross(cube: Cube): SolveResult {
  const solution: Move[] = [];
  const maxIterations = 50; // large marge de sécurité contre une boucle infinie

  for (let i = 0; i < maxIterations; i++) {
    if (isWhiteCrossSolved(cube)) {
      return { success: true, solution };
    }

    let progressed = false;
    for (const side of Object.values(SIDES)) {
      if (!isEdgeSolved(cube, side)) {
        const handled = solveCrossEdge(cube, side, solution);
        if (handled) {
          progressed = true;
          break; // on retraite l'état depuis le début après chaque mouvement
        }
      }
    }

    if (!progressed) {
      // Aucune des 4 arêtes n'a pu être résolue avec les cas connus → on s'arrête honnêtement
      return { success: false, solution };
    }
  }

  return { success: false, solution };
}


const U_CYCLE: SideKey[] = ['F', 'R', 'B', 'L'];
const D_CYCLE: SideKey[] = ['F', 'L', 'B', 'R'];

function turnsToReach(cycle: SideKey[], from: SideKey, to: SideKey): number {
  return (cycle.indexOf(to) - cycle.indexOf(from) + 4) % 4;
}

function applyTurns(cube: Cube, face: 'U' | 'D', turns: number, solution: Move[]): void {
  const moves: Record<number, Move> = face === 'U'
    ? { 1: 'U', 2: 'U2', 3: "U'" }
    : { 1: 'D', 2: 'D2', 3: "D'" };
  if (turns !== 0) applyMove(cube, moves[turns], solution);
}

// Cas 4 : arête déjà orientée (blanc dessus), mais dans le mauvais slot du haut
export function solveEdgeCorrectlyOrientedWrongSlot(cube: Cube, side: SideConfig, solution: Move[]): boolean {
  for (const key of U_CYCLE) {
    if (key === side.key) continue;
    const s2 = SIDES[key];
    const whiteUp = cube.U.color[s2.touchU] === 'WHITE';
    const colorMatches = faceOf(cube, s2.key).color[1] === side.color;
    if (whiteUp && colorMatches) {
      const turns = turnsToReach(U_CYCLE, s2.key, side.key);
      applyTurns(cube, 'U', turns, solution);
      return true;
    }
  }
  return false;
}

// Cas 5 : arête en bas (blanc vers le bas), mais sous la mauvaise face
export function solveEdgeOnBottomAnywhere(cube: Cube, side: SideConfig, solution: Move[]): boolean {
  for (const key of D_CYCLE) {
    const s2 = SIDES[key];
    const whiteDown = cube.D.color[s2.touchD] === 'WHITE';
    const colorOut = faceOf(cube, s2.key).color[7] === side.color;
    if (whiteDown && colorOut) {
      const turns = turnsToReach(D_CYCLE, s2.key, side.key);
      applyTurns(cube, 'D', turns, solution);
      applyMove(cube, side.move2, solution);
      return true;
    }
  }
  return false;
}