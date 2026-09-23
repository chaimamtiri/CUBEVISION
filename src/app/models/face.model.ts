import { Color } from './color';

export interface Face {
  color: Color[]; // un tableau de 9 couleurs représentant les 9 stickers d'une face du cube
                 
}

export function createSolvedFace(color: Color): Face {
  return { color: Array(9).fill(color) }; // crée une face résolue avec la couleur donnée
}
