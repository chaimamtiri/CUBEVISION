import { Cube } from '../cube.model';
import { SIDES, SideConfig, faceOf } from './side-config';

export function isEdgeSolved(cube: Cube, side: SideConfig): boolean {
  return (
    cube.U.color[side.touchU] === 'WHITE' &&
    faceOf(cube, side.key).color[1] === side.color
  );
}

export function isWhiteCrossSolved(cube: Cube): boolean {
  return (Object.values(SIDES) as SideConfig[]).every(side => isEdgeSolved(cube, side));
}