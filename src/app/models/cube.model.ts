import { Color } from './color';
import { Face, createSolvedFace } from './face.model';
import { rotateFaceClockwise } from './rotate-face';

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

  // ===== R =====

  moveR(): void {
    this.R.color = rotateFaceClockwise(this.R.color);

    const uCol = [this.U.color[2], this.U.color[5], this.U.color[8]];
    const fCol = [this.F.color[2], this.F.color[5], this.F.color[8]];
    const dCol = [this.D.color[2], this.D.color[5], this.D.color[8]];
    const bCol = [this.B.color[0], this.B.color[3], this.B.color[6]];

    this.U.color[2] = fCol[0]; this.U.color[5] = fCol[1]; this.U.color[8] = fCol[2];
    this.F.color[2] = dCol[0]; this.F.color[5] = dCol[1]; this.F.color[8] = dCol[2];
    this.D.color[2] = bCol[2]; this.D.color[5] = bCol[1]; this.D.color[8] = bCol[0];
    this.B.color[0] = uCol[2]; this.B.color[3] = uCol[1]; this.B.color[6] = uCol[0];
  }

  moveRPrime(): void {
    this.moveR();
    this.moveR();
    this.moveR();
  }

  moveR2(): void {
    this.moveR();
    this.moveR();
  }

  // ===== U =====

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
    this.moveU();
    this.moveU();
    this.moveU();
  }

  moveU2(): void {
    this.moveU();
    this.moveU();
  }

  // ===== L =====

  moveL(): void {
    this.L.color = rotateFaceClockwise(this.L.color);

    const uCol = [this.U.color[0], this.U.color[3], this.U.color[6]];
    const fCol = [this.F.color[0], this.F.color[3], this.F.color[6]];
    const dCol = [this.D.color[0], this.D.color[3], this.D.color[6]];
    const bCol = [this.B.color[2], this.B.color[5], this.B.color[8]];

    this.B.color[2] = uCol[2]; this.B.color[5] = uCol[1]; this.B.color[8] = uCol[0];
    this.D.color[0] = bCol[2]; this.D.color[3] = bCol[1]; this.D.color[6] = bCol[0];
    this.F.color[0] = dCol[0]; this.F.color[3] = dCol[1]; this.F.color[6] = dCol[2];
    this.U.color[0] = fCol[0]; this.U.color[3] = fCol[1]; this.U.color[6] = fCol[2];
  }

  moveLPrime(): void {
    this.moveL();
    this.moveL();
    this.moveL();
  }

  moveL2(): void {
    this.moveL();
    this.moveL();
  }

  // ===== F =====

  moveF(): void {
    this.F.color = rotateFaceClockwise(this.F.color);

    const uRow = [this.U.color[6], this.U.color[7], this.U.color[8]];
    const rCol = [this.R.color[0], this.R.color[3], this.R.color[6]];
    const dRow = [this.D.color[0], this.D.color[1], this.D.color[2]];
    const lCol = [this.L.color[2], this.L.color[5], this.L.color[8]];

    this.R.color[0] = uRow[0]; this.R.color[3] = uRow[1]; this.R.color[6] = uRow[2];
    this.D.color[0] = rCol[2]; this.D.color[1] = rCol[1]; this.D.color[2] = rCol[0];
    this.L.color[2] = dRow[0]; this.L.color[5] = dRow[1]; this.L.color[8] = dRow[2];
    this.U.color[6] = lCol[2]; this.U.color[7] = lCol[1]; this.U.color[8] = lCol[0];
  }

  moveFPrime(): void {
    this.moveF();
    this.moveF();
    this.moveF();
  }

  moveF2(): void {
    this.moveF();
    this.moveF();
  }

  // ===== D =====

  moveD(): void {
    this.D.color = rotateFaceClockwise(this.D.color);

    const fRow = [this.F.color[6], this.F.color[7], this.F.color[8]];
    const rRow = [this.R.color[6], this.R.color[7], this.R.color[8]];
    const bRow = [this.B.color[6], this.B.color[7], this.B.color[8]];
    const lRow = [this.L.color[6], this.L.color[7], this.L.color[8]];

    this.L.color[6] = fRow[0]; this.L.color[7] = fRow[1]; this.L.color[8] = fRow[2];
    this.B.color[6] = lRow[0]; this.B.color[7] = lRow[1]; this.B.color[8] = lRow[2];
    this.R.color[6] = bRow[0]; this.R.color[7] = bRow[1]; this.R.color[8] = bRow[2];
    this.F.color[6] = rRow[0]; this.F.color[7] = rRow[1]; this.F.color[8] = rRow[2];
  }

  moveDPrime(): void {
    this.moveD();
    this.moveD();
    this.moveD();
  }

  moveD2(): void {
    this.moveD();
    this.moveD();
  }

  // ===== B =====

  moveB(): void {
    this.B.color = rotateFaceClockwise(this.B.color);

    const uRow = [this.U.color[0], this.U.color[1], this.U.color[2]];
    const lCol = [this.L.color[0], this.L.color[3], this.L.color[6]];
    const dRow = [this.D.color[6], this.D.color[7], this.D.color[8]];
    const rCol = [this.R.color[2], this.R.color[5], this.R.color[8]];

    this.L.color[0] = uRow[2]; this.L.color[3] = uRow[1]; this.L.color[6] = uRow[0];
    this.D.color[6] = lCol[2]; this.D.color[7] = lCol[1]; this.D.color[8] = lCol[0];
    this.R.color[2] = dRow[0]; this.R.color[5] = dRow[1]; this.R.color[8] = dRow[2];
    this.U.color[0] = rCol[2]; this.U.color[1] = rCol[1]; this.U.color[2] = rCol[0];
  }

  moveBPrime(): void {
    this.moveB();
    this.moveB();
    this.moveB();
  }

  moveB2(): void {
    this.moveB();
    this.moveB();
  }
}