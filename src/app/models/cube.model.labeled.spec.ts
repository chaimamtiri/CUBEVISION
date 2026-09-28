import { Cube } from './cube.model';

function labelCube(): Cube {
  const cube = new Cube();
  const label = (face: string) =>
    Array.from({ length: 9 }, (_, i) => `${face}${i}`) as any;
  cube.U.color = label('U');
  cube.D.color = label('D');
  cube.L.color = label('L');
  cube.R.color = label('R');
  cube.F.color = label('F');
  cube.B.color = label('B');
  return cube;
}

function expectSameState(actual: Cube, expected: Cube): void {
  expect(actual.U.color).toEqual(expected.U.color);
  expect(actual.D.color).toEqual(expected.D.color);
  expect(actual.L.color).toEqual(expected.L.color);
  expect(actual.R.color).toEqual(expected.R.color);
  expect(actual.F.color).toEqual(expected.F.color);
  expect(actual.B.color).toEqual(expected.B.color);
}

describe('Cube - round-trips à étiquettes uniques', () => {
  it("R U F' L2 D B suivi de son inverse exact revient à l'état initial", () => {
    const cube = labelCube();
    const initial = cube.clone();

    cube.moveR(); cube.moveU(); cube.moveFPrime(); cube.moveL2(); cube.moveD(); cube.moveB();
    cube.moveBPrime(); cube.moveDPrime(); cube.moveL2(); cube.moveF(); cube.moveUPrime(); cube.moveRPrime();

    expectSameState(cube, initial);
  });

  it("R U L F D B (quarts de tour simples) suivi de leur inverse revient à l'identique", () => {
    const cube = labelCube();
    const initial = cube.clone();

    cube.moveR(); cube.moveU(); cube.moveL(); cube.moveF(); cube.moveD(); cube.moveB();
    cube.moveBPrime(); cube.moveDPrime(); cube.moveFPrime(); cube.moveLPrime(); cube.moveUPrime(); cube.moveRPrime();

    expectSameState(cube, initial);
  });
});