
import { Move } from './move.util';

const MOVES: Move[] = [
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2'
];

export function generateScramble(length: number = 20): Move[] {
  const scramble: Move[] = [];

  for (let i = 0; i < length; i++) {
    let move: Move;

    do {
      const randomIndex = Math.floor(Math.random() * MOVES.length);
      move = MOVES[randomIndex];
    } while (
      scramble.length > 0 &&
      move[0] === scramble[scramble.length - 1][0]
    );

    scramble.push(move);
  }

  return scramble;
}
