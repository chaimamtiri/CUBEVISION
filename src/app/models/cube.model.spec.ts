import { Cube } from './cube.model';

describe('Cube - basic', () => {
  it('cube neuf → isSolved() = true', () => {
    const cube = new Cube();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - R', () => {
  it('R → isSolved() = false', () => {
    const cube = new Cube();
    cube.moveR();
    expect(cube.isSolved()).toBe(false);
  });

  it('R R R R → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveR(); cube.moveR(); cube.moveR(); cube.moveR();
    expect(cube.isSolved()).toBe(true);
  });

  it("R R' → isSolved() = true", () => {
    const cube = new Cube();
    cube.moveR();
    cube.moveRPrime();
    expect(cube.isSolved()).toBe(true);
  });

  it('R2 R2 → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveR2();
    cube.moveR2();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - U', () => {
  it('U U U U → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveU(); cube.moveU(); cube.moveU(); cube.moveU();
    expect(cube.isSolved()).toBe(true);
  });

  it("U U' → isSolved() = true", () => {
    const cube = new Cube();
    cube.moveU();
    cube.moveUPrime();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - L', () => {
  it('L L L L → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveL(); cube.moveL(); cube.moveL(); cube.moveL();
    expect(cube.isSolved()).toBe(true);
  });

  it("L L' → isSolved() = true", () => {
    const cube = new Cube();
    cube.moveL();
    cube.moveLPrime();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - F', () => {
  it('F F F F → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveF(); cube.moveF(); cube.moveF(); cube.moveF();
    expect(cube.isSolved()).toBe(true);
  });

  it("F F' → isSolved() = true", () => {
    const cube = new Cube();
    cube.moveF();
    cube.moveFPrime();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - D', () => {
  it('D D D D → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveD(); cube.moveD(); cube.moveD(); cube.moveD();
    expect(cube.isSolved()).toBe(true);
  });

  it("D D' → isSolved() = true", () => {
    const cube = new Cube();
    cube.moveD();
    cube.moveDPrime();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - B', () => {
  it('B B B B → isSolved() = true', () => {
    const cube = new Cube();
    cube.moveB(); cube.moveB(); cube.moveB(); cube.moveB();
    expect(cube.isSolved()).toBe(true);
  });

  it("B B' → isSolved() = true", () => {
    const cube = new Cube();
    cube.moveB();
    cube.moveBPrime();
    expect(cube.isSolved()).toBe(true);
  });
});

describe('Cube - non-trivial scramble/unscramble (labeled, catches ordering bugs)', () => {
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

  it('a scramble followed by its exact reverse returns every sticker to its original position', () => {
    const cube = labelCube();
    const initial = cube.clone();

    cube.moveR(); cube.moveU(); cube.moveFPrime(); cube.moveL2();
    cube.moveL2(); cube.moveF(); cube.moveUPrime(); cube.moveRPrime();

    expect(cube.U.color).toEqual(initial.U.color);
    expect(cube.D.color).toEqual(initial.D.color);
    expect(cube.L.color).toEqual(initial.L.color);
    expect(cube.R.color).toEqual(initial.R.color);
    expect(cube.F.color).toEqual(initial.F.color);
    expect(cube.B.color).toEqual(initial.B.color);
  });
});