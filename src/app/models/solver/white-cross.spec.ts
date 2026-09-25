import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { SIDES } from './side-config';
import {
  isWhiteCrossSolved,
  solveEdgeOnBottom,
  solveEdgeInMiddleLayer,
  solveEdgeMisorientedAdjacent,
} from './white-cross';

describe('isWhiteCrossSolved (générique)', () => {
  it('cube neuf → résolu', () => {
    expect(isWhiteCrossSolved(new Cube())).toBe(true);
  });
});

describe('solveEdgeOnBottom (générique)', () => {
  it('fonctionne pour F', () => {
    const cube = new Cube();
    cube.D.color[1] = 'WHITE';
    cube.F.color[7] = 'GREEN';
    const solution: Move[] = [];
    expect(solveEdgeOnBottom(cube, SIDES.F, solution)).toBe(true);
    expect(solution).toEqual(['F2']);
  });

  it('fonctionne pour R (même fonction, juste une autre config)', () => {
    const cube = new Cube();
    cube.D.color[5] = 'WHITE';
    cube.R.color[7] = 'RED';
    const solution: Move[] = [];
    expect(solveEdgeOnBottom(cube, SIDES.R, solution)).toBe(true);
    expect(solution).toEqual(['R2']);
  });
});

describe('solveEdgeInMiddleLayer (générique)', () => {
  it('fonctionne pour F → R', () => {
    const cube = new Cube();
    cube.F.color[5] = 'GREEN';
    cube.R.color[3] = 'WHITE';
    const solution: Move[] = [];
    expect(solveEdgeInMiddleLayer(cube, SIDES.F, solution)).toBe(true);
    expect(solution).toEqual(['R']);
  });

  it('fonctionne pour R → B (même fonction)', () => {
    const cube = new Cube();
    cube.R.color[5] = 'RED';
    cube.B.color[3] = 'WHITE';
    const solution: Move[] = [];
    expect(solveEdgeInMiddleLayer(cube, SIDES.R, solution)).toBe(true);
    expect(solution).toEqual(['B']);
  });
});

describe('solveEdgeMisorientedAdjacent (générique)', () => {
  it('fonctionne pour F (arête à U-R)', () => {
    const cube = new Cube();
    cube.U.color[5] = 'GREEN';
    cube.R.color[1] = 'WHITE';
    const solution: Move[] = [];
    expect(solveEdgeMisorientedAdjacent(cube, SIDES.F, solution)).toBe(true);
    expect(solution).toEqual(["F'", "U'", 'F']);
    expect(cube.U.color[7]).toBe('WHITE');
    expect(cube.F.color[1]).toBe('GREEN');
  });
});