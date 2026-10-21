
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, inject, ViewChild } from '@angular/core';

import * as THREE from 'three';

import { OrbitControls } from
  'three/addons/controls/OrbitControls.js';

import { Cube } from '../../models/cube.model';
import { Move } from '../../models/move.util';
import { generateScramble } from '../../models/scramble.util';

type Axis = 'x' | 'y' | 'z';

interface ActiveRotation {
  elapsed: number;
  duration: number;
  angle: number;
  axis: Axis;
  pieces: THREE.Object3D[];
}

@Component({
  selector: 'app-rubiks-cube',
  standalone: true,
  templateUrl: './rubiks-cube.html',
  styleUrl: './rubiks-cube.scss'
})
export class RubiksCubeComponent
  implements AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private lastScrambleUiState = '';


  // ModÃƒÂ¨le logique partagÃƒÂ© avec le cube 2D
  @Input({ required: true })
  cube!: Cube;

  @ViewChild('canvasContainer')
  container!: ElementRef<HTMLDivElement>;

  // THREE.JS
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private resizeObserver?: ResizeObserver;

  // Groupe contenant les 26 cubelets
  private cubeGroup = new THREE.Group();

  // Groupe temporaire pour animer une face
  private rotationGroup = new THREE.Group();

  // Ãƒâ€°tat de l'animation
  private isRotating = false;
  private activeRotation?: ActiveRotation;

  // File d'attente pour le Scramble
  private pendingMoves: Move[] = [];

  // Horloge THREE.JS
  private clock = new THREE.Clock();

  // GÃƒÂ©omÃƒÂ©trie commune aux 26 cubelets
  private cubeletGeometry =
    new THREE.BoxGeometry(0.94, 0.94, 0.94);

  // MatÃƒÂ©riaux
  private materials = {
    white: new THREE.MeshBasicMaterial({
      color: 0xffffff
    }),
    yellow: new THREE.MeshBasicMaterial({
      color: 0xffd500
    }),
    red: new THREE.MeshBasicMaterial({
      color: 0xe02020
    }),
    orange: new THREE.MeshBasicMaterial({
      color: 0xff7a00
    }),
    blue: new THREE.MeshBasicMaterial({
      color: 0x1565c0
    }),
    green: new THREE.MeshBasicMaterial({
      color: 0x2eaf37
    }),
    black: new THREE.MeshBasicMaterial({
      color: 0x181818
    })
  };

  scrambleNotation = '';
  scrambleTotal = 0;
  scrambleCompleted = 0;
  currentScrambleMove: Move | null = null;

  get isScrambling(): boolean {
  return this.currentScrambleMove !== null;
}

  // =====================================
  // 1. INITIALISATION THREE.JS
  // =====================================

  ngAfterViewInit(): void {

    if (typeof WebGL2RenderingContext === 'undefined') {
      console.error('WebGL2 non disponible');
      return;
    }

    const element = this.container.nativeElement;

    const width = element.clientWidth || 600;
    const height = element.clientHeight || 400;

    // ScÃƒÂ¨ne
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111827);

    // CamÃƒÂ©ra
    this.camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      100
    );

    this.camera.position.set(5, 5, 7);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
    } catch (error) {
      console.error('WebGL indisponible :', error);
      return;
    }

    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    element.appendChild(this.renderer.domElement);

    // ContrÃƒÂ´le de camÃƒÂ©ra
    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 15;
    this.controls.update();

    // Construction des 26 cubelets
    this.createRubiksCube();

    // Ajout des groupes ÃƒÂ  la scÃƒÂ¨ne
    this.scene.add(this.cubeGroup);
    this.scene.add(this.rotationGroup);

    // Adapter le rendu ÃƒÂ  la taille du conteneur
    this.resizeObserver = new ResizeObserver(() => {

      const w = element.clientWidth;
      const h = element.clientHeight;

      if (!w || !h || !this.renderer) {
        return;
      }

      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(w, h);
    });

    this.resizeObserver.observe(element);

    // Boucle principale
    this.clock.start();

    this.renderer.setAnimationLoop(() => {

      const delta = Math.min(
        this.clock.getDelta(),
        0.05
      );

      this.updateRotation(delta);

      const uiState =
        `${this.scrambleCompleted}|${this.scrambleTotal}|${this.currentScrambleMove ?? ''}`;

      if (uiState !== this.lastScrambleUiState) {
        this.lastScrambleUiState = uiState;
        this.cdr.detectChanges();
      }

      this.controls?.update();

      this.renderer?.render(
        this.scene,
        this.camera
      );
    });
  }

  // =====================================
  // 2. CONSTRUIRE LE RUBIK'S CUBE
  // =====================================

  private createRubiksCube(): void {

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {

          // Exclure uniquement le centre interne
          if (x === 0 && y === 0 && z === 0) {
            continue;
          }

          const cubelet = this.createCubelet(
            x,
            y,
            z
          );

          this.cubeGroup.add(cubelet);
        }
      }
    }

    console.log(
      'Cubelets crÃƒÂ©ÃƒÂ©s :',
      this.cubeGroup.children.length
    );
  }

  private createCubelet(
    x: number,
    y: number,
    z: number
  ): THREE.Mesh {

    const m = this.materials;

    // Ordre THREE.JS :
    // +X, -X, +Y, -Y, +Z, -Z
    const faceMaterials = [
      x === 1 ? m.red : m.black,
      x === -1 ? m.orange : m.black,
      y === 1 ? m.white : m.black,
      y === -1 ? m.yellow : m.black,
      z === 1 ? m.green : m.black,
      z === -1 ? m.blue : m.black
    ];

    const cubelet = new THREE.Mesh(
      this.cubeletGeometry,
      faceMaterials
    );

    cubelet.position.set(x, y, z);

    cubelet.userData['gridPosition'] = {
      x,
      y,
      z
    };

    cubelet.userData['homePosition'] = { x, y, z };

    return cubelet;
  }

  // =====================================
  // 3. EFFECTUER UNE ROTATION
  // =====================================

  rotateFace(move: Move): void {

    // Ne pas interrompre une animation
    if (this.isRotating || !this.renderer) {
      return;
    }

    const face = move[0];

    // VÃƒÂ©rifier que la face est implÃƒÂ©mentÃƒÂ©e
    if (!['R', 'L', 'U', 'D', 'F', 'B'].includes(face)) {
      console.warn('Mouvement non reconnu :', move);
      return;
    }

    let axis: Axis;
    let layer: number;
    let baseAngle: number;

    // DÃƒÂ©terminer l'axe et la couche
    switch (face) {

      case 'R':
        axis = 'x';
        layer = 1;
        baseAngle = -Math.PI / 2;
        break;

      case 'L':
        axis = 'x';
        layer = -1;
        baseAngle = Math.PI / 2;
        break;

      case 'U':
        axis = 'y';
        layer = 1;
        baseAngle = -Math.PI / 2;
        break;

      case 'D':
        axis = 'y';
        layer = -1;
        baseAngle = Math.PI / 2;
        break;

      case 'F':
        axis = 'z';
        layer = 1;
        baseAngle = -Math.PI / 2;
        break;

      case 'B':
        axis = 'z';
        layer = -1;
        baseAngle = Math.PI / 2;
        break;

      default:
        console.error('Face inconnue :', face);
        return;
    }

    // VÃƒÂ©rification du groupe temporaire
    if (this.rotationGroup.children.length !== 0) {
      console.error(
        'Le groupe de rotation contient encore des piÃƒÂ¨ces'
      );
      return;
    }

    // IMPORTANT :
    // RÃƒÂ©initialiser la transformation AVANT
    // de prÃƒÂ©parer une nouvelle animation.
    this.rotationGroup.position.set(0, 0, 0);
    this.rotationGroup.rotation.set(0, 0, 0);
    this.rotationGroup.scale.set(1, 1, 1);
    this.rotationGroup.updateMatrixWorld(true);

    // SÃƒÂ©lection des neuf cubelets
    const pieces = this.cubeGroup.children.filter(
      piece =>
        Math.round(piece.position[axis]) === layer
    );

    if (pieces.length !== 9) {
      console.error(
        `Erreur : ${face} contient ${pieces.length} cubelets`
      );
      return;
    }

    // DÃƒÂ©terminer le nombre de quarts de tour
    const turns = move.endsWith('2')
      ? 2
      : move.endsWith("'")
        ? -1
        : 1;

    const angle = baseAngle * turns;

    // Mettre ÃƒÂ  jour le cube logique
    switch (move) {

      case 'R':
        this.cube.moveR();
        break;

      case "R'":
        this.cube.moveRPrime();
        break;

      case 'R2':
        this.cube.moveR2();
        break;

      case 'L':
        this.cube.moveL();
        break;

      case "L'":
        this.cube.moveLPrime();
        break;

      case 'L2':
        this.cube.moveL2();
        break;

      case 'U':
        this.cube.moveU();
        break;

      case "U'":
        this.cube.moveUPrime();
        break;

      case 'U2':
        this.cube.moveU2();
        break;

      case 'D':
        this.cube.moveD();
        break;

      case "D'":
        this.cube.moveDPrime();
        break;

      case 'D2':
        this.cube.moveD2();
        break;

      case 'F':
        this.cube.moveF();
        break;

      case "F'":
        this.cube.moveFPrime();
        break;

      case 'F2':
        this.cube.moveF2();
        break;

      case 'B':
        this.cube.moveB();
        break;

      case "B'":
        this.cube.moveBPrime();
        break;

      case 'B2':
        this.cube.moveB2();
        break;

      default:
        return;
    }

    // Bloquer les mouvements pendant l'animation
    this.isRotating = true;

    // Actualiser les matrices mondiales
    this.scene.updateMatrixWorld(true);

    // Attacher les neuf piÃƒÂ¨ces au groupe temporaire
    for (const piece of pieces) {
      this.rotationGroup.attach(piece);
    }

    // PrÃƒÂ©parer l'animation
    this.activeRotation = {
      elapsed: 0,
      duration: Math.abs(turns) === 2 ? 0.5 : 0.35,
      angle,
      axis,
      pieces
    };

    console.log(
      'Mouvement :', move,
      '| Axe :', axis,
      '| Couche :', layer
    );
  }

  // =====================================
  // 4. ANIMER LA ROTATION
  // =====================================

  private updateRotation(delta: number): void {

    const rotation = this.activeRotation;

    if (!rotation) {
      return;
    }

    rotation.elapsed += delta;

    // Progression entre 0 et 1
    const progress = Math.min(
      rotation.elapsed / rotation.duration,
      1
    );

    // Animation fluide : smoothstep
    const eased =
      progress * progress * (3 - 2 * progress);

    // Tourner autour de l'axe choisi
    this.rotationGroup.rotation[rotation.axis] =
      rotation.angle * eased;

    // Attendre la fin
    if (progress < 1) {
      return;
    }

    // Appliquer prÃƒÂ©cisÃƒÂ©ment l'angle final
    this.rotationGroup.rotation[rotation.axis] =
      rotation.angle;

    // IMPORTANT :
    // Mettre ÃƒÂ  jour toutes les matrices
    // avant de dÃƒÂ©tacher les cubelets.
    this.scene.updateMatrixWorld(true);

    // Replacer les neuf cubelets dans cubeGroup
    for (const piece of rotation.pieces) {

      // Conserver la transformation mondiale
      this.cubeGroup.attach(piece);

      // Replacer exactement sur la grille
      piece.position.set(
        Math.round(piece.position.x),
        Math.round(piece.position.y),
        Math.round(piece.position.z)
      );

      // Normaliser l'orientation
      piece.quaternion.normalize();

      // Mettre ÃƒÂ  jour les coordonnÃƒÂ©es
      piece.userData['gridPosition'] = {
        x: piece.position.x,
        y: piece.position.y,
        z: piece.position.z
      };
    }

    // CORRECTION :
    // Vider les transformations du groupe
    // aprÃƒÂ¨s le retour des cubelets.
    this.rotationGroup.position.set(0, 0, 0);
    this.rotationGroup.rotation.set(0, 0, 0);
    this.rotationGroup.scale.set(1, 1, 1);
    this.rotationGroup.updateMatrixWorld(true);

    // Terminer l'animation
    this.activeRotation = undefined;
    this.isRotating = false;
    if (this.currentScrambleMove !== null) {
      this.scrambleCompleted++;
    }

    // VÃƒÂ©rification de l'intÃƒÂ©gritÃƒÂ© du cube
    this.checkCubeIntegrity();

    console.log('Animation terminÃƒÂ©e');

    // Passer au mouvement suivant du Scramble
    if (this.pendingMoves.length > 0) {
      this.playNextMove();
    } else if (this.currentScrambleMove !== null) {
      this.currentScrambleMove = null;
      console.log('Scramble terminÃƒÂ© !');
}
  }

  // =====================================
  // 5. VÃƒâ€°RIFIER L'INTÃƒâ€°GRITÃƒâ€° DU CUBE
  // =====================================

  private checkCubeIntegrity(): void {

    // Un Rubik's Cube 3x3 a 26 cubelets visibles
    if (this.cubeGroup.children.length !== 26) {
      console.error(
        'Nombre incorrect de cubelets :',
        this.cubeGroup.children.length
      );
    }

    // VÃƒÂ©rifier l'unicitÃƒÂ© des 26 positions
    const positions = new Set<string>();

    for (const piece of this.cubeGroup.children) {

      const x = Math.round(piece.position.x);
      const y = Math.round(piece.position.y);
      const z = Math.round(piece.position.z);

      const key = `${x},${y},${z}`;

      if (
        Math.abs(x) > 1 ||
        Math.abs(y) > 1 ||
        Math.abs(z) > 1 ||
        (x === 0 && y === 0 && z === 0)
      ) {
        console.error(
          'Cubelet hors de la grille :',
          key
        );
      }

      if (positions.has(key)) {
        console.error(
          'Deux cubelets occupent la mÃƒÂªme position :',
          key
        );
      }

      positions.add(key);
    }

    if (positions.size !== 26) {
      console.error(
        'Positions uniques incorrectes :',
        positions.size
      );
    }
  }

  // =====================================
  // 6. SCRAMBLE
  // =====================================

  startScramble(): void {

    // EmpÃƒÂªcher deux Scrambles simultanÃƒÂ©s
    if (
      this.isRotating ||
      this.pendingMoves.length > 0 ||
      !this.renderer
    ) {
      return;
    }

    // GÃƒÂ©nÃƒÂ©rer 20 mouvements
    this.pendingMoves = generateScramble(20);
    this.scrambleTotal = this.pendingMoves.length;
    this.scrambleCompleted = 0;
    this.currentScrambleMove = null;
    this.scrambleNotation = this.pendingMoves.join(' ');

    console.log(
      'Scramble :',
      this.pendingMoves.join(' ')
    );

    // DÃƒÂ©marrer l'animation
    this.playNextMove();
  }

  
private playNextMove(): void {
  const move = this.pendingMoves.shift();

  if (!move) {
    this.currentScrambleMove = null;
    console.log('Scramble terminÃƒÂ© !');
    return;
  }

  this.currentScrambleMove = move;
  this.rotateFace(move);
}


  // =====================================
  // 7. NETTOYAGE
  // =====================================

    // =====================================
  // RESET : revenir au cube resolu
  // =====================================

  resetCube(): void {

    // Interdire Reset pendant une animation
    if (
      this.isRotating ||
      this.activeRotation ||
      this.pendingMoves.length > 0
    ) {
      return;
    }

    // Restaurer le modele logique sans
    // remplacer sa reference partagee
    Object.assign(this.cube, new Cube());

    // Restaurer les 26 cubelets 3D
    for (const piece of this.cubeGroup.children) {

      const home = piece.userData['homePosition'] as {
        x: number;
        y: number;
        z: number;
      };

      piece.position.set(home.x, home.y, home.z);

      // Orientation initiale
      piece.quaternion.identity();

      piece.scale.set(1, 1, 1);

      piece.userData['gridPosition'] = {
        x: home.x,
        y: home.y,
        z: home.z
      };
    }

    // Remettre le groupe temporaire au repos
    this.rotationGroup.position.set(0, 0, 0);
    this.rotationGroup.rotation.set(0, 0, 0);
    this.rotationGroup.scale.set(1, 1, 1);

    // Reinitialiser le Scramble
    this.pendingMoves = [];
    this.scrambleNotation = '';
    this.scrambleTotal = 0;
    this.scrambleCompleted = 0;
    this.currentScrambleMove = null;

    this.scene.updateMatrixWorld(true);

    this.checkCubeIntegrity();

    // Actualiser Angular
    this.cdr.detectChanges();

    console.log('Cube reinitialise !');
  }
  ngOnDestroy(): void {

    this.pendingMoves = [];
    this.activeRotation = undefined;

    this.resizeObserver?.disconnect();

    this.renderer?.setAnimationLoop(null);

    this.controls?.dispose();

    this.cubeletGeometry.dispose();

    Object.values(this.materials).forEach(
      material => material.dispose()
    );

    this.cubeGroup.clear();
    this.rotationGroup.clear();

    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}

