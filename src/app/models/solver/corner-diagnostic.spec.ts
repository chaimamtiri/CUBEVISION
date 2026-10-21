import { describe, expect, it } from 'vitest';

import { Cube } from '../cube.model';
import { CORNERS, isCornerSolved } from './corner-config';
import { isWhiteCrossSolved } from './white-cross';

describe('Diagnostic des coins blancs', () => {

  it('inspecte les coins apres un scramble difficile', () => {

    const cube = new Cube();

    cube.moveD();
    cube.moveL();
    cube.moveR2();
    cube.moveR2();
    cube.moveL2();
    cube.moveBPrime();
    cube.moveR();
    cube.moveBPrime();

    const solvedCorners = CORNERS
      .filter(corner => isCornerSolved(cube, corner))
      .map(corner => corner.key);

    const unsolvedCorners = CORNERS
      .filter(corner => !isCornerSolved(cube, corner))
      .map(corner => corner.key);

    console.log('Coins resolus :', solvedCorners);
    console.log('Coins non resolus :', unsolvedCorners);
    console.log(
      'Croix blanche resolue :',
      isWhiteCrossSolved(cube)
    );

    expect(solvedCorners.length + unsolvedCorners.length).toBe(4);
    expect(unsolvedCorners.length).toBeGreaterThan(0);
  });

});