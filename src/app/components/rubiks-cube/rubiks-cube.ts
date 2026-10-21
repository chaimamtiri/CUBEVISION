
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';

import * as THREE from 'three';

import { OrbitControls } from
  'three/addons/controls/OrbitControls.js';

import { Cube } from '../../models/cube.model';

import { Move } from '../../models/move.util';

@Component({
  selector: 'app-rubiks-cube',
  standalone: true,
  templateUrl: './rubiks-cube.html',
  styleUrl: './rubiks-cube.scss'
})
export class RubiksCubeComponent
  implements AfterViewInit, OnDestroy {

  // Même modèle logique que celui de l'application
  @Input({ required: true }) cube!: Cube;

  @ViewChild('canvasContainer')
  container!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private resizeObserver?: ResizeObserver;

  // Groupe principal : les 26 cubelets
  private cubeGroup = new THREE.Group();

  // Groupe temporaire utilisé pour une rotation
  private rotationGroup = new THREE.Group();

  private isRotating = false;

  private cubeletGeometry =
    new THREE.BoxGeometry(0.94, 0.94, 0.94);

  private materials = {
    white: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    yellow: new THREE.MeshBasicMaterial({ color: 0xffd500 }),
    red: new THREE.MeshBasicMaterial({ color: 0xe02020 }),
    orange: new THREE.MeshBasicMaterial({ color: 0xff7a00 }),
    blue: new THREE.MeshBasicMaterial({ color: 0x1565c0 }),
    green: new THREE.MeshBasicMaterial({ color: 0x2eaf37 }),
    black: new THREE.MeshBasicMaterial({ color: 0x181818 })
  };

  // Animation de la face R
  
private activeRotation?: {
  elapsed: number;
  duration: number;
  angle: number;
  axis: 'x' | 'y' | 'z';
  pieces: THREE.Object3D[];
};


  private clock = new THREE.Clock();

  ngAfterViewInit(): void {
    if (typeof WebGL2RenderingContext === 'undefined') {
      return;
    }

    const element = this.container.nativeElement;

    // Scène
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111827);

    const width = element.clientWidth || 600;
    const height = element.clientHeight || 400;

    // Caméra
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

    // Contrôle de caméra
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

    // Construire les 26 cubelets
    this.createRubiksCube();

    this.scene.add(this.cubeGroup);
    this.scene.add(this.rotationGroup);

    // Adapter au redimensionnement
    this.resizeObserver = new ResizeObserver(() => {
      const w = element.clientWidth;
      const h = element.clientHeight;

      if (!w || !h || !this.renderer) return;

      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    this.resizeObserver.observe(element);

    // Boucle de rendu et d'animation
    this.clock.start();

    this.renderer.setAnimationLoop(() => {
      const delta = Math.min(this.clock.getDelta(), 0.05);

      this.updateRotation(delta);
      this.controls?.update();

      this.renderer?.render(
        this.scene,
        this.camera
      );
    });
  }

  private createRubiksCube(): void {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {

          if (x === 0 && y === 0 && z === 0) {
            continue;
          }

          this.cubeGroup.add(
            this.createCubelet(x, y, z)
          );
        }
      }
    }
  }

  private createCubelet(
    x: number,
    y: number,
    z: number
  ): THREE.Mesh {

    const m = this.materials;

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
    cubelet.userData['gridPosition'] = { x, y, z };

    return cubelet;
  }

  

rotateFace(move: Move): void {

  if (this.isRotating || !this.renderer) {
    return;
  }

  // Identifier la face
  const face = move[0];

  // Vérifier que la face est implémentée
  if (!['R', 'L', 'U', 'D', 'F'].includes(face)) {
    console.warn('Mouvement non implémenté :', move);
    return;
  }

  // Axe, couche et sens horaire
  let axis: 'x' | 'y' | 'z';
  let layer: number;
  let baseAngle: number;

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

    default:
      console.error('Face inconnue :', face);
      return;
  }


  // Sélectionner les neuf cubelets de la couche
  const pieces = this.cubeGroup.children.filter(
    piece => Math.round(piece.position[axis]) === layer
  );

  if (pieces.length !== 9) {
    console.error(
      `Erreur : ${face} contient ${pieces.length} cubelets`
    );
    return;
  }

  // 1 pour un quart de tour horaire
  // -1 pour un quart de tour inverse
  // 2 pour un demi-tour
  const turns = move.endsWith('2')
    ? 2
    : move.endsWith("'")
      ? -1
      : 1;

  const angle = baseAngle * turns;

  // Appliquer le mouvement logique
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


    default:
      return;
  }

  this.isRotating = true;

  // Préparer le groupe temporaire
  this.scene.updateMatrixWorld(true);

  for (const piece of pieces) {
    this.rotationGroup.attach(piece);
  }

  // Préparer l'animation
  this.activeRotation = {
    elapsed: 0,
    duration: turns === 2 ? 0.5 : 0.35,
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


private updateRotation(delta: number): void {

  const rotation = this.activeRotation;

  if (!rotation) return;

  rotation.elapsed += delta;

  // Progression entre 0 et 1
  const progress = Math.min(
    rotation.elapsed / rotation.duration,
    1
  );

  // Animation fluide : smoothstep
  const eased =
    progress * progress * (3 - 2 * progress);

  // Tourner sur l'axe sélectionné
  this.rotationGroup.rotation[rotation.axis] =
    rotation.angle * eased;

  if (progress < 1) return;

  // Appliquer l'angle final exact
  this.rotationGroup.rotation[rotation.axis] =
    rotation.angle;

  // Recalculer les transformations mondiales
  this.scene.updateMatrixWorld(true);

  // Replacer les cubelets dans le groupe principal
  for (const piece of rotation.pieces) {

    this.cubeGroup.attach(piece);

    // Corriger les imprécisions numériques
    piece.position.set(
      Math.round(piece.position.x),
      Math.round(piece.position.y),
      Math.round(piece.position.z)
    );

    piece.quaternion.normalize();

    piece.userData['gridPosition'] = {
      x: piece.position.x,
      y: piece.position.y,
      z: piece.position.z
    };
  }

  // Réinitialiser le groupe temporaire
  this.rotationGroup.rotation.set(0, 0, 0);

  this.activeRotation = undefined;
  this.isRotating = false;

  console.log('Animation terminée');
}


  ngOnDestroy(): void {
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
