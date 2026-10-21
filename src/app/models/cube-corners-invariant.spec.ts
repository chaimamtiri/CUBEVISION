import { describe, expect, it } from 'vitest';
import { Cube } from './cube.model';

type FaceKey = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
type Sticker = readonly [FaceKey, number];

const CORNER_POSITIONS: Sticker[][] = [
  [['U', 8], ['F', 2], ['R', 0]],
  [['U', 2], ['R', 2], ['B', 0]],
  [['U', 0], ['B', 2], ['L', 0]],
  [['U', 6], ['L', 2], ['F', 0]],

  [['D', 2], ['F', 8], ['R', 6]],
  [['D', 8], ['R', 8], ['B', 6]],
  [['D', 6], ['B', 8], ['L', 6]],
  [['D', 0], ['L', 8], ['F', 6]]
];

function cornerSignature(
  cube: Cube,
  position: Sticker[]
): string {
  return position
    .map(([face, index]) => cube[face].color[index])
    .sort()
    .join('-');
}

function getCornerSignatures(cube: Cube): string[] {
  return CORNER_POSITIONS
    .map(position => cornerSignature(cube, position))
    .sort();
}

const MOVEMENTS: Array<[string, (cube: Cube) => void]> = [
  ['R', c => c.moveR()],
  ["R'", c => c.moveRPrime()],
  ['R2', c => c.moveR2()],
  ['L', c => c.moveL()],
  ["L'", c => c.moveLPrime()],
  ['L2', c => c.moveL2()],
  ['U', c => c.moveU()],
  ["U'", c => c.moveUPrime()],
  ['U2', c => c.moveU2()],
  ['D', c => c.moveD()],
  ["D'", c => c.moveDPrime()],
  ['D2', c => c.moveD2()],
  ['F', c => c.moveF()],
  ["F'", c => c.moveFPrime()],
  ['F2', c => c.moveF2()],
  ['B', c => c.moveB()],
  ["B'", c => c.moveBPrime()],
  ['B2', c => c.moveB2()]
];

describe('Cube - invariants physiques des coins', () => {
  const expected = getCornerSignatures(new Cube());

  for (const [name, applyMove] of MOVEMENTS) {
    it(`preserve les huit coins apres ${name}`, () => {
      const cube = new Cube();

      applyMove(cube);

      expect(getCornerSignatures(cube)).toEqual(expected);
    });
  }

  it('preserve les huit coins apres une sequence mixte', () => {
    const cube = new Cube();

    for (const [, applyMove] of MOVEMENTS) {
      applyMove(cube);
    }

    expect(getCornerSignatures(cube)).toEqual(expected);
  });
});