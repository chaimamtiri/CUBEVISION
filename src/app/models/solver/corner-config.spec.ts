import { Cube } from '../cube.model';
import { CORNERS, isCornerSolved } from './corner-config';

describe('isCornerSolved', () => {
  it('les 4 coins sont résolus sur un cube neuf', () => {
    const cube = new Cube();
    for (const corner of CORNERS) {
      expect(isCornerSolved(cube, corner)).toBe(true);
    }
  });

  it('un seul mouvement R casse bien le coin FR et RB, mais pas BL/LF', () => {
    const cube = new Cube();
    cube.moveR();
    const solvedKeys = CORNERS.filter(c => isCornerSolved(cube, c)).map(c => c.key);
    expect(solvedKeys.sort()).toEqual(['BL', 'LF']);
  });
});