import { Cube } from '../cube.model';
import { Move } from '../move.util';
import { Color } from '../color';

const AXIS: Record<string, string> = {
  U: 'UD', D: 'UD', L: 'LR', R: 'LR', F: 'FB', B: 'FB',
};

const INVERSE: Record<Move, Move> = {
  'R': "R'", "R'": 'R', 'R2': 'R2',
  'L': "L'", "L'": 'L', 'L2': 'L2',
  'U': "U'", "U'": 'U', 'U2': 'U2',
  'D': "D'", "D'": 'D', 'D2': 'D2',
  'F': "F'", "F'": 'F', 'F2': 'F2',
  'B': "B'", "B'": 'B', 'B2': 'B2',
};

const DISPATCH: Record<Move, (c: Cube) => void> = {
  'R': c => c.moveR(), "R'": c => c.moveRPrime(), 'R2': c => c.moveR2(),
  'L': c => c.moveL(), "L'": c => c.moveLPrime(), 'L2': c => c.moveL2(),
  'U': c => c.moveU(), "U'": c => c.moveUPrime(), 'U2': c => c.moveU2(),
  'D': c => c.moveD(), "D'": c => c.moveDPrime(), 'D2': c => c.moveD2(),
  'F': c => c.moveF(), "F'": c => c.moveFPrime(), 'F2': c => c.moveF2(),
  'B': c => c.moveB(), "B'": c => c.moveBPrime(), 'B2': c => c.moveB2(),
};

const COLOR_CODE: Record<Color, string> = {
  WHITE: 'w', YELLOW: 'y', RED: 'r', ORANGE: 'o', BLUE: 'b', GREEN: 'g',
};

function serialize(cube: Cube): string {
  let out = '';
  for (const k of ['U', 'D', 'L', 'R', 'F', 'B'] as const) {
    for (const c of cube[k].color) out += COLOR_CODE[c];
  }
  return out;
}

const MAX_VISITED_ENTRIES = 300_000;
const DEFAULT_NODE_BUDGET = 2_000_000; // plafond dur : garantit un temps d'exécution borné, même dans le pire cas

class NodeBudgetExceeded extends Error {}

function search(
  cube: Cube,
  isGoal: (c: Cube) => boolean,
  allowedMoves: Move[],
  depthLeft: number,
  path: Move[],
  lastFace: string | null,
  visited: Map<string, number>,
  nodeCounter: { count: number; budget: number },
): boolean {
  nodeCounter.count++;
  if (nodeCounter.count > nodeCounter.budget) {
    throw new NodeBudgetExceeded();
  }

  if (isGoal(cube)) return true;
  if (depthLeft === 0) return false;

  const key = `${serialize(cube)}:${lastFace ?? '-'}`;
  const bestKnown = visited.get(key);
  if (bestKnown !== undefined && bestKnown >= depthLeft) {
    return false;
  }
  if (visited.size < MAX_VISITED_ENTRIES) {
    visited.set(key, depthLeft);
  }

  for (const move of allowedMoves) {
    const face = move[0];
    if (lastFace !== null) {

    // Deux mouvements successifs sur la meme face
    // peuvent toujours etre simplifies.
    if (face === lastFace) {
      continue;
    }

    // Pour les faces opposees d'un meme axe,
    // ne garder qu'un seul ordre canonique.
    if (
      AXIS[face] === AXIS[lastFace] &&
      face < lastFace
    ) {
      continue;
    }
  }

    DISPATCH[move](cube);
    path.push(move);

    let found: boolean;
    try {
      found = search(cube, isGoal, allowedMoves, depthLeft - 1, path, face, visited, nodeCounter);
    } catch (error) {
      path.pop();
      DISPATCH[INVERSE[move]](cube);
      throw error;
    }

    if (found) {
      return true;
    }

    path.pop();
    DISPATCH[INVERSE[move]](cube);
  }
  return false;
}

export interface SearchResult {
  success: boolean;
  solution: Move[];
  reason?: 'depth-limit' | 'node-budget';
  nodesVisited?: number;
}


export function restrictedSearch(
  cube: Cube,
  isGoal: (c: Cube) => boolean,
  allowedMoves: Move[],
  maxDepth = 8,
  nodeBudget = DEFAULT_NODE_BUDGET,
): SearchResult {

  const nodeCounter = {
    count: 0,
    budget: nodeBudget
  };

  try {
    for (let depth = 0; depth <= maxDepth; depth++) {

      const path: Move[] = [];
      const visited = new Map<string, number>();

      if (
        search(
          cube,
          isGoal,
          allowedMoves,
          depth,
          path,
          null,
          visited,
          nodeCounter
        )
      ) {
        return {
          success: true,
          solution: path,
          nodesVisited: nodeCounter.count
        };
      }
    }
  } catch (e) {

    if (e instanceof NodeBudgetExceeded) {
      console.warn(
        'Budget de recherche épuisé :',
        nodeCounter.count,
        'nœuds explorés'
      );

      return {
        success: false,
        solution: [],
        reason: 'node-budget',
        nodesVisited: nodeCounter.count
      };
    }

    throw e;
  }

  console.warn(
    'Aucune solution trouvée avant la profondeur',
    maxDepth
  );

  return {
    success: false,
    solution: [],
    reason: 'depth-limit',
    nodesVisited: nodeCounter.count
  };
}
