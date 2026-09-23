import { Color } from './color';

export function rotateFaceClockwise(colors: Color[]): Color[] {
  const [a, b, c, d, e, f, g, h, i] = colors;
  return [g, d, a, h, e, b, i, f, c];
}

export function rotateFaceCounterClockwise(colors: Color[]): Color[] {
  // Tourner 3 fois dans le sens horaire = tourner 1 fois dans le sens anti-horaire
  return rotateFaceClockwise(rotateFaceClockwise(rotateFaceClockwise(colors)));
}