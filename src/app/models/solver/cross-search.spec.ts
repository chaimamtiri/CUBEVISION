import { Cube } from '../cube.model';
import { isWhiteCrossSolved } from './white-cross';
import { solveWhiteCrossBFS } from './cross-search';

describe('solveWhiteCrossBFS', () => {
  it('cube déjà résolu → 0 mouvement', () => {
    const cube = new Cube();
    const result = solveWhiteCrossBFS(cube);
    expect(result.success).toBe(true);
    expect(result.solution).toEqual([]);
  });

  it('résout le scramble qui bloquait toutes nos tentatives manuelles', () => {
    const cube = new Cube();
    cube.moveR();
    cube.moveU();
    cube.moveFPrime();
    cube.moveL2();
    cube.moveD();
    cube.moveB();

    const result = solveWhiteCrossBFS(cube);
    expect(result.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);
  }, 30000);

  it('résout un scramble complètement différent', () => {
    const cube = new Cube();
    cube.moveF();
    cube.moveR2();
    cube.moveUPrime();
    cube.moveBPrime();
    cube.moveL();

    const result = solveWhiteCrossBFS(cube);
    expect(result.success).toBe(true);
    expect(isWhiteCrossSolved(cube)).toBe(true);
  }, 30000);
});