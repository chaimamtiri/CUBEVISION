import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { SIDES } from './side-config';
import {
  isWhiteCrossSolved,
  solveEdgeOnBottom,
  solveEdgeInMiddleLayer,
  solveEdgeMisorientedAdjacent,
  solveWhiteCross,
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

describe('solveWhiteCross (bout à bout)', () => {
  it('résout une croix déjà résolue immédiatement (0 mouvement)', () => {
    const cube = new Cube();
    const result = solveWhiteCross(cube);
    expect(result.success).toBe(true);
    expect(result.solution).toEqual([]);
  });

  it('résout un cas simple couvert (arête F sur D)', () => {
    const cube = new Cube();
    cube.D.color[1] = 'WHITE';
    cube.F.color[7] = 'GREEN';
    const result = solveWhiteCross(cube);
    expect(result.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);
  });
});

describe('Cube - labeled round-trip incluant D et B (jamais testés ensemble jusqu\'ici)', () => {
  function labelCube(): Cube {
    const cube = new Cube();
    const label = (face: string) => Array.from({ length: 9 }, (_, i) => `${face}${i}`) as any;
    cube.U.color = label('U');
    cube.D.color = label('D');
    cube.L.color = label('L');
    cube.R.color = label('R');
    cube.F.color = label('F');
    cube.B.color = label('B');
    return cube;
  }

  it('le scramble exact du solveur (R U F\' L2 D B) suivi de son inverse exact revient à l\'état initial', () => {
    const cube = labelCube();
    const initial = cube.clone();

    cube.moveR(); cube.moveU(); cube.moveFPrime(); cube.moveL2(); cube.moveD(); cube.moveB();
    cube.moveBPrime(); cube.moveDPrime(); cube.moveL2(); cube.moveF(); cube.moveUPrime(); cube.moveRPrime();

    expect(cube.U.color).toEqual(initial.U.color);
    expect(cube.D.color).toEqual(initial.D.color);
    expect(cube.L.color).toEqual(initial.L.color);
    expect(cube.R.color).toEqual(initial.R.color);
    expect(cube.F.color).toEqual(initial.F.color);
    expect(cube.B.color).toEqual(initial.B.color);
  });
});