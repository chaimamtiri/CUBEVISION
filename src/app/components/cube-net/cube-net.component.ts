import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cube } from '../../models/cube.model';
import { Color } from '../../models/color';
import { validateCube, ValidationResult } from '../../models/cube-validator';

const COLOR_CYCLE: Color[] = ['WHITE', 'YELLOW', 'RED', 'ORANGE', 'BLUE', 'GREEN'];

const COLOR_HEX: Record<Color, string> = {
  WHITE: '#ffffff',
  YELLOW: '#ffd500',
  RED: '#e02020',
  ORANGE: '#ff7a00',
  BLUE: '#1565c0',
  GREEN: '#2e7d32',
};

type FaceKey = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

@Component({
  selector: 'app-cube-net',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cube-net.component.html',
  styleUrl: '../cube-net.component.scss',
})
export class CubeNetComponent {
  @Input({ required: true }) cube!: Cube;

  readonly faceKeys: FaceKey[] = ['U', 'D', 'L', 'R', 'F', 'B'];
  validationResult: ValidationResult | null = null;

  colorHex(color: Color): string {
    return COLOR_HEX[color];
  }

  onCellClick(face: FaceKey, index: number): void {
    const current = this.cube[face].color[index];
    const nextIndex = (COLOR_CYCLE.indexOf(current) + 1) % COLOR_CYCLE.length;
    this.cube[face].color[index] = COLOR_CYCLE[nextIndex];
    this.validationResult = null; // on efface le résultat précédent dès qu'on retouche le cube
  }

  onValidate(): void {
    this.validationResult = validateCube(this.cube);
  }
}