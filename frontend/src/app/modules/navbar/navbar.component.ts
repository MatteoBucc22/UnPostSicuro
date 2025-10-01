import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, AppUser } from '../auth/auth.services';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // undefined = caricamento in corso, null = non loggato, AppUser = loggato
  user: AppUser | null | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentAppUser.subscribe(async (user) => {
      if (user === undefined) {
        // sessione in caricamento, evita di mostrare guest
        this.user = undefined;
      } else if (user === null) {
        // nessun utente loggato
        this.user = null;
      } else {
        // utente loggato, assegna direttamente
        this.user = user;
      }
      console.log('[NavbarComponent] AppUser aggiornato:', this.user);
    });
  }

  logout(): void {
    this.authService.logout();
    this.user = null; // opzionale, sarà comunque aggiornato dal BehaviorSubject
  }

  // funzione helper per template
  isLoggedIn(): boolean {
    return this.user !== null && this.user !== undefined;
  }
}
