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