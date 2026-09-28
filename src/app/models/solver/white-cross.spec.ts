import { Cube } from '../cube.model';
import { isWhiteCrossSolved } from './white-cross';

describe('isWhiteCrossSolved', () => {
  it('cube neuf → résolu', () => {
    expect(isWhiteCrossSolved(new Cube())).toBe(true);
  });

  it('cube mélangé → non résolu', () => {
    const cube = new Cube();
    cube.moveR();
    cube.moveU();
    expect(isWhiteCrossSolved(cube)).toBe(false);
  });

  it('U seul → non résolu (arêtes blanches en haut mais mal alignées avec les centres)', () => {
    const cube = new Cube();
    cube.moveU();
    expect(isWhiteCrossSolved(cube)).toBe(false);
  });
});