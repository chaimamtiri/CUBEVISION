import { Component } from '@angular/core';
import { CubeNetComponent } from './components/cube-net/cube-net.component';
import { Cube } from './models/cube.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CubeNetComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  cube = new Cube();
}