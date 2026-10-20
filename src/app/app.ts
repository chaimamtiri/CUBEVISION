
import { Component } from '@angular/core';

import { Cube } from './models/cube.model';

import { CubeNetComponent } from
  './components/cube-net/cube-net.component';

import { RubiksCubeComponent } from
  './components/rubiks-cube/rubiks-cube';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CubeNetComponent,
    RubiksCubeComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  cube = new Cube();
}
