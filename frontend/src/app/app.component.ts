import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './modules/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="pt-28"> <!-- spaziatura uguale all’altezza navbar -->
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}


