import { Cube } from '../cube.model';
import { Move, applyMove } from '../move.util'; 


export function isWhiteCrossSolved(cube: Cube): boolean {
  const whiteEdgesOnU =
    cube.U.color[1] === 'WHITE' &&
    cube.U.color[3] === 'WHITE' &&
    cube.U.color[5] === 'WHITE' &&
    cube.U.color[7] === 'WHITE';

  if (!whiteEdgesOnU) return false;

  const alignedWithF = cube.F.color[1] === cube.F.color[4];
  const alignedWithR = cube.R.color[1] === cube.R.color[4];
  const alignedWithB = cube.B.color[1] === cube.B.color[4];
  const alignedWithL = cube.L.color[1] === cube.L.color[4];

  return alignedWithF && alignedWithR && alignedWithB && alignedWithL;
}

// Cas très simple : l'arête blanc-vert est sur D[1] (touchant F), blanc vers le bas
export function solveWhiteGreenEdgeCase1(cube: Cube, solution: Move[]): boolean {
  const whiteOnD = cube.D.color[1] === 'WHITE';
  const greenOnF = cube.F.color[7] === 'GREEN';

  if (whiteOnD && greenOnF) {
    applyMove(cube, 'F2', solution);
    return true;
  }
  return false;
}

// Cas 2 : arête blanc-vert coincée en couche du milieu, entre F et R
// (vert visible sur F[5], blanc visible sur R[3])
// Un seul quart de tour R suffit à l'extraire vers la couche du haut
export function ejectMiddleLayerEdgeFR(cube: Cube, solution: Move[]): boolean {
  const greenOnF = cube.F.color[5] === 'GREEN';
  const whiteOnR = cube.R.color[3] === 'WHITE';

  if (greenOnF && whiteOnR) {
    applyMove(cube, 'R', solution);
    return true;
  }
  return false;
}


// Cas 3 : arête blanc-vert sur la couche du haut, mais mal orientée
// (vert visible sur U[5], blanc visible sur R[1])
// F' U' F la retourne et la place définitivement entre U et F
export function flipTopLayerEdgeUR(cube: Cube, solution: Move[]): boolean {
  const greenOnU = cube.U.color[5] === 'GREEN';
  const whiteOnR = cube.R.color[1] === 'WHITE';

  if (greenOnU && whiteOnR) {
    applyMove(cube, "F'", solution);
    applyMove(cube, "U'", solution);
    applyMove(cube, 'F', solution);
    return true;
  }
  return false;
}