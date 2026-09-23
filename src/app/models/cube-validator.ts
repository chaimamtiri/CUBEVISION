import { Cube } from './cube.model';
import { Color } from './color';

export interface ValidationResult {
  valid: boolean;
  message: string;
}

const EXPECTED_COUNT_PER_COLOR = 9;

export function validateCube(cube: Cube): ValidationResult {
  const counts: Record<Color, number> = {
    WHITE: 0,
    YELLOW: 0,
    RED: 0,
    ORANGE: 0,
    BLUE: 0,
    GREEN: 0,
  };

  const faces = [cube.U, cube.D, cube.L, cube.R, cube.F, cube.B];
  for (const face of faces) {
    for (const color of face.color) {
      counts[color]++;
    }
  }

  const invalidColors = (Object.keys(counts) as Color[]).filter(
    color => counts[color] !== EXPECTED_COUNT_PER_COLOR
  );

  if (invalidColors.length === 0) {
    return { valid: true, message: 'Cube valide' };
  }

  const details = invalidColors
    .map(color => `${color}: ${counts[color]}/${EXPECTED_COUNT_PER_COLOR}`)
    .join(', ');

  return { valid: false, message: `Cube invalide (${details})` };
}