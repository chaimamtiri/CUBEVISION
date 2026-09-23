import { Color } from './color';

export function rotateFaceClockwise(colors: Color[]): Color[] {
  const [a, b, c, d, e, f, g, h, i] = colors;
  return [g, d, a, h, e, b, i, f, c];
}