import { Color } from '../color';
import { Cube } from '../cube.model';
import { SideKey } from './side-config';

export interface CornerConfig {
  key: string;
  uIndex: number;
  sideA: SideKey; sideAIndex: number;
  sideB: SideKey; sideBIndex: number;
}

export const CORNERS: CornerConfig[] = [
  { key: 'FR', uIndex: 8, sideA: 'F', sideAIndex: 2, sideB: 'R', sideBIndex: 0 },
  { key: 'RB', uIndex: 2, sideA: 'R', sideAIndex: 2, sideB: 'B', sideBIndex: 0 },
  { key: 'BL', uIndex: 0, sideA: 'B', sideAIndex: 2, sideB: 'L', sideBIndex: 0 },
  { key: 'LF', uIndex: 6, sideA: 'L', sideAIndex: 2, sideB: 'F', sideBIndex: 0 },
];

const COLOR_OF: Record<SideKey, Color> = { F: 'GREEN', R: 'RED', B: 'BLUE', L: 'ORANGE' };

export function isCornerSolved(cube: Cube, corner: CornerConfig): boolean {
  return (
    cube.U.color[corner.uIndex] === 'WHITE' &&
    cube[corner.sideA].color[corner.sideAIndex] === COLOR_OF[corner.sideA] &&
    cube[corner.sideB].color[corner.sideBIndex] === COLOR_OF[corner.sideB]
  );
}