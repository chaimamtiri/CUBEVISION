import { Cube } from '../cube.model';
import { isWhiteCrossSolved } from './white-cross';
import { solveWhiteCrossBFS } from './cross-search';
import { CORNERS, isCornerSolved } from './corner-config';
import { solveWhiteCorners } from './white-corners';

describe('solveWhiteCorners', () => {
  it('cube neuf → déjà résolu', () => {
    const cube = new Cube();
    const result = solveWhiteCorners(cube);
    expect(result.success).toBe(true);
    expect(result.solution).toEqual([]);
  });

  it('résout les coins sur un scramble, sans casser la croix (croix résolue au préalable)', () => {
    const cube = new Cube();
    cube.moveR(); cube.moveU(); cube.moveFPrime(); cube.moveL2(); cube.moveD(); cube.moveB();

    const crossResult = solveWhiteCrossBFS(cube);
    expect(crossResult.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);

    const cornersResult = solveWhiteCorners(cube);
    expect(cornersResult.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);
    for (const corner of CORNERS) {
      expect(isCornerSolved(cube, corner)).toBe(true);
    }
  }, 30000);
});