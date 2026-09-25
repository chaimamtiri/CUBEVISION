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