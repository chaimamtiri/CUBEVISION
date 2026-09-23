import { Cube } from './cube.model';
import { validateCube } from './cube-validator';

describe('validateCube', () => {
  it('cube neuf (résolu) → valide', () => {
    const cube = new Cube();
    const result = validateCube(cube);
    expect(result.valid).toBe(true);
  });

  it('cube mélangé par des mouvements valides → toujours valide', () => {
    const cube = new Cube();
    cube.moveR();
    cube.moveU();
    cube.moveRPrime();
    const result = validateCube(cube);
    expect(result.valid).toBe(true);
  });

  it('cube avec un mauvais compte de couleurs → invalide', () => {
    const cube = new Cube();
    // On casse volontairement le comptage : un sticker blanc devient rouge
    cube.U.color[0] = 'RED';
    const result = validateCube(cube);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('invalide');
  });
});