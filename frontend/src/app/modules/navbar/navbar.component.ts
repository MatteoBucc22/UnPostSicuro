import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.services';
import { User } from '@supabase/supabase-js';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: User | null | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      console.log('[NavbarComponent] Stato utente aggiornato:', user);
      this.user = user;
    });
  }

  logout(): void {
    console.log('[NavbarComponent] Logout richiesto.');
    this.authService.logout();
  }
}
