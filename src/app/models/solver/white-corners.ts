import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { isWhiteCrossSolved } from './white-cross';
import { CORNERS, CornerConfig, isCornerSolved } from './corner-config';
import { restrictedSearch, SearchResult } from './restricted-search';

function movesFor(key: 'U' | 'D' | 'F' | 'R' | 'B' | 'L'): Move[] {
  return [key, `${key}'` as Move, `${key}2` as Move];
}

export function solveOneCorner(
  cube: Cube,
  corner: CornerConfig,
  alreadySolved: CornerConfig[],
): SearchResult {
  // Autorise U/D + toutes les faces latérales touchées par des coins PAS ENCORE résolus
  // (y compris ce corner lui-même), jamais celles des coins déjà résolus — évite de les casser,
  // mais laisse assez de marge de manœuvre pour vraiment atteindre le coin visé.
  const solvedKeys = new Set(alreadySolved.map(c => c.key));
  const remaining = CORNERS.filter(c => !solvedKeys.has(c.key));

  const sideFaces = new Set<string>();
  for (const c of remaining) {
    sideFaces.add(c.sideA);
    sideFaces.add(c.sideB);
  }

  const allowedMoves: Move[] = [
    ...movesFor('U'),
    ...movesFor('D'),
    ...Array.from(sideFaces).flatMap(f => movesFor(f as any)),
  ];

  const isGoal = (c: Cube) =>
    isWhiteCrossSolved(c) &&
    isCornerSolved(c, corner) &&
    alreadySolved.every(prev => isCornerSolved(c, prev));

  return restrictedSearch(cube, isGoal, allowedMoves, 8);
}

export function solveWhiteCorners(cube: Cube): SearchResult {
  const solution: Move[] = [];
  const solved: CornerConfig[] = [];

  for (const corner of CORNERS) {
    const result = solveOneCorner(cube, corner, solved);
    if (!result.success) {
      return { success: false, solution };
    }
    solution.push(...result.solution);
    solved.push(corner);
  }

  return { success: true, solution };
}