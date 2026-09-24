import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { isWhiteCrossSolved, solveWhiteGreenEdgeCase1 } from './white-cross';

describe('solveWhiteGreenEdgeCase1', () => {
  it('place correctement une arête blanc-vert située sur D, touchant F', () => {
    const cube = new Cube();
    // On simule ce cas précis à la main, sans passer par un vrai scramble pour l'instant
    cube.D.color[1] = 'WHITE';
    cube.F.color[7] = 'GREEN';
    // (on ignore volontairement le reste du cube pour ce premier test isolé)

    const solution: Move[] = [];
    const handled = solveWhiteGreenEdgeCase1(cube, solution);

    expect(handled).toBe(true);
    expect(solution).toEqual(['F2']);
    expect(cube.U.color[7]).toBe('WHITE');
    expect(cube.F.color[1]).toBe('GREEN');
  });
});