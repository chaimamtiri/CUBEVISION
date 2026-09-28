import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { solveWhiteCrossBFS } from './cross-search';
import { solveWhiteCorners } from './white-corners';

export interface SolveResult {
  success: boolean;
  solution: Move[];
  stepsCompleted: string[];
}

export function solve(cube: Cube): SolveResult {
  const solution: Move[] = [];
  const stepsCompleted: string[] = [];

  const crossResult = solveWhiteCrossBFS(cube);
  if (!crossResult.success) {
    return { success: false, solution, stepsCompleted };
  }
  solution.push(...crossResult.solution);
  stepsCompleted.push('white-cross');

  const cornersResult = solveWhiteCorners(cube);
  if (!cornersResult.success) {
    return { success: false, solution, stepsCompleted };
  }
  solution.push(...cornersResult.solution);
  stepsCompleted.push('white-corners');

  return { success: true, solution, stepsCompleted };
}