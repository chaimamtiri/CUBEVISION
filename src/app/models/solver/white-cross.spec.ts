import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { isWhiteCrossSolved, solveWhiteGreenEdgeCase1 , ejectMiddleLayerEdgeFR , flipTopLayerEdgeUR } from './white-cross';

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



describe('ejectMiddleLayerEdgeFR', () => {
  it('extrait une arête blanc-vert de la couche du milieu vers la couche du haut', () => {
    const cube = new Cube();
    cube.F.color[5] = 'GREEN';
    cube.R.color[3] = 'WHITE';

    const solution: Move[] = [];
    const handled = ejectMiddleLayerEdgeFR(cube, solution);

    expect(handled).toBe(true);
    expect(solution).toEqual(['R']);
    // L'arête doit maintenant être sur U-R, blanc sur le côté
    expect(cube.U.color[5]).toBe('GREEN');
    expect(cube.R.color[1]).toBe('WHITE');
  });
});

describe('EXPLORATION - retourner une arête U-R mal orientée', () => {
  it('teste F\' U\' F sur une arête blanc-vert avec blanc sur le côté (U5=green, R1=white)', () => {
    const cube = new Cube();
    cube.U.color[5] = 'GREEN';
    cube.R.color[1] = 'WHITE';

    cube.moveFPrime();
    cube.moveUPrime();
    cube.moveF();

    console.log('U[7]:', cube.U.color[7]); // on espère 'white' (la nouvelle position finale U-F)
    console.log('F[1]:', cube.F.color[1]); // on espère 'green'
  });
});
 

describe('flipTopLayerEdgeUR', () => {
  it('retourne une arête U-R mal orientée et la place entre U et F', () => {
    const cube = new Cube();
    cube.U.color[5] = 'GREEN';
    cube.R.color[1] = 'WHITE';

    const solution: Move[] = [];
    const handled = flipTopLayerEdgeUR(cube, solution);

    expect(handled).toBe(true);
    expect(solution).toEqual(["F'", "U'", 'F']);
    expect(cube.U.color[7]).toBe('WHITE');
    expect(cube.F.color[1]).toBe('GREEN');
  });
});