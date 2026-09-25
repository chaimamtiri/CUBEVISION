import { Color } from '../color';
import { Cube } from '../cube.model';
import { Move } from '../move.util';

export type SideKey = 'F' | 'R' | 'B' | 'L';

export interface SideConfig {
  key: SideKey;
  color: Color;
  next: SideKey;       // face suivante dans le cycle de moveU : F → R → B → L → F
  touchU: number;      // index sur U qui touche cette face
  touchD: number;      // index sur D qui touche cette face
  move: Move;
  movePrime: Move;
  move2: Move;
}

export const SIDES: Record<SideKey, SideConfig> = {
  F: { key: 'F', color: 'GREEN',  next: 'R', touchU: 7, touchD: 1, move: 'F', movePrime: "F'", move2: 'F2' },
  R: { key: 'R', color: 'RED',    next: 'B', touchU: 5, touchD: 5, move: 'R', movePrime: "R'", move2: 'R2' },
  B: { key: 'B', color: 'BLUE',   next: 'L', touchU: 1, touchD: 7, move: 'B', movePrime: "B'", move2: 'B2' },
  L: { key: 'L', color: 'ORANGE', next: 'F', touchU: 3, touchD: 3, move: 'L', movePrime: "L'", move2: 'L2' },
};

export function faceOf(cube: Cube, key: SideKey) {
  return cube[key];
}