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

  moveR(): void {
    // 1. La face R tourne sur elle-même
    this.R.color = rotateFaceClockwise(this.R.color);

    // 2. Les colonnes adjacentes tournent : U → B → D → F → U
    const uCol = [this.U.color[2], this.U.color[5], this.U.color[8]];
    const fCol = [this.F.color[2], this.F.color[5], this.F.color[8]];
    const dCol = [this.D.color[2], this.D.color[5], this.D.color[8]];
    const bCol = [this.B.color[0], this.B.color[3], this.B.color[6]];

    // U prend l'ancienne colonne de F
    this.U.color[2] = fCol[0];
    this.U.color[5] = fCol[1];
    this.U.color[8] = fCol[2];

    // F prend l'ancienne colonne de D
    this.F.color[2] = dCol[0];
    this.F.color[5] = dCol[1];
    this.F.color[8] = dCol[2];

    // D prend l'ancienne colonne de B (inversée, car B est vue "de dos")
    this.D.color[2] = bCol[2];
    this.D.color[5] = bCol[1];
    this.D.color[8] = bCol[0];

    // B prend l'ancienne colonne de U (inversée)
    this.B.color[0] = uCol[2];
    this.B.color[3] = uCol[1];
    this.B.color[6] = uCol[0];
  }
}