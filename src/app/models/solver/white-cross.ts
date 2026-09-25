import { Cube } from '../cube.model';
import { Move, applyMove } from '../move.util';
import { SIDES, SideConfig, faceOf } from './side-config';

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
  if (solveEdgeOnBottom(cube, side, solution)) return true;
  if (solveEdgeInMiddleLayer(cube, side, solution)) return true;
  if (solveEdgeMisorientedAdjacent(cube, side, solution)) return true;
  return false; // il reste des cas qu'on n'a pas encore couverts (voir plus bas)
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

describe('EXPLORATION - état au blocage', () => {
  it('affiche le cube complet après blocage du solveur', () => {
    const cube = new Cube();
    cube.moveR();
    cube.moveU();
    cube.moveFPrime();
    cube.moveL2();
    cube.moveD();
    cube.moveB();

    const result = solveWhiteCross(cube);
    console.log('success:', result.success);
    console.log('solution:', result.solution);

    console.log('U:', cube.U.color);
    console.log('D:', cube.D.color);
    console.log('F:', cube.F.color);
    console.log('R:', cube.R.color);
    console.log('B:', cube.B.color);
    console.log('L:', cube.L.color);
  });
});