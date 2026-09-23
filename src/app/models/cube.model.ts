import { Color } from './color';
import { Face, createSolvedFace } from './face.model';
import { rotateFaceClockwise, rotateFaceCounterClockwise } from './rotate-face';

export class Cube {
  U: Face;
  D: Face;
  L: Face;
  R: Face;
  F: Face;
  B: Face;

  constructor() {
    this.U = createSolvedFace('WHITE');
    this.D = createSolvedFace('YELLOW');
    this.L = createSolvedFace('ORANGE');
    this.R = createSolvedFace('RED');
    this.F = createSolvedFace('GREEN');
    this.B = createSolvedFace('BLUE');
  }

  isSolved(): boolean {
    const faces = [this.U, this.D, this.L, this.R, this.F, this.B];
    return faces.every(face => face.color.every(c => c === face.color[0]));
  }

  clone(): Cube {
    const copy = new Cube();
    (['U', 'D', 'L', 'R', 'F', 'B'] as const).forEach(key => {
      copy[key] = { color: [...this[key].color] };
    });
    return copy;
  }

  moveR(): void {
    this.R.color = rotateFaceClockwise(this.R.color);

    const uCol = [this.U.color[2], this.U.color[5], this.U.color[8]];
    const fCol = [this.F.color[2], this.F.color[5], this.F.color[8]];
    const dCol = [this.D.color[2], this.D.color[5], this.D.color[8]];
    const bCol = [this.B.color[0], this.B.color[3], this.B.color[6]];

    this.U.color[2] = fCol[0];
    this.U.color[5] = fCol[1];
    this.U.color[8] = fCol[2];

    this.F.color[2] = dCol[0];
    this.F.color[5] = dCol[1];
    this.F.color[8] = dCol[2];

    this.D.color[2] = bCol[2];
    this.D.color[5] = bCol[1];
    this.D.color[8] = bCol[0];

    this.B.color[0] = uCol[2];
    this.B.color[3] = uCol[1];
    this.B.color[6] = uCol[0];
  }

  moveRPrime(): void {
    this.R.color = rotateFaceCounterClockwise(this.R.color);

    const uCol = [this.U.color[2], this.U.color[5], this.U.color[8]];
    const fCol = [this.F.color[2], this.F.color[5], this.F.color[8]];
    const dCol = [this.D.color[2], this.D.color[5], this.D.color[8]];
    const bCol = [this.B.color[0], this.B.color[3], this.B.color[6]];

    this.U.color[2] = bCol[2];
    this.U.color[5] = bCol[1];
    this.U.color[8] = bCol[0];

    this.F.color[2] = uCol[0];
    this.F.color[5] = uCol[1];
    this.F.color[8] = uCol[2];

    this.D.color[2] = fCol[0];
    this.D.color[5] = fCol[1];
    this.D.color[8] = fCol[2];

    this.B.color[0] = dCol[2];
    this.B.color[3] = dCol[1];
    this.B.color[6] = dCol[0];
  }

  moveU(): void {
    this.U.color = rotateFaceClockwise(this.U.color);

    const fRow = [this.F.color[0], this.F.color[1], this.F.color[2]];
    const rRow = [this.R.color[0], this.R.color[1], this.R.color[2]];
    const bRow = [this.B.color[0], this.B.color[1], this.B.color[2]];
    const lRow = [this.L.color[0], this.L.color[1], this.L.color[2]];

    this.R.color[0] = fRow[0]; this.R.color[1] = fRow[1]; this.R.color[2] = fRow[2];
    this.B.color[0] = rRow[0]; this.B.color[1] = rRow[1]; this.B.color[2] = rRow[2];
    this.L.color[0] = bRow[0]; this.L.color[1] = bRow[1]; this.L.color[2] = bRow[2];
    this.F.color[0] = lRow[0]; this.F.color[1] = lRow[1]; this.F.color[2] = lRow[2];
  }

  moveUPrime(): void {
    this.U.color = rotateFaceCounterClockwise(this.U.color);

    const fRow = [this.F.color[0], this.F.color[1], this.F.color[2]];
    const rRow = [this.R.color[0], this.R.color[1], this.R.color[2]];
    const bRow = [this.B.color[0], this.B.color[1], this.B.color[2]];
    const lRow = [this.L.color[0], this.L.color[1], this.L.color[2]];

    this.L.color[0] = fRow[0]; this.L.color[1] = fRow[1]; this.L.color[2] = fRow[2];
    this.B.color[0] = lRow[0]; this.B.color[1] = lRow[1]; this.B.color[2] = lRow[2];
    this.R.color[0] = bRow[0]; this.R.color[1] = bRow[1]; this.R.color[2] = bRow[2];
    this.F.color[0] = rRow[0]; this.F.color[1] = rRow[1]; this.F.color[2] = rRow[2];
  }
}