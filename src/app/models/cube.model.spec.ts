import { Cube } from './cube.model';

describe('Cube - moveR', () => {
  it('should be solved on creation', () => {
    const cube = new Cube();
    expect(cube.isSolved()).toBe(true);
  });

  it('R once should unsolve the cube', () => {
    const cube = new Cube();
    cube.moveR();
    expect(cube.isSolved()).toBe(false);
  });

  it('R R R R should return to the initial state', () => {
    const cube = new Cube();
    const initial = cube.clone();

    cube.moveR();
    cube.moveR();
    cube.moveR();
    cube.moveR();

    expect(cube.U.color).toEqual(initial.U.color);
    expect(cube.D.color).toEqual(initial.D.color);
    expect(cube.L.color).toEqual(initial.L.color);
    expect(cube.R.color).toEqual(initial.R.color);
    expect(cube.F.color).toEqual(initial.F.color);
    expect(cube.B.color).toEqual(initial.B.color);
    expect(cube.isSolved()).toBe(true);
  });
});