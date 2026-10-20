import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { undoMoves } from './move.util';

import { isWhiteCrossSolved } from './white-cross';

import {
  CORNERS,
  CornerConfig,
  isCornerSolved
} from './corner-config';

import {
  restrictedSearch,
  SearchResult
} from './restricted-search';

const ALL_MOVES: Move[] = [
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
];

function movesFor(key: string): Move[] {
  return [key, `${key}'`, `${key}2`] as Move[];
}

// Résoudre un seul coin en préservant
// la croix et les coins déjà résolus.
export function solveOneCorner(
  cube: Cube,
  corner: CornerConfig,
  alreadySolved: CornerConfig[]
): SearchResult {

  const isGoal = (c: Cube) =>
    isWhiteCrossSolved(c) &&
    isCornerSolved(c, corner) &&
    alreadySolved.every(prev =>
      isCornerSolved(c, prev)
    );

  const fastMoves: Move[] = [
    ...movesFor('U'),
    ...movesFor('D'),
    ...movesFor(corner.sideA),
    ...movesFor(corner.sideB),
  ];

  // Première recherche : mouvements limités.
  const fast = restrictedSearch(cube, isGoal, fastMoves, 9, 6_000_000);

  if (fast.success) {
    return fast;
  }

  // Deuxième recherche : tous les mouvements.
  return restrictedSearch(
    cube,
    isGoal,
    ALL_MOVES,
    8,
    6_000_000
  );
}

// Essaie de résoudre les coins dans
// l'ordre fourni en paramètre.
function trySolveInOrder(
  cube: Cube,
  order: CornerConfig[]
): SearchResult {

  const solution: Move[] = [];
  const solved: CornerConfig[] = [];

  // CORRECTION 1 : utiliser order.
  for (const corner of order) {

    console.log(
      'Tentative du coin :',
      corner.key
    );

    const result = solveOneCorner(
      cube,
      corner,
      solved
    );

    console.log(
      'Résultat :',
      result.success,
      'Raison :',
      result.reason,
      'Nœuds :',
      result.nodesVisited
    );

    if (!result.success) {

      // CORRECTION 2 : restaurer le cube.
      undoMoves(cube, solution);

      return {
        success: false,
        solution: []
      };
    }

    solution.push(...result.solution);
    solved.push(corner);
  }

  return {
    success: true,
    solution
  };
}

// Rotation d'un tableau.
function rotate<T>(arr: T[], n: number): T[] {
  return [
    ...arr.slice(n),
    ...arr.slice(0, n)
  ];
}

// Fonction principale de résolution des coins.
export function solveWhiteCorners(
  cube: Cube
): SearchResult {

  const candidateOrders: CornerConfig[][] = [];

  // Génération de huit ordres différents.
  for (let i = 0; i < CORNERS.length; i++) {

    const rotated = rotate(CORNERS, i);

    candidateOrders.push(
      rotated,
      [...rotated].reverse()
    );
  }

  // Essayer différents ordres.
  for (const order of candidateOrders) {

    console.log(
      'Ordre testé :',
      order.map(c => c.key).join(' → ')
    );

    const result = trySolveInOrder(
      cube,
      order
    );

    if (result.success) {
      return result;
    }
  }

  return {
    success: false,
    solution: []
  };
}
