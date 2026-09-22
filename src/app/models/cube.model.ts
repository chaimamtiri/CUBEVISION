import { Color } from './color';
import { Face, createSolvedFace } from './face.model';

export class Cube {
  U: Face; // Up    - blanc
  D: Face; // Down  - jaune
  L: Face; // Left  - orange
  R: Face; // Right - rouge
  F: Face; // Front - vert
  B: Face; // Back  - bleu

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
}